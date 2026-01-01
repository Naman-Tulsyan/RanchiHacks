import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { useAppTour } from "@/tour/useAppTour";
import { Badge } from "@/components/ui/badge";
import { Shield, LogOut, Home, FileCheck, User, Menu, X } from "lucide-react";

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { startTour } = useAppTour();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser && location.pathname !== "/login") {
      navigate("/login");
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Don't show layout for login page
  if (location.pathname === "/login") {
    return <Outlet />;
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/custody", label: "Chain of Custody", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/"
              className="flex items-center gap-2"
              data-tour="app-logo"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-semibold hidden sm:block">
                Evidence Chain
              </span>
            </Link>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <Button
                onClick={startTour}
                variant="outline"
                size="sm"
                className="text-slate-200 border-slate-700 hover:bg-slate-800"
              >
                Guide
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300 text-sm">{user.full_name}</span>
                <Badge
                  variant="outline"
                  className="text-xs capitalize border-slate-600 text-slate-400"
                >
                  {user.role?.replace("_", " ")}
                </Badge>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white"
                data-tour="logout-button"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className="hidden lg:block w-64 min-h-[calc(100vh-57px)] bg-slate-900/50 border-r border-slate-800 p-4"
          data-tour="sidebar-nav"
        >
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-blue-500/20 text-blue-400"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Sidebar - Mobile */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          >
            <aside
              className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="space-y-1 mt-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-500/20 text-blue-400"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6" data-tour="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
