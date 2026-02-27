import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  FolderGit2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  User,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setLocation("/login");
  };

  const NavLinks = () => (
    <>
      <Link href="/projects">
        <Button 
          variant={location.startsWith("/projects") ? "secondary" : "ghost"} 
          className="w-full justify-start gap-3 text-base"
        >
          <FolderGit2 className="h-5 w-5" />
          المشاريع
        </Button>
      </Link>
      <Link href="/audit">
        <Button 
          variant={location.startsWith("/audit") ? "secondary" : "ghost"} 
          className="w-full justify-start gap-3 text-base"
        >
          <Activity className="h-5 w-5" />
          سجل النشاطات (Audit Logs)
        </Button>
      </Link>
      <Link href="/settings">
        <Button 
          variant={location.startsWith("/settings") ? "secondary" : "ghost"} 
          className="w-full justify-start gap-3 text-base"
        >
          <Settings className="h-5 w-5" />
          الإعدادات
        </Button>
      </Link>
    </>
  );

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-l border-border bg-card">
        <div className="p-6 border-b border-border flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FolderGit2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">Croser<span className="text-primary/70">Next</span></h1>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavLinks />
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">المدير</p>
              <p className="text-xs text-muted-foreground">admin@example.com</p>
            </div>
          </div>
          <Button variant="destructive" className="w-full justify-start gap-3" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            تسجيل خروج
          </Button>
        </div>
      </aside>

      {/* Mobile Drawer & Topbar */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <FolderGit2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-lg">Croser<span className="text-primary/70">Next</span></h1>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col p-0" dir="rtl">
              <SheetHeader className="p-6 border-b border-border text-right">
                <SheetTitle>القائمة الرئيسية</SheetTitle>
              </SheetHeader>
              <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <div onClick={() => setIsMobileMenuOpen(false)}>
                  <NavLinks />
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Button variant="destructive" className="w-full justify-start gap-3" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  تسجيل خروج
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
