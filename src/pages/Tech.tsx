
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";
import { TechCard } from "@/components/tech-card";

const Tech = () => {
  const technologies = {
    languages: [
      { name: "JavaScript", level: 5, category: "Linguagem" },
      { name: "TypeScript", level: 4, category: "Linguagem" },
      { name: "Java", level: 3, category: "Linguagem" },
      { name: "CSS", level: 4, category: "Linguagem" },
    ],
    frontend: [
      { name: "React", level: 5, category: "Frontend" },
      { name: "React Native", level: 4, category: "Mobile" },
      { name: "Flutter", level: 4, category: "Mobile" },
      { name: "Tailwind CSS", level: 5, category: "Estilo" },
    ],
    backend: [
      { name: "Node.js", level: 5, category: "Backend" },
      { name: "Express", level: 4, category: "Framework" },
      { name: "MySQL", level: 4, category: "Banco de Dados" },
      { name: "PostgreSQL", level: 4, category: "Banco de Dados" },
      { name: "Supabase", level: 4, category: "BaaS" },
      { name: "Firebase", level: 5, category: "BaaS" },
    ],
    tools: [
      { name: "Git", level: 4, category: "Controle de Versão" },
      { name: "Vite", level: 5, category: "Build Tool" },
      { name: "React Hook Form", level: 4, category: "Gestão de Formulários" },
      { name: "Zod", level: 4, category: "Validação" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-nubank-dark to-nubank-base p-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold">Stack Tecnológica</h1>
        <p className="text-sm opacity-90 mt-1">Ferramentas e tecnologias que utilizo</p>
      </div>

      {/* Conteúdo */}
      <div className="px-4 mt-6">
        <div className="mb-8">
          <SectionHeader title="Linguagens" />
          <div className="space-y-3">
            {technologies.languages.map((tech, index) => (
              <TechCard key={index} {...tech} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Frontend & Mobile" />
          <div className="space-y-3">
            {technologies.frontend.map((tech, index) => (
              <TechCard key={index} {...tech} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Backend & Banco de Dados" />
          <div className="space-y-3">
            {technologies.backend.map((tech, index) => (
              <TechCard key={index} {...tech} />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Ferramentas & Utilidades" />
          <div className="space-y-3">
            {technologies.tools.map((tech, index) => (
              <TechCard key={index} {...tech} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default Tech;
