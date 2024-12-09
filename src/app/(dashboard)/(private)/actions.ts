"use server";

import { getProduct, listPrices, listProducts, type Variant } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/utils/lemonsqueezy/lemonsqueezy";

// Syncs all the plans from Lemon Squeezy to the database.
export async function syncPlans() {
    configureLemonSqueezy();

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
            const isUsageBased =
                currentPriceObj?.attributes.usage_aggregation !== null;
            const interval = currentPriceObj?.attributes.renewal_interval_unit;
            const intervalCount =
                currentPriceObj?.attributes.renewal_interval_quantity;
            const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
            const trialIntervalCount =
                currentPriceObj?.attributes.trial_interval_quantity;

            const price = isUsageBased
                ? currentPriceObj?.attributes.unit_price_decimal
                : currentPriceObj.attributes.unit_price;

            const isSubscription =
                currentPriceObj?.attributes.category === "subscription";

            // If not a subscription, skip it.
            if (!isSubscription) {
                continue;
            }

            console.log({
                id: v.id,
                name: variant.name,
                description: variant.description,
                price,
                interval: interval ?? null,
                interval_count: intervalCount ?? null,
                is_usage_based: isUsageBased,
                product_id: variant.product_id,
                product_name: productName,
                trial_interval: trialInterval ?? null,
                trial_interval_count: trialIntervalCount ?? null,
                sort: variant.sort,
            });
        }
    }

    return { products: products };
}