import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { createClient } from "@/utils/supabase/server";


export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={data.user} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
