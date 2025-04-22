
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";
import { ProjectCard } from "@/components/project-card";

const Projects = () => {
  const projects = [
    {
      title: "Sistema PDV Integrado",
      description: "Sistema completo para pontos de venda com gestão de estoque, controle financeiro e relatórios detalhados.",
      technologies: ["React", "Node.js", "MySQL", "Firebase"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
    },
    {
      title: "Aplicativo de Delivery",
      description: "App mobile para entrega de produtos com rastreamento em tempo real e sistema de avaliações.",
      technologies: ["React Native", "Firebase", "Google Maps API"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    {
      title: "Dashboard Financeiro",
      description: "Painel administrativo para visualização de métricas financeiras e relatórios personalizados.",
      technologies: ["Vue.js", "Chart.js", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
    },
    {
      title: "App de Gestão de Tarefas",
      description: "Aplicativo para gerenciamento de equipes e acompanhamento de projetos com notificações.",
      technologies: ["Flutter", "Supabase", "Firebase Cloud Messaging"],
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-nubank-base p-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold">Projetos</h1>
        <p className="text-sm opacity-90 mt-1">Portfólio de trabalhos desenvolvidos</p>
      </div>

      {/* Conteúdo */}
      <div className="px-4 mt-6">
        <SectionHeader
          title="Aplicações Web & Mobile"
          description="Projetos desenvolvidos para diversos segmentos e necessidades"
        />

        <div className="space-y-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              title={project.title}
              description={project.description}
              technologies={project.technologies}
              image={project.image}
            />
          ))}
        </div>
      </div>
      
      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default Projects;
