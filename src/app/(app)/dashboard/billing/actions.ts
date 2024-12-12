"use server";

import { createCheckout, getProduct, listPrices, listProducts, type Variant } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/utils/lemonsqueezy/lemonsqueezy";
import { TablesInsert, Tables } from "@/types/supabase";
import { createSSRClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Syncs all the plans from Lemon Squeezy to the database.
export async function syncPlans() {
    configureLemonSqueezy();

    const supabase = await createSSRClient();

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