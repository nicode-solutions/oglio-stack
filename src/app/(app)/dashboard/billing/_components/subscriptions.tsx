import { createSSRClient } from "@/utils/supabase/server";
import { getUserSubscriptions } from "../actions";
import { Tables } from "@/types/supabase";

export async function Subscriptions() {
    const userSubscriptions = await getUserSubscriptions();
    const supabase = await createSSRClient();
    let { data: allPlans, error } = await supabase.from("plans").select();
    if (error) {
        console.error("Error fetching plans:", error);
        return <p>Error fetching plans.</p>;
    }

    if (userSubscriptions.length === 0) {
        return (
            <p className="not-prose mb-2">
                It appears that you do not have any subscriptions. Please sign up for a
                plan below.
            </p>
        );
    }

    // Show active subscriptions first, then paused, then canceled
    const sortedSubscriptions = userSubscriptions.sort((a, b) => {
        if (a.status === "active" && b.status !== "active") {
            return -1;
        }

        if (a.status === "paused" && b.status === "cancelled") {
            return -1;
        }

        return 0;
    });


    console.log(JSON.stringify(sortedSubscriptions, null, 2));

    return (
        <div>
            <h2 className="text-3xl font-bold mb-8">Subscriptions 💸</h2>

            {sortedSubscriptions.map((subscription: Tables<"subscriptions">, index) => {
                return (
                    <div key={`subscription-${index}`} className="mb-5">
                        <h3>PlanId: {subscription.planId}</h3>
                        <p>Status: {subscription.status}</p>
                    </div>
                );
            })}
        </div>
    );
}