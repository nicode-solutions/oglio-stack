import { Suspense } from "react";
import { Plans } from "./_components/plans/plans";
import { Subscriptions } from "./_components/subscriptions/subscriptions";
import { CardSkeleton } from "./_components/skeletons/card";
import { PlansSkeleton } from "./_components/skeletons/plans";

export default function BillingPage() {
    return (
        <div className="bg-primary bg-opacity-20 min-h-screen p-8">
            <Suspense fallback={<CardSkeleton className="h-[106px]" />}>
                <Subscriptions />
            </Suspense>

            <Suspense fallback={<PlansSkeleton />}>
                <Plans />
            </Suspense>
        </div>
    )
}