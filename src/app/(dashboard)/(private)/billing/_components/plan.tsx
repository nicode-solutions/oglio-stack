import { formatPrice } from "@/lib/utils"
import { Tables } from "@/types/supabase"
import { SignupButton } from "./signup-button"

export function Plan({ plan }: { plan: Tables<"plans"> }) {
    const { description, product_name: productName, name, price } = plan

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

            <p>{formatPrice(price)}</p>

            <SignupButton
                className="w-full"
                plan={plan}
                isChangingPlans={false}
                currentPlan={null}
            />
        </div>
    )
}