"use client";

import { Tables } from "@/types/supabase";
import { Button, Loading } from "@lemonsqueezy/wedges";
import { CheckIcon, PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    forwardRef,
    useState,
    type ComponentProps,
    type ElementRef,
} from "react";
import { getCheckoutURL } from "../actions";

type ButtonElement = ElementRef<typeof Button>;
type ButtonProps = ComponentProps<typeof Button> & {
    embed?: boolean;
    isChangingPlans?: boolean;
    currentPlan?: Tables<"plans"> | null;
    plan: Tables<"plans">;
};

export const SignupButton = forwardRef<ButtonElement, ButtonProps>(
    (props, ref) => {
        const router = useRouter();
        const [loading, setLoading] = useState(false);
        const {
            embed = true,
            plan,
            currentPlan,
            isChangingPlans = false,
            ...otherProps
        } = props;

        const isCurrent = currentPlan && currentPlan.id === plan.id;

        // eslint-disable-next-line no-nested-ternary -- allow
        const label = isCurrent
            ? "Your plan"
            : isChangingPlans
                ? "Switch to this plan"
                : "Sign up";

        // eslint-disable-next-line no-nested-ternary -- disabled
        const before = loading ? (
            <Loading size="sm" className="size-4 dark" color="secondary" />
        ) : (props.before ?? isCurrent) ? (
            <CheckIcon className="size-4" />
        ) : (
            <PlusIcon className="size-4" />
        );
        return (
            <Button
                ref={ref}
                before={before}
                disabled={(loading || isCurrent) ?? props.disabled}
                onClick={async () => {
                    // Otherwise, create a checkout and open the Lemon.js modal.
                    let checkoutUrl: string | undefined = "";
                    try {
                        setLoading(true);
                        checkoutUrl = await getCheckoutURL(plan.variantId, embed);
                    } catch (error) {
                        setLoading(false);
                        console.log("Error creating a checkout.", {
                            description:
                                "Please check the server console for more information.",
                        });
                    } finally {
                        embed && setLoading(false);
                    }

                    embed
                        ? checkoutUrl && window.LemonSqueezy.Url.Open(checkoutUrl)
                        : router.push(checkoutUrl ?? "/");
                }}
                {...otherProps}
            >
                {label}
            </Button>
        );
    }
)