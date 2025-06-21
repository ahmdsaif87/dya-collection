import { AppSidebar } from "@/components/app-sidebar";
import SidebarHeader from "@/components/sidebar-header";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { checkRole } from "@/lib/roles";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkRole("admin");
  if (!isAdmin) {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
