import { syncPlans } from "../actions";

export default async function BillingPage() {

    await syncPlans();

    return (
        <div className="bg-primary bg-opacity-20 min-h-screen p-8">
            <h1>Billing</h1>
        </div>
    )
}