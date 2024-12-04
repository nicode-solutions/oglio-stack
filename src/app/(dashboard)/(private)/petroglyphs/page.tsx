import { FormButton } from "@/components/ui/form-button";
import { createClient } from "@/utils/supabase/server";
import Table from "./_components/table";
import { Tables } from "@/types/supabase";

export default async function PetroglyphsPage() {
    /**
     * Asynchronous function to handle the addition of a petroglyph.
     * 
     * @param {FormData} formData - The form data containing the engraving information.
     * @returns {Promise<void>} - A promise that resolves when the action is complete.
     * 
     * @remarks
     * This function uses the "use server" directive.
     * 
     * @example
     * const formData = new FormData();
     * formData.append("engraving", "Sample Engraving");
     * await addPetroglyphAction(formData);
     */
    const addPetroglyphAction = async (formData: FormData) => {
        "use server";
        const engraving = formData.get("engraving") as string;
        if (!engraving) {
            return;
        }
        const supabase = await createClient();
        const { error } = await supabase.from("petroglyphs").insert({ engraving });
        if (error) {
            console.error(error.message);
            return;
        }
        return;
    }

    /**
     * Fetches petroglyphs data from the Supabase database.
     *
     * @returns {Promise<Tables<"petroglyphs">[]>} A promise that resolves to an array of petroglyphs data.
     * If an error occurs, it logs the error message and returns an empty array.
     */
    const getPetrolgyphs = async (): Promise<Tables<"petroglyphs">[]> => {
        const supabase = await createClient();
        const { data, error } = await supabase.from("petroglyphs").select("*");
        if (error) {
            console.error(error.message);
            return [];
        }
        return data;
    }

    const petroglyphs = await getPetrolgyphs();

    return (
        <div className="bg-primary bg-opacity-20 min-h-screen p-8">
            <div className="bg-white dark:bg-gray-900 mx-auto max-w-xl md:min-w-96 shadow-md rounded-lg px-8 py-6">
                <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200 py-8">Petroglyphs 🪨</h1>
                <form action={addPetroglyphAction}>
                    <div className="mb-4">
                        <label
                            htmlFor="engraving"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Engraving
                        </label>
                        <input
                            type="text"
                            id="engraving"
                            name="engraving"
                            className="shadown-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />

                    </div>
                    <div className="mb-4">
                        <FormButton text="Add Petroglyph" />
                    </div>
                </form>
                <div className="mb-4">
                    <Table petroglyphs={petroglyphs} />
                </div>
            </div>
        </div>
    );
}