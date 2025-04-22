
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
    <div className={cn("rounded-2xl overflow-hidden shadow-md bg-white mb-4", className)}>
      {image && (
        <div className="w-full h-48 overflow-hidden relative">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 mt-2 text-sm">{description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-nubank-light bg-opacity-20 text-nubank-base"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
