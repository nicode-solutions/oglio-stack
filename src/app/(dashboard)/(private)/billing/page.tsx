import { Suspense } from "react";
import { Plans } from "./_components/plans";

export default function BillingPage() {
    return (
        <div className="bg-primary bg-opacity-20 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Billing 💸</h1>
            <Suspense fallback={<p>Loading plans...</p>}>
                <Plans />
            </Suspense>
        </div>
    )
}