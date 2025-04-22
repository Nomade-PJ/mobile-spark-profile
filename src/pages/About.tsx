
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-nubank-dark to-nubank-base p-6 pt-12 pb-16 text-white">
        <h1 className="text-2xl font-bold mb-2">Sobre Mim</h1>
        <p className="text-sm opacity-90">Desenvolvedor Full-Stack & Mobile</p>
      </div>

      {/* Foto de perfil */}
      <div className="px-4">
        <div className="flex justify-center -mt-12 mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
              alt="Perfil" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="px-4 mt-3">
        {/* Bio */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <SectionHeader title="Quem Sou" className="mb-3" />
          <p className="text-gray-700 mb-3">
            Sou um desenvolvedor apaixonado por criar soluções tecnológicas que 
            resolvem problemas reais. Com experiência em desenvolvimento web e mobile,
            tenho trabalhado em projetos diversos, desde sistemas PDV até aplicativos 
            com milhares de usuários.
          </p>
          <p className="text-gray-700">
            Minha jornada na programação começou há mais de 5 anos, e desde então
            venho aprimorando constantemente minhas habilidades para entregar 
            produtos de qualidade, com código limpo e boas práticas.
          </p>
        </div>

        {/* Experiência */}
        <div className="mb-6">
          <SectionHeader title="Experiência" />
          
          <div className="bg-white rounded-xl shadow-sm p-5 mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Desenvolvedor Full-Stack</h3>
                <p className="text-sm text-nubank-base">Empresa Tech</p>
              </div>
              <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                2021 - Atual
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Desenvolvimento de aplicações web e mobile utilizando React, React Native, Node.js e banco de dados SQL/NoSQL.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">Desenvolvedor Frontend</h3>
                <p className="text-sm text-nubank-base">Startup Inovadora</p>
              </div>
              <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                2019 - 2021
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Criação de interfaces web responsivas e desenvolvimento de componentes reutilizáveis com React e Vue.js.
            </p>
          </div>
        </div>

        {/* Educação */}
        <div className="mb-6">
          <SectionHeader title="Formação" />
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-800">Bacharel em Ciência da Computação</h3>
            <p className="text-sm text-nubank-base">Universidade Federal</p>
            <div className="flex items-center mt-1">
              <span className="text-xs bg-gray-100 rounded-full px-2 py-1 text-gray-600">
                2015 - 2019
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default About;
