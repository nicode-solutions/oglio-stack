
import { getPrice } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/utils/lemonsqueezy/lemonsqueezy";
import { TablesInsert, Tables, Json } from "@/types/supabase";
import { createServiceClient } from "@/utils/supabase/server";
import { webhookHasData, webhookHasMeta } from "@/lib/typeguards";

/**
 * This action will store a webhook event in the database.
 * @param eventName - The name of the event.
 * @param body - The body of the event.
 * @returns The stored webhook event.
 */
export async function storeWebhookEvent(
    eventName: string,
    body: Json,
): Promise<Tables<'webhook_event'> | undefined> {
    const supabase = await createServiceClient();

    const { data, error } = await supabase.from("webhook_event").insert({
        eventName,
        body,
    }).select("*").single();

    if (error) {
        console.error("Failed to store webhook event:", error);
        throw new Error(`Failed to store webhook event: ${error.message}`);
    }

    return data;
}

/**
 * This action will process a webhook event.
 * @param webhookEvent - The the webhook event.
 */
export async function processWebhookEvent(webhookEvent: Tables<"webhook_event">) {
    configureLemonSqueezy();

    const supabase = await createServiceClient();

    const { data: dbWebhookEvent, error } = await supabase.from("webhook_event").select("*").eq("id", webhookEvent.id).single();

    if (error || !dbWebhookEvent) {
        console.error(`Webhook event #${webhookEvent.id} not found in the database.`, error);
        throw new Error(
            `Webhook event #${webhookEvent.id} not found in the database.`,
        );
    }

    if (!process.env.WEBHOOK_URL) {
        throw new Error(
            "Missing required WEBHOOK_URL env variable. Please, set it in your .env file.",
        );
    }

    let processingError = "";
    const eventBody = webhookEvent.body;

    if (!webhookHasMeta(eventBody)) {
        processingError = "Event body is missing the 'meta' property.";
    } else if (webhookHasData(eventBody)) {
        if (webhookEvent.eventName.startsWith("subscription_payment_")) {
            // Save subscription invoices; eventBody is a SubscriptionInvoice
            // Not implemented.
        } else if (webhookEvent.eventName.startsWith("subscription_")) {
            // Save subscription events; obj is a Subscription
            const attributes = eventBody.data.attributes;
            const variantId = attributes.variant_id as string;

            // We assume that the Plan table is up to date.
            const { data: plan, error } = await supabase.from("plans").select("*").eq("variantId", variantId).single();

            if (error || !plan) {
                processingError = `Plan with variantId ${variantId} not found.`;
            } else {
                // Update the subscription in the database.

                const priceId = attributes.first_subscription_item.price_id;

                // Get the price data from Lemon Squeezy.
                const priceData = await getPrice(priceId);
                if (priceData.error) {
                    processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
                }

                const price = priceData.data?.data.attributes.unit_price;

                const updateData: TablesInsert<"subscriptions"> = {
                    lemonsqueezyId: eventBody.data.id,
                    orderId: attributes.order_id as number,
                    name: attributes.user_name as string,
                    email: attributes.user_email as string,
                    status: attributes.status as string,
                    statusFormatted: attributes.status_formatted as string,
                    renewsAt: attributes.renews_at as string,
                    endsAt: attributes.ends_at as string,
                    trialEndsAt: attributes.trial_ends_at as string,
                    price: price || 0,
                    isPaused: false,
                    subscriptionItemId: attributes.first_subscription_item.id,
                    isUsageBased: attributes.first_subscription_item.is_usage_based,
                    userId: eventBody.meta.custom_data.user_id,
                    planId: plan.id,
                };

                // Create/update subscription in the database.
                try {
                    const { error } = await supabase.from("subscriptions").upsert(updateData, {
                        onConflict: 'lemonsqueezyId',
                        ignoreDuplicates: false
                    });

                    if (error) {
                        processingError = `Failed to upsert Subscription #${updateData.lemonsqueezyId} to the database.`;
                        console.error(error);
                    }
                } catch (error) {
                    processingError = `Failed to upsert Subscription #${updateData.lemonsqueezyId} to the database.`;
                    console.error(error);
                }
            }
        } else if (webhookEvent.eventName.startsWith("order_")) {
            // Save orders; eventBody is a "Order"
            /* Not implemented */
        } else if (webhookEvent.eventName.startsWith("license_")) {
            // Save license keys; eventBody is a "License key"
            /* Not implemented */
        }

        // Update the webhook event.
        const { error } = await supabase.from("webhook_event").update({
            processed: true,
            processingError,
        }).eq("id", webhookEvent.id);

        if (error) {
            console.error(`Failed to update webhook event #${webhookEvent.id}:`, error);
            throw new Error(`Failed to update webhook event: ${error.message}`);
        }
    }
}