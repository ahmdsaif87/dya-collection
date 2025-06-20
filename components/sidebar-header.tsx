import { SidebarTrigger } from "./ui/sidebar";
import { UserButton } from "@clerk/nextjs";
export default function SidebarHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4 w-full justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
        </div>
        <UserButton />
      </div>
    </header>
  );
}
