
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  technologies: string[];
  image?: string;
  className?: string;
}

export function ProjectCard({
  title,
  description,
  technologies,
  image,
  className,
}: ProjectCardProps) {
  return (
    <div className={cn("rounded-2xl overflow-hidden shadow-sm bg-white", className)}>
      {image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs font-medium rounded-full bg-nubank-light bg-opacity-10 text-nubank-base"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
