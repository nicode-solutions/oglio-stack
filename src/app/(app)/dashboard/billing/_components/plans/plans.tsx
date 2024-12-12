import { createSSRClient } from "@/utils/supabase/server"
import { getUserSubscriptions, syncPlans } from "../../actions";
import { NoPlans, Plan } from "./plan";
import { Subscription } from "@lemonsqueezy/lemonsqueezy.js";
import { Tables } from "@/types/supabase";

export async function Plans({
    isChangingPlans = false,
}: {
    isChangingPlans?: boolean;
    currentPlan?: Tables<"plans"> | null;
}) {

    const supabase = await createSSRClient();
    let { data: allPlans, error } = await supabase.from("plans").select();
    if (error) {
        console.error("Error fetching plans:", error);
        return <p>Error fetching plans.</p>;
    }

    const userSubscriptions = await getUserSubscriptions();

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

    // If there are no plans in the database, sync them from Lemon Squeezy.
    // You might want to add logic to sync plans periodically or a webhook handler.
    if (!allPlans?.length) {
        allPlans = await syncPlans();
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
