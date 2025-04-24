import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

interface UserData {
  id: number;
  email: string;
  role: string;
}

const AdminProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!window.sessionToken) {
      verifySession();
    } else {
      // Obter informações do usuário do token
      try {
        const payload = JSON.parse(atob(window.sessionToken.split(".")[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role || "admin"
        });
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        window.sessionToken = null;
        navigate("/admin");
      }
    }
  }, [navigate]);

  // Verificar se há uma sessão ativa no banco de dados
  const verifySession = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/auth/verify-session", {
        method: "GET",
        credentials: "include" // Importante para enviar cookies
      });
      
      if (response.ok) {
        const data = await response.json();
        window.sessionToken = data.token;
        
        // Decodificar o token para obter dados do usuário
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        setUser({
          id: payload.userId,
          email: payload.email,
          role: payload.role || "admin"
        });
      } else {
        navigate("/admin");
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      navigate("/admin");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${window.sessionToken}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
        credentials: "include"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao alterar senha");
      }

      toast.success("Senha alterada com sucesso");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/admin")}
        className="mb-4 flex items-center"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar ao Painel
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Perfil do Administrador</CardTitle>
          <CardDescription>
            Gerencie suas informações de conta e altere sua senha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Informações da Conta</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
              </div>
              <div>
                <Label htmlFor="role">Função</Label>
                <Input id="role" value={user.role} disabled />
              </div>
            </div>
          </div>

          <form onSubmit={handleChangePassword}>
            <h3 className="text-lg font-medium mb-2">Alterar Senha</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="mt-2 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {loading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile; 