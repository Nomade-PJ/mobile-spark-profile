import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserCog, LogOut } from "lucide-react";

// Definição da sessão global
declare global {
  interface Window {
    sessionToken: string | null;
  }
}

interface Section {
  id: number;
  name: string;
  content: string;
  is_active: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string;
  image_url: string;
  github_url: string;
  demo_url: string;
}

interface Contact {
  id: number;
  type: string;
  label: string;
  value: string;
  link: string;
}

interface NavItem {
  id: number;
  label: string;
  icon_name: string;
  route: string;
  order_index: number;
  is_visible: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  // Verificar autenticação no carregamento
  useEffect(() => {
    // Verificar se há uma sessão ativa
    if (window.sessionToken) {
      setIsAuthenticated(true);
      fetchData();
    } else {
      // Verificar se há uma sessão ativa no banco de dados
      verifySession();
    }
  }, []);
  
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
        setIsAuthenticated(true);
        fetchData();
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
    }
  };

  // Função de login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
        credentials: "include" // Importante para receber cookies
      });

      const data = await response.json();

      if (response.ok) {
        window.sessionToken = data.token;
        setIsAuthenticated(true);
        fetchData();
        toast.success("Login realizado com sucesso!");
      } else {
        toast.error(data.error || "Falha na autenticação");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar todos os dados
  const fetchData = async () => {
    const headers = {
      "Content-Type": "application/json",
      Authorization: window.sessionToken ? `Bearer ${window.sessionToken}` : "",
    };

    try {
      // Buscar seções
      const sectionsResponse = await fetch("http://localhost:3001/api/sections", {
        headers,
        credentials: "include"
      });
      if (sectionsResponse.ok) {
        const sectionsData = await sectionsResponse.json();
        setSections(sectionsData);
      }

      // Buscar projetos
      const projectsResponse = await fetch("http://localhost:3001/api/projects", {
        headers,
        credentials: "include"
      });
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData);
      }

      // Buscar contatos
      const contactsResponse = await fetch("http://localhost:3001/api/contacts", {
        headers,
        credentials: "include"
      });
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        setContacts(contactsData);
      }

      // Buscar itens da navbar
      const navResponse = await fetch("http://localhost:3001/api/navbar", {
        headers,
        credentials: "include"
      });
      if (navResponse.ok) {
        const navData = await navResponse.json();
        setNavItems(navData);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      toast.error("Erro ao carregar dados");
    }
  };

  // Atualizar uma seção
  const updateSection = async (section: Section) => {
    try {
      const response = await fetch(`http://localhost:3001/api/sections/${section.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionToken ? `Bearer ${window.sessionToken}` : "",
        },
        body: JSON.stringify(section),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Seção atualizada com sucesso!");
        fetchData(); // Recarregar dados
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao atualizar seção");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  // Atualizar um projeto
  const updateProject = async (project: Project) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionToken ? `Bearer ${window.sessionToken}` : "",
        },
        body: JSON.stringify(project),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Projeto atualizado com sucesso!");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao atualizar projeto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  // Adicionar um novo projeto
  const addProject = async (project: Omit<Project, "id">) => {
    try {
      const response = await fetch("http://localhost:3001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionToken ? `Bearer ${window.sessionToken}` : "",
        },
        body: JSON.stringify(project),
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Projeto adicionado com sucesso!");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao adicionar projeto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  // Excluir um projeto
  const deleteProject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: window.sessionToken ? `Bearer ${window.sessionToken}` : "",
        },
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Projeto excluído com sucesso!");
        fetchData();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao excluir projeto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao conectar com o servidor");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        credentials: "include"
      });
      
      window.sessionToken = null;
      setIsAuthenticated(false);
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      window.sessionToken = null;
      setIsAuthenticated(false);
      navigate("/");
    }
  };

  // Renderizar formulário de login se não estiver autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para gerenciar o portfólio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Senha"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/admin/profile")}
            className="flex items-center"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Perfil
          </Button>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <Tabs defaultValue="sections">
        <TabsList className="mb-8">
          <TabsTrigger value="sections">Seções</TabsTrigger>
          <TabsTrigger value="projects">Projetos</TabsTrigger>
          <TabsTrigger value="contacts">Contatos</TabsTrigger>
          <TabsTrigger value="navbar">Navegação</TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba Seções */}
        <TabsContent value="sections">
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Seções</h2>
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <CardTitle>{section.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Textarea
                        placeholder="Conteúdo"
                        value={section.content}
                        onChange={(e) => {
                          const updatedSections = sections.map((s) =>
                            s.id === section.id
                              ? { ...s, content: e.target.value }
                              : s
                          );
                          setSections(updatedSections);
                        }}
                        rows={6}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <label>
                        <input
                          type="checkbox"
                          checked={section.is_active}
                          onChange={(e) => {
                            const updatedSections = sections.map((s) =>
                              s.id === section.id
                                ? { ...s, is_active: e.target.checked }
                                : s
                            );
                            setSections(updatedSections);
                          }}
                          className="mr-2"
                        />
                        Ativo
                      </label>
                    </div>
                    <Button
                      onClick={() => updateSection(section)}
                      type="button"
                    >
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Conteúdo da aba Projetos */}
        <TabsContent value="projects">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Gerenciar Projetos</h2>
            <Button onClick={() => {
              const newProject = {
                title: "Novo Projeto",
                description: "Descrição do projeto",
                tech_stack: "Tech1, Tech2",
                image_url: "https://placehold.co/600x400",
                github_url: "",
                demo_url: ""
              };
              addProject(newProject);
            }}>
              Adicionar Projeto
            </Button>
          </div>
          
          <div className="space-y-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>
                      <Input
                        value={project.title}
                        onChange={(e) => {
                          const updatedProjects = projects.map((p) =>
                            p.id === project.id
                              ? { ...p, title: e.target.value }
                              : p
                          );
                          setProjects(updatedProjects);
                        }}
                        className="text-xl font-bold"
                      />
                    </CardTitle>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteProject(project.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Descrição</label>
                      <Textarea
                        value={project.description}
                        onChange={(e) => {
                          const updatedProjects = projects.map((p) =>
                            p.id === project.id
                              ? { ...p, description: e.target.value }
                              : p
                          );
                          setProjects(updatedProjects);
                        }}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Tecnologias (separadas por vírgula)</label>
                      <Input
                        value={project.tech_stack}
                        onChange={(e) => {
                          const updatedProjects = projects.map((p) =>
                            p.id === project.id
                              ? { ...p, tech_stack: e.target.value }
                              : p
                          );
                          setProjects(updatedProjects);
                        }}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">URL da Imagem</label>
                      <Input
                        value={project.image_url}
                        onChange={(e) => {
                          const updatedProjects = projects.map((p) =>
                            p.id === project.id
                              ? { ...p, image_url: e.target.value }
                              : p
                          );
                          setProjects(updatedProjects);
                        }}
                      />
                      {project.image_url && (
                        <div className="mt-2">
                          <img 
                            src={project.image_url} 
                            alt={project.title} 
                            className="w-full h-32 object-cover rounded-md" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">URL do GitHub</label>
                        <Input
                          value={project.github_url}
                          onChange={(e) => {
                            const updatedProjects = projects.map((p) =>
                              p.id === project.id
                                ? { ...p, github_url: e.target.value }
                                : p
                            );
                            setProjects(updatedProjects);
                          }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">URL de Demo</label>
                        <Input
                          value={project.demo_url}
                          onChange={(e) => {
                            const updatedProjects = projects.map((p) =>
                              p.id === project.id
                                ? { ...p, demo_url: e.target.value }
                                : p
                            );
                            setProjects(updatedProjects);
                          }}
                        />
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => updateProject(project)}
                      type="button"
                    >
                      Salvar Alterações
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Conteúdo da aba Contatos */}
        <TabsContent value="contacts">
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Contatos</h2>
          {/* Implementar interface de gerenciamento de contatos */}
        </TabsContent>

        {/* Conteúdo da aba Navegação */}
        <TabsContent value="navbar">
          <h2 className="text-2xl font-semibold mb-4">Gerenciar Itens de Navegação</h2>
          {/* Implementar interface de gerenciamento de itens da navbar */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin; 