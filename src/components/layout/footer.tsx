import Link from "next/link";

const Footer = () => {
    return (
        <footer className="bg-gray-100 border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-sm text-gray-500">
                        © {new Date().getFullYear()} OglioStack. All rights reserved.
                    </div>
                    <nav className="flex space-x-4">
                        <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900">
                            About
                        </Link>
                        <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                            Terms
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    )
}

export default Footer;