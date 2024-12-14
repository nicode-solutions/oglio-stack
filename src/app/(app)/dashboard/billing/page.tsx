import { Suspense } from "react";
import { Subscriptions } from "./_components/subscriptions/subscriptions";
import { CardSkeleton } from "./_components/skeletons/card";
import { DashboardContent } from "../_components/content";
import { PageTitleAction } from "../_components/page-title-action";
import { PlansSkeleton } from "./_components/skeletons/plans";
import { Plans } from "./_components/plans/plans";

export default function BillingPage() {
    return (
        <DashboardContent
            title="Billing"
            subtitle="View and manage your billing information."
            action={<PageTitleAction />}
        >
            <div>
                <Suspense fallback={<CardSkeleton className="h-[106px]" />}>
                    <Subscriptions subscriptions={[]} plans={[]} />
                </Suspense>

                <Suspense fallback={<PlansSkeleton />}>
                    <Plans />
                </Suspense>
            </div>
        </DashboardContent>
    )
}