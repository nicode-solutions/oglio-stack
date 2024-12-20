"use client";

import Image from "next/image";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    user: User;
}

const UserMenu = ({ user }: UserMenuProps) => {
    const router = useRouter();
    const logout = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.refresh()
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Image alt="avatar" src="/avatar.jpg" width={48} height={48} className="rounded-full" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/dashboard/billing')}>Billing</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}

export default UserMenu;