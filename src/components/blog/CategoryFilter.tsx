import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

interface CategoryFilterProps {
  categories: BlogCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  postCounts?: Record<string, number>;
}

const CATEGORY_COLORS = {
  'Expert Advice': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  'Inclusive Parenting': 'bg-green-100 text-green-800 hover:bg-green-200',
  'Newborn Sleep': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  'Night Wakings': 'bg-orange-100 text-orange-800 hover:bg-orange-200',
  'Safe Sleep': 'bg-red-100 text-red-800 hover:bg-red-200',
  'Sleep Tools & Insights': 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
} as const;

export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategorySelect, 
  postCounts = {} 
}: CategoryFilterProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">Browse by Category</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => onCategorySelect(null)}
            size="sm"
            className="transition-all duration-200"
          >
            All Articles
            {Object.values(postCounts).length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {Object.values(postCounts).reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
          
          {categories.map((category) => {
            const colorClass = CATEGORY_COLORS[category.name as keyof typeof CATEGORY_COLORS] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
            const isSelected = selectedCategory === category.id;
            
            return (
              <Button
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                onClick={() => onCategorySelect(category.id)}
                size="sm"
                className={`transition-all duration-200 ${!isSelected ? colorClass : ''}`}
              >
                {category.name}
                {postCounts[category.id] && (
                  <Badge variant="secondary" className="ml-2">
                    {postCounts[category.id]}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}