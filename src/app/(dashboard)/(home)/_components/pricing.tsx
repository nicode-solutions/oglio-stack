import { Button } from "@/components/ui/button";

const priceId = process.env.NEXT_PUBLIC_PRICE_ID;

export const Pricing = () => {
    return (
        <div className="bg-white py-24 sm:py-32" id="pricing">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Simple no-tricks pricing
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                        Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et
                        quasi iusto modi velit ut non voluptas in. Explicabo id ut laborum.
                    </p>
                </div>
            </div>
        </div>
    );
};