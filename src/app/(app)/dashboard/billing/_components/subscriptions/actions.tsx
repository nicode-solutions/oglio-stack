import { Tables } from "@/types/supabase";
import { SubscriptionActionsDropdown } from "./actions-dropdown";
import { getSubscriptionURLs } from "../../actions";

export async function SubscriptionActions({
    subscription,
}: {
    subscription: Tables<"subscriptions">;
}) {
    if (
        subscription.status === "expired" ||
        subscription.status === "cancelled" ||
        subscription.status === "unpaid"
    ) {
        return null;
    }

    const urls = await getSubscriptionURLs(subscription.lemonsqueezyId);

    return (
        <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
    );
}
