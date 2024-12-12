import { cn, formatPrice } from "@/lib/utils"
import { Tables } from "@/types/supabase"
import { SignupButton } from "./signup-button"

interface PlanProps {
    plan: Tables<"plans">
    currentPlan?: Tables<"plans"> | null
    isChangingPlans?: boolean
}

export function Plan({ plan, currentPlan, isChangingPlans }: PlanProps) {
    const { description, id, productName, interval, name, price } = plan;
    const isCurrent = id && currentPlan?.id === id;

    return (
        <div>
            <h2>
                {productName} ({name})
            </h2>

            {description ? (
                <div
                    dangerouslySetInnerHTML={{
                        // Ideally sanitize the description first.
                        __html: description,
                    }}
                ></div>
            ) : null}

            <div className={cn(isCurrent && "opacity-60")}>
                <span className="mr-0.5 text-xl text-surface-900">
                    {formatPrice(price)}
                </span>
                {!plan.isUsageBased && interval ? ` per ${interval}` : null}
                {plan.isUsageBased && interval ? ` /unit per ${interval}` : null}
            </div>

            <SignupButton
                className="w-full"
                plan={plan}
                isChangingPlans={false}
                currentPlan={null}
            />
        </div>
    )
}