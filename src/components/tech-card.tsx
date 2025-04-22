
interface TechCardProps {
  name: string;
  icon?: string;
  level?: number;
  category: string;
}

export function TechCard({ name, icon, level = 3, category }: TechCardProps) {
  return (
    <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      {icon && (
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50 mr-3">
          <img src={icon} alt={name} className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="flex space-x-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className={`w-1.5 h-6 rounded-full ${i < level ? 'bg-nubank-base' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
