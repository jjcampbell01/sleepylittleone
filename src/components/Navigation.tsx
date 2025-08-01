import { UserDropdown } from "@/components/UserDropdown";

export const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold text-primary">
          Sleepy Little One
        </div>
        <div className="flex items-center gap-4">
          <UserDropdown />
        </div>
      </div>
    </nav>
  );
};