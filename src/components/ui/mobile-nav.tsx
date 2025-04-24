import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Settings, Mail, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  id: number;
  label: string;
  icon_name: string;
  route: string;
  order_index: number;
  is_visible: boolean;
}

// Mapeamento de nomes de ícones para componentes
const iconMap = {
  home: Home,
  briefcase: Briefcase,
  settings: Settings,
  mail: Mail,
  user: User
};

export function MobileNav() {
  const location = useLocation();
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/navbar/visible');
        if (!response.ok) {
          throw new Error('Falha ao carregar itens de navegação');
        }
        const data = await response.json();
        
        // Ordenar os itens pela ordem definida no banco
        data.sort((a: NavItem, b: NavItem) => a.order_index - b.order_index);
        setNavItems(data);
      } catch (error) {
        console.error('Erro ao buscar itens de navegação:', error);
        // Fallback para dados estáticos em caso de erro
        setNavItems([
          {
            id: 1,
            icon_name: "home",
            label: "Home",
            route: "/",
            order_index: 1,
            is_visible: true
          },
          {
            id: 2,
            icon_name: "briefcase",
            label: "Projetos",
            route: "/projects",
            order_index: 2,
            is_visible: true
          },
          {
            id: 3,
            icon_name: "settings",
            label: "Tech",
            route: "/tech",
            order_index: 3,
            is_visible: true
          },
          {
            id: 4,
            icon_name: "mail",
            label: "Contato",
            route: "/contact",
            order_index: 4,
            is_visible: true
          },
          {
            id: 5,
            icon_name: "user",
            label: "Sobre",
            route: "/about",
            order_index: 5,
            is_visible: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNavItems();
  }, []);
  
  // Renderizar um skeleton loader enquanto os dados estão carregando
  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center h-16">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center w-16">
              <div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mb-1"></div>
              <div className="w-10 h-2 bg-gray-200 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          
          // Obter o componente de ícone adequado
          const IconComponent = iconMap[item.icon_name.toLowerCase() as keyof typeof iconMap] || Home;
          
          return (
            <Link
              key={item.id}
              to={item.route}
              className={cn(
                "flex flex-col items-center justify-center w-16",
                isActive
                  ? "text-nubank-base"
                  : "text-gray-500 hover:text-nubank-light"
              )}
            >
              <IconComponent size={20} className={cn(isActive ? "text-nubank-base" : "text-gray-500")} />
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
