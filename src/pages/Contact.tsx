
import { MobileNav } from "@/components/ui/mobile-nav";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Linkedin, Github } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-nubank-light p-6 pt-12 pb-8 text-white">
        <h1 className="text-2xl font-bold">Contato</h1>
        <p className="text-sm opacity-90 mt-1">Entre em contato comigo</p>
      </div>

      {/* Conteúdo */}
      <div className="px-4 mt-6">
        <SectionHeader title="Vamos conversar" description="Tem um projeto em mente? Envie uma mensagem!" />

        {/* Contatos rápidos */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-nubank-light bg-opacity-20 flex items-center justify-center mr-3">
              <Mail className="w-5 h-5 text-nubank-base" />
            </div>
            <div>
              <p className="text-sm text-gray-500">E-mail</p>
              <a href="mailto:contato@exemplo.com" className="text-gray-800 font-medium">
                contato@exemplo.com
              </a>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-nubank-light bg-opacity-20 flex items-center justify-center mr-3">
              <Phone className="w-5 h-5 text-nubank-base" />
            </div>
            <div>
              <p className="text-sm text-gray-500">WhatsApp</p>
              <a href="https://wa.me/5500000000000" className="text-gray-800 font-medium">
                +55 (00) 00000-0000
              </a>
            </div>
          </div>
        </div>

        {/* Formulário de contato */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <Input id="name" placeholder="Seu nome" className="w-full" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <Input id="email" type="email" placeholder="seu@email.com" className="w-full" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <Textarea 
                id="message" 
                placeholder="Descreva seu projeto ou deixe sua mensagem" 
                className="w-full min-h-[120px]" 
              />
            </div>
            
            <Button className="w-full bg-nubank-base hover:bg-nubank-dark">
              Enviar Mensagem
            </Button>
          </form>
        </div>

        {/* Redes sociais */}
        <SectionHeader title="Redes Sociais" />
        <div className="flex space-x-3 mb-6">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <Linkedin className="w-5 h-5 text-gray-700" />
          </a>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center"
          >
            <Github className="w-5 h-5 text-gray-700" />
          </a>
        </div>
      </div>

      {/* Navegação inferior */}
      <MobileNav />
    </div>
  );
};

export default Contact;
