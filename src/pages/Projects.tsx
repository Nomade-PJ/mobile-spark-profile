
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Sistema PDV Integrado",
      description: "Sistema completo para pontos de venda com gestão de estoque, controle financeiro e relatórios detalhados.",
      technologies: ["React", "Node.js", "MySQL", "Firebase"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      githubUrl: "https://github.com/user/pdv-system"
    },
    {
      title: "Aplicativo de Delivery",
      description: "App mobile para entrega de produtos com rastreamento em tempo real e sistema de avaliações.",
      technologies: ["React Native", "Firebase", "Google Maps API"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
      githubUrl: "https://github.com/user/delivery-app"
    },
    {
      title: "Dashboard Financeiro",
      description: "Painel administrativo para visualização de métricas financeiras e relatórios personalizados.",
      technologies: ["Vue.js", "Chart.js", "PostgreSQL"],
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
      githubUrl: "https://github.com/user/finance-dashboard"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-nubank-dark to-nubank-base p-6 pt-12 pb-16 text-white">
        <h1 className="text-2xl font-bold mb-2">Projetos</h1>
        <p className="text-sm opacity-90">Portfólio de trabalhos desenvolvidos</p>
      </div>

      {/* Conteúdo */}
      <div className="px-4 -mt-8">
        <div className="space-y-4">
          {projects.map((project, index) => (
            <div key={index} className="relative">
              <ProjectCard
                title={project.title}
                description={project.description}
                technologies={project.technologies}
                image={project.image}
                className="relative z-10"
              />
              {project.githubUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute -bottom-3 right-4 z-20 bg-white shadow-sm"
                  onClick={() => window.open(project.githubUrl, '_blank')}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Ver código
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <MobileNav />
    </div>
  );
};

export default Projects;
