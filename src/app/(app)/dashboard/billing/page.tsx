import { Suspense } from "react";
import { Plans } from "./_components/plans";
import { Subscriptions } from "./_components/subscriptions";

export default function BillingPage() {
    return (
        <div className="bg-primary bg-opacity-20 min-h-screen p-8">
            <Suspense fallback={<p>Loading plans...</p>}>
                <Subscriptions />
            </Suspense>

            <Suspense fallback={<p>Loading plans...</p>}>
                <Plans />
            </Suspense>
        </div>
    )
}