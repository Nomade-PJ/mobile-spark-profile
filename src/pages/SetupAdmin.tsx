import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const SetupAdmin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    email: "",
    password: "",
  });

  const handleSetupAdmin = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/setup-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Administrador criado com sucesso!");
        setSetupComplete(true);
        setAdminCredentials({
          email: data.user.email,
          password: data.user.password,
        });
      } else {
        toast.error(data.error || "Erro ao criar administrador");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Configuração Inicial</CardTitle>
          <CardDescription>
            Configure o administrador do sistema para gerenciar seu portfólio
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!setupComplete ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Esta página permite criar um administrador inicial para seu sistema.
                Ela só pode ser acessada uma vez. Depois de criar o administrador,
                você deve usar a página de login normal.
              </p>
              <Button 
                onClick={handleSetupAdmin} 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando administrador...
                  </>
                ) : (
                  "Criar Administrador"
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="font-semibold text-green-800 mb-2">Administrador criado com sucesso!</h3>
                <p className="text-sm text-green-700 mb-2">Use as seguintes credenciais para fazer login:</p>
                <div className="bg-white p-3 rounded border border-green-100 text-sm font-mono">
                  <p><span className="font-semibold">Email:</span> {adminCredentials.email}</p>
                  <p><span className="font-semibold">Senha:</span> {adminCredentials.password}</p>
                </div>
                <p className="text-xs text-green-600 mt-2">
                  Anote estas informações. Recomendamos alterar a senha após o primeiro login.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/admin")} 
                className="w-full"
              >
                Ir para o Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SetupAdmin; 