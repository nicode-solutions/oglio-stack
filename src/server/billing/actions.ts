"use server";

import { cancelSubscription, createCheckout, getProduct, getSubscription, listPrices, listProducts, updateSubscription, type Variant } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/utils/lemonsqueezy/lemonsqueezy";
import { TablesInsert, Tables } from "@/types/supabase";
import { createSSRClient, createServiceClient } from "@/utils/supabase/server";

// Syncs all the plans from Lemon Squeezy to the database.
export async function syncPlans() {
    configureLemonSqueezy();

    const supabase = createServiceClient();

    let plans: Tables<'plans'>[] = [];
    const { data: dbPlans, error } = await supabase.from("plans").select();
    if (dbPlans) plans = dbPlans;

    // Helper function to add a variant to the plans array and sync it with the database.
    async function _addPlan(plan: TablesInsert<"plans">) {
        // Upsert the plan using variant_id as the unique key
        const { error, data: newPlan } = await supabase
            .from("plans")
            .upsert(plan, {
                onConflict: 'variantId',
                ignoreDuplicates: false
            })
            .select()
            .single();

        if (error) {
            console.error(`Failed to upsert plan for variant ${plan.variantId}:`, error);
            throw new Error(`Failed to sync plan: ${error.message}`);
        }

        if (newPlan) plans.push(newPlan);
    }

    if (error) {
        console.error("Failed to fetch plans:", error);
        throw new Error(`Failed to fetch plans: ${error.message}`);
    }

    // Fetch products from the Lemon Squeezy store.
    const products = await listProducts({
        filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
        include: ["variants"],
    });

    // Loop through all the variants.
    const allVariants = products.data?.included as Variant["data"][] | undefined;

    // for...of supports asynchronous operations, unlike forEach.
    if (allVariants) {
        for (const v of allVariants) {
            const variant = v.attributes;

            // Skip draft variants or if there's more than one variant, skip the default
            // variant. See https://docs.lemonsqueezy.com/api/variants
            if (
                variant.status === "draft" ||
                (allVariants.length !== 1 && variant.status === "pending")
            ) {
                continue
            }

            // Fetch the Product name.
            const productName =
                (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

            // Fetch the Price object.
            const variantPriceObject = await listPrices({
                filter: {
                    variantId: v.id,
                },
            });

            const currentPriceObj = variantPriceObject.data?.data.at(0);

            const interval = currentPriceObj?.attributes.renewal_interval_unit;
            const intervalCount =
                currentPriceObj?.attributes.renewal_interval_quantity;
            const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
            const trialIntervalCount =
                currentPriceObj?.attributes.trial_interval_quantity;

            const price = currentPriceObj?.attributes.unit_price;

            const isSubscription =
                currentPriceObj?.attributes.category === "subscription";

            // If not a subscription, skip it.
            if (!isSubscription || !price) {
                continue;
            }

            const plan: TablesInsert<"plans"> = {
                name: variant.name,
                description: variant.description,
                price,
                interval: interval ?? null,
                intervalCount: intervalCount ?? null,
                isUsageBased: false,
                productId: variant.product_id,
                variantId: parseInt(v.id),
                productName: productName,
                trialInterval: trialInterval ?? null,
                trialIntervalCount: trialIntervalCount ?? null,
                sort: variant.sort,
            }

            await _addPlan(plan);
        }
    }

    return plans;
}

// Get plans from the database.
export async function getPlans() {
    const supabase = await createSSRClient();

    const { data, error } = await supabase.from("plans").select();

    if (data?.length === 0) {
        const plans = await syncPlans();
        return plans;
    }

    if (error) {
        console.error("Failed to fetch plans:", error);
        throw new Error(`Failed to fetch plans: ${error.message}`);
    }

    return data;
}

/**
 * This action will create a checkout on Lemon Squeezy.
 */
export async function getCheckoutURL(variantId: number, embed = false) {
    configureLemonSqueezy();
    const supabase = await createSSRClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User is not authenticated.");
    }

    const checkout = await createCheckout(
        process.env.LEMONSQUEEZY_STORE_ID!,
        variantId,
        {
            checkoutOptions: {
                embed,
                media: false,
                logo: !embed,
            },
            checkoutData: {
                email: user.email ?? undefined,
                custom: {
                    user_id: user.id,
                },
            },
            productOptions: {
                enabledVariants: [variantId],
                redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing/`,
                receiptButtonText: "Go to Dashboard",
                receiptThankYouNote: "Thank you for signing up to Lemon Stand!",
            },
        },
    );

    return checkout.data?.data.attributes.url;
}

/**
 * This action will get the subscriptions for the current user.
 */
export async function getUserSubscriptions() {
    const supabase = await createSSRClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User is not authenticated.");
    }

    const { data: userSubscriptions, error } = await supabase
        .from("subscriptions")
        .select()
        .eq("userId", user.id);

    if (error) {
        console.error("Error fetching user subscriptions:", error);
        return [];
    }

    return userSubscriptions;
}

/**
 * This action will get the subscription URLs (update_payment_method and
 * customer_portal) for the given subscription ID.
 *
 */
export async function getSubscriptionURLs(id: string) {
    configureLemonSqueezy();
    const subscription = await getSubscription(id);

    if (subscription.error) {
        throw new Error(subscription.error.message);
    }

    return subscription.data.data.attributes.urls;
}

/**
 * This action will cancel a subscription on Lemon Squeezy.
 */
export async function cancelSub(id: string) {
    configureLemonSqueezy();

    const supabase = await createSSRClient();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonsqueezyId === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const cancelledSub = await cancelSubscription(id);

    if (cancelledSub.error) {
        throw new Error(cancelledSub.error.message);
    }

    // Update the db
    const { error } = await supabase.from("subscriptions").update({
        status: cancelledSub.data.data.attributes.status,
        statusFormatted: cancelledSub.data.data.attributes.status_formatted,
        endsAt: cancelledSub.data.data.attributes.ends_at,
    }).eq("lemonsqueezyId", id);

    if (error) {
        throw new Error(`Failed to cancel Subscription #${id} in the database.`);
    }

    return cancelledSub;
}

/**
 * This action will pause a subscription on Lemon Squeezy.
 */
export async function pauseUserSubscription(id: string) {
    configureLemonSqueezy();

    const supabase = await createSSRClient();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonsqueezyId === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, {
        pause: {
            mode: "void",
        },
    });

    // Update the db
    const { error } = await supabase.from("subscriptions").update({
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
    }).eq("lemonsqueezyId", id);

    if (error) {
        throw new Error(`Failed to pause Subscription #${id} in the database.`);
    }

    return returnedSub;
}

/**
 * This action will unpause a subscription on Lemon Squeezy.
 */
export async function unpauseUserSubscription(id: string) {
    configureLemonSqueezy();

    const supabase = await createSSRClient();

    // Get user subscriptions
    const userSubscriptions = await getUserSubscriptions();

    // Check if the subscription exists
    const subscription = userSubscriptions.find(
        (sub) => sub.lemonsqueezyId === id,
    );

    if (!subscription) {
        throw new Error(`Subscription #${id} not found.`);
    }

    const returnedSub = await updateSubscription(id, { pause: null });

    // Update the db
    const { error } = await supabase.from("subscriptions").update({
        status: returnedSub.data?.data.attributes.status,
        statusFormatted: returnedSub.data?.data.attributes.status_formatted,
        endsAt: returnedSub.data?.data.attributes.ends_at,
        isPaused: returnedSub.data?.data.attributes.pause !== null,
    }).eq("lemonsqueezyId", id);

    if (error) {
        throw new Error(`Failed to pause Subscription #${id} in the database.`);
    }

    return returnedSub;
}
