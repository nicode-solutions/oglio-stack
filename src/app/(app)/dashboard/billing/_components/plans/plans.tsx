"use client";

import { useQuery } from "@tanstack/react-query";
import { Subscription } from "@lemonsqueezy/lemonsqueezy.js";

import { getPlans, getUserSubscriptions } from "@/server/billing/actions";
import { NoPlans, Plan } from "./plan";
import { Tables } from "@/types/supabase";

export function Plans({
    isChangingPlans = false,
}: {
    isChangingPlans?: boolean;
    currentPlan?: Tables<"plans"> | null;
}) {

    const { data: userSubscriptions } = useQuery({
        queryKey: ["subscriptions"],
        queryFn: getUserSubscriptions,
        initialData: [],
    });

    const { data: allPlans } = useQuery({
        queryKey: ["plans"],
        queryFn: getPlans,
        initialData: [],
    });

    if (userSubscriptions && userSubscriptions.length > 0) {
        const hasValidSubscription = userSubscriptions.some((sub) => {
            const status = sub.status as Subscription["data"]["attributes"]["status"];

            return (
                status !== "cancelled" && status !== "expired" && status !== "unpaid"
            )
        });

        if (hasValidSubscription && !isChangingPlans) {
            return null;
        }
    }

    if (!allPlans?.length) {
        return <NoPlans />;
    }

    return (
        <div>
            <div className="mb-5 mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                {allPlans.map((plan, index) => {
                    return <Plan key={`plan-${index}`} plan={plan} />
                })}
            </div>
        </div>
    )
}
