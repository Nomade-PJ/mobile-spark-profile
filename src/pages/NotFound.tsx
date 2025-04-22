import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MobileNav } from "@/components/ui/mobile-nav";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-nubank-base p-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold">Página não encontrada</h1>
      </div>
      
      <div className="flex flex-col items-center justify-center p-6 mt-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl font-bold text-nubank-base">404</span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">Oops! Página não encontrada</h2>
        <p className="text-gray-600 mb-6 text-center">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          to="/"
          className="px-6 py-3 bg-nubank-base text-white rounded-lg hover:bg-nubank-dark transition-colors"
        >
          Voltar para a Home
        </Link>
      </div>
      
      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default NotFound;
