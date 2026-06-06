import BottomNav from "./BottomNav";
import SidebarNav from "./SidebarNav";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <SidebarNav />
      <div className="flex min-h-screen flex-col bg-primary-container lg:ml-64">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}
