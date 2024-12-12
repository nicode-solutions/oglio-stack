import { cn } from "@/lib/utils"
import { Tables } from "@/types/supabase"
import { SignupButton } from "./signup-button"
import { Section } from "../section"
import { SearchXIcon } from "lucide-react"
import { formatPrice } from "@/utils/lemonsqueezy/helpers"

interface PlanProps {
    plan: Tables<"plans">
    currentPlan?: Tables<"plans"> | null
    isChangingPlans?: boolean
}

export function Plan({ plan, currentPlan, isChangingPlans }: PlanProps) {
    const { description, id, productName, interval, name, price } = plan;
    const isCurrent = id && currentPlan?.id === id;

    return (
        <Section className={cn("not-prose", isCurrent && "bg-surface-50/40")}>
            <Section.Item className="flex-col items-start gap-2">
                <header className="flex w-full items-center justify-between">
                    {name ? (
                        <h2 className="text-lg text-surface-900">
                            {productName} ({name})
                        </h2>
                    ) : null}
                </header>
                {description ? (
                    <div
                        dangerouslySetInnerHTML={{
                            // Ideally sanitize the description first
                            __html: description,
                        }}
                    />
                ) : null}
            </Section.Item>

            <Section.Item className="flex-col items-start">
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
                    isChangingPlans={isChangingPlans}
                    currentPlan={currentPlan}
                />
            </Section.Item>
        </Section>
    )
}

export function NoPlans() {
    return (
        <section className="prose mt-[10vw] flex flex-col items-center justify-center">
            <span className="flex size-24 items-center justify-center rounded-full bg-wg-red-50/70">
                <SearchXIcon
                    className="text-wg-red"
                    aria-hidden="true"
                    size={48}
                    strokeWidth={0.75}
                />
            </span>

            <p className="max-w-prose text-balance text-center leading-6 text-gray-500">
                There are no plans available at the moment.
            </p>
        </section>
    );
}