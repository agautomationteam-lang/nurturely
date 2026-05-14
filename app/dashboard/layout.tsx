import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <div className="mx-auto max-w-content p-4 md:p-6">{children}</div>
      </div>
    </div>
  );
}
