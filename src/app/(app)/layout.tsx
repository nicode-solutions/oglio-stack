import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { createSSRClient } from "@/utils/supabase/server";
import Script from "next/script";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createSSRClient();

  const { data } = await supabase.auth.getUser();

  return (
    <>
      {/* Load the Lemon Squeezy's Lemon.js script before the page is interactive. */}
      <Script
        src="https://app.lemonsqueezy.com/js/lemon.js"
        strategy="beforeInteractive"
      />
      <div className="flex flex-col min-h-screen">
        <Navbar user={data.user} />
        <div className="flex-1">{children}</div>
        <Footer />
      </div>
    </>
  );
}
