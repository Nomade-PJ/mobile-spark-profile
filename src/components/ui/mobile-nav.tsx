
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, User, Mail, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const location = useLocation();
  
  const navItems = [
    {
      icon: Home,
      label: "Home",
      href: "/"
    },
    {
      icon: Briefcase,
      label: "Projetos",
      href: "/projects"
    },
    {
      icon: Settings,
      label: "Tech",
      href: "/tech"
    },
    {
      icon: Mail,
      label: "Contato",
      href: "/contact"
    },
    {
      icon: User,
      label: "Sobre",
      href: "/about"
    }
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16",
                isActive
                  ? "text-nubank-base"
                  : "text-gray-500 hover:text-nubank-light"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-nubank-base" : "text-gray-500")} />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-10 h-1 bg-nubank-base rounded-t-md" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
