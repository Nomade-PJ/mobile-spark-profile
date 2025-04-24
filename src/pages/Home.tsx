import { useState, useEffect } from "react";
import { SectionHeader } from "@/components/section-header";
import { ProjectCard } from "@/components/project-card";
import { MobileNav } from "@/components/ui/mobile-nav";
import config from "@/lib/config";

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
  created_at: string;
}

const Home = () => {
  const [homeSection, setHomeSection] = useState<Section | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Efeito de animação na entrada da página
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-entry');
    elements.forEach((el, index) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
          el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, []);

  // Carregar dados da API
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Buscar dados da seção Home
        const sectionResponse = await fetch(`${config.API_URL}/api/sections/home`);
        if (sectionResponse.ok) {
          const sectionData = await sectionResponse.json();
          setHomeSection(sectionData);
        }
        
        // Buscar projetos destacados (limitando a 2)
        const projectsResponse = await fetch(`${config.API_URL}/api/projects`);
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          setFeaturedProjects(projectsData.slice(0, 2));
        }
      } catch (error) {
        console.error('Erro ao carregar dados da home:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHomeData();
  }, []);

  // Processamento do conteúdo da seção
  const processContent = (content: string) => {
    if (!content) return { title: '', subtitle: '' };
    
    const parts = content.split('\n');
    return {
      title: parts[0] || 'Olá, eu sou o Dev',
      subtitle: parts[1] || 'Desenvolvedor Full-stack & Mobile'
    };
  };

  // Conteúdo processado da seção home
  const homeContent = homeSection ? processContent(homeSection.content) : {
    title: 'Olá, eu sou o Dev',
    subtitle: 'Desenvolvedor Full-stack & Mobile'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente estilo Nubank */}
      <div className="bg-gradient-to-r from-nubank-base to-nubank-light p-6 pt-12 pb-20 text-white rounded-b-3xl shadow-lg">
        <div className="animate-entry">
          <h1 className="text-4xl font-bold mb-2">{homeContent.title}</h1>
          <p className="text-lg opacity-90">{homeContent.subtitle}</p>
        </div>
        
        <div className="mt-4 animate-entry flex space-x-2">
          <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">React Native</span>
          <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">Node.js</span>
          <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">Flutter</span>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4 -mt-10 mb-20">
        {/* Card de resumo */}
        <div className="bg-white p-6 rounded-2xl shadow-md animate-entry">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Minha Jornada</h2>
          <p className="text-gray-600">
            Sou um desenvolvedor apaixonado por criar soluções tecnológicas que resolvem problemas reais.
            Especializado em desenvolvimento web e mobile, com experiência em sistemas PDV e integrações.
          </p>
        </div>

        {/* Projetos em destaque */}
        <div className="mt-8 animate-entry">
          <SectionHeader 
            title="Projetos Recentes" 
            description="Conheça alguns dos meus trabalhos mais recentes"
          />
          
          {loading ? (
            // Skeleton loader para projetos
            <div className="animate-pulse space-y-4">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ) : featuredProjects.length > 0 ? (
            // Renderizar projetos da API
            featuredProjects.map(project => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                technologies={project.tech_stack.split(',')}
                image={project.image_url}
              />
            ))
          ) : (
            // Fallback para quando não há projetos
            <ProjectCard
              title="Sistema PDV Integrado"
              description="Sistema completo para pontos de venda com gestão de estoque e relatórios financeiros."
              technologies={["React", "Node.js", "MySQL", "Firebase"]}
              image="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
            />
          )}
          
          <div className="mt-4 text-center">
            <a href="/projects" className="text-nubank-base font-medium">
              Ver todos os projetos →
            </a>
          </div>
        </div>
      </div>

      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default Home;
