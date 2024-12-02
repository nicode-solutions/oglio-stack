import { Button } from "../ui/button";
import UserMenu from "./user-menu";
import Link from "next/link";
import { Logo } from "../icons/logo";
import { User } from "@supabase/supabase-js";

interface NavbarProps {
    user: User | null;
}

const Navbar = ({ user }: NavbarProps) => {
    return (
        <div className="bg-white">
            <div className="flex max-w-7xl mx-auto p-8 items-center">
                <div className="flex-1">
                    <Link href="/">
                        <Logo className="w-32 md:w-48" />
                    </Link>
                </div>
                <div>
                    {user ? (
                        <div className="flex gap-8 items-center">
                            <Link href="/petroglyphs" className="uppercase font-bold underline hover:no-underline">
                                Petroglyphs
                            </Link>
                            <UserMenu user={user} />
                        </div>
                    ) : (
                        <Button variant="outline" asChild>
                            <Link href="/login">Login</Link>
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;