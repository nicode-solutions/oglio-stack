"use client";

import { Tables } from "@/types/supabase";
import { SubscriptionActionsDropdown } from "./actions-dropdown";
import { getSubscriptionURLs } from "@/server/billing/actions";
import { useQuery } from "@tanstack/react-query";

export function SubscriptionActions({
    subscription,
}: {
    subscription: Tables<"subscriptions">;
}) {

    const { data: urls } = useQuery({
        queryKey: [subscription.lemonsqueezyId],
        queryFn: ({ queryKey }) => getSubscriptionURLs(queryKey[0]),
        initialData: null,
    })

    if (
        subscription.status === "expired" ||
        subscription.status === "cancelled" ||
        subscription.status === "unpaid"
    ) {
        return null;
    }



    if (!urls) {
        return null;
    }

    return (
        <SubscriptionActionsDropdown subscription={subscription} urls={urls} />
    );
}
