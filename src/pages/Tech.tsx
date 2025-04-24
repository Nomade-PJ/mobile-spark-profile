
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";
import { TechCard } from "@/components/tech-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Tech = () => {
  const technologies = {
    languages: [
      { name: "JavaScript", level: 5, category: "Linguagem", icon: "/assets/icons/js.svg" },
      { name: "TypeScript", level: 4, category: "Linguagem", icon: "/assets/icons/ts.svg" },
      { name: "Java", level: 3, category: "Linguagem", icon: "/assets/icons/java.svg" },
      { name: "CSS", level: 4, category: "Linguagem", icon: "/assets/icons/css.svg" },
      { name: "HTML", level: 5, category: "Linguagem", icon: "/assets/icons/html.svg" },
    ],
    frontend: [
      { name: "React", level: 5, category: "Frontend", icon: "/assets/icons/react.svg" },
      { name: "React Native", level: 4, category: "Mobile", icon: "/assets/icons/react.svg" },
      { name: "Flutter", level: 4, category: "Mobile", icon: "/assets/icons/flutter.svg" },
      { name: "Tailwind CSS", level: 5, category: "Estilo", icon: "/assets/icons/tailwind.svg" },
      { name: "Next.js", level: 4, category: "Framework", icon: "/assets/icons/next.svg" },
    ],
    backend: [
      { name: "Node.js", level: 5, category: "Backend", icon: "/assets/icons/node.svg" },
      { name: "PostgreSQL", level: 4, category: "Banco de Dados", icon: "/assets/icons/postgres.svg" },
      { name: "MySQL", level: 4, category: "Banco de Dados", icon: "/assets/icons/mysql.svg" },
      { name: "Firebase", level: 5, category: "BaaS", icon: "/assets/icons/firebase.svg" },
      { name: "Supabase", level: 4, category: "BaaS", icon: "/assets/icons/supabase.svg" },
    ],
    tools: [
      { name: "Git", level: 4, category: "Controle de Versão", icon: "/assets/icons/git.svg" },
      { name: "Docker", level: 3, category: "Containerização", icon: "/assets/icons/docker.svg" },
      { name: "VS Code", level: 5, category: "IDE", icon: "/assets/icons/vscode.svg" },
      { name: "Figma", level: 3, category: "Design", icon: "/assets/icons/figma.svg" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-nubank-dark to-nubank-base p-6 pt-12 pb-16 text-white">
        <h1 className="text-2xl font-bold">Stack Tecnológica</h1>
        <p className="text-sm opacity-90 mt-1">Ferramentas e tecnologias que utilizo</p>
      </div>

      {/* Conteúdo */}
      <div className="px-4 -mt-8">
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Tabs defaultValue="languages" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto gap-2 bg-gray-100 p-1">
              <TabsTrigger value="languages" className="text-xs py-2">
                Linguagens
              </TabsTrigger>
              <TabsTrigger value="frontend" className="text-xs py-2">
                Frontend
              </TabsTrigger>
              <TabsTrigger value="backend" className="text-xs py-2">
                Backend
              </TabsTrigger>
              <TabsTrigger value="tools" className="text-xs py-2">
                Ferramentas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="languages" className="mt-4 space-y-3">
              {technologies.languages.map((tech, index) => (
                <TechCard key={index} {...tech} />
              ))}
            </TabsContent>
            <TabsContent value="frontend" className="mt-4 space-y-3">
              {technologies.frontend.map((tech, index) => (
                <TechCard key={index} {...tech} />
              ))}
            </TabsContent>
            <TabsContent value="backend" className="mt-4 space-y-3">
              {technologies.backend.map((tech, index) => (
                <TechCard key={index} {...tech} />
              ))}
            </TabsContent>
            <TabsContent value="tools" className="mt-4 space-y-3">
              {technologies.tools.map((tech, index) => (
                <TechCard key={index} {...tech} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Tech;
