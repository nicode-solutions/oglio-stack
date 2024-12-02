import { createClient } from "@/utils/supabase/server";

export default async function PrivatePage() {
    const supabase = await createClient();
    const { data, error } = await supabase.from("petroglyphs").select();
    console.log(data)
    return (
        <main>
            <h1>Private Page</h1>
        </main>
    );
}