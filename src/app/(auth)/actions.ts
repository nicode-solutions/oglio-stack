"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export type FormState = {
    message: string;
    error?: string;
}

export const registerAction = async (prevState: FormState, formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (!password || password !== confirmPassword) {
        return {
            message: "",
            error: "Passwords do not match",
        };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })

    console.debug(data, error);

    if (error) {
        return {
            message: "",
            error: error.message,
        }
    }

    return {
        message: `Success, check your email!`,
    }
}

export const loginAction = async (formData: FormData) => {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) {
        console.error(error.message);
        return;
    }

    redirect("/");
}