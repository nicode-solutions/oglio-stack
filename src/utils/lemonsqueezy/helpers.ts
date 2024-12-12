import { type Subscription } from "@lemonsqueezy/lemonsqueezy.js";

export function isValidSubscription(
    status: Subscription["data"]["attributes"]["status"],
) {
    return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export function formatPrice(priceInCents: number) {
    const dollars = priceInCents / 100;

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        // Use minimumFractionDigits to handle cases like $59.00 -> $59
        minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
    }).format(dollars);
}


export function formatDate(date: string | number | Date | null | undefined) {
    if (!date) return "";

    return new Date(date).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
