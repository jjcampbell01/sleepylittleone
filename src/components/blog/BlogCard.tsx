import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock } from "lucide-react";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string;
  publish_date: string;
  read_time: number;
  category_id: string;
}

interface BlogCardProps {
  post: BlogPost;
  getCategoryName: (categoryId: string) => string;
  variant?: 'default' | 'featured';
}

const CATEGORY_COLORS = {
  'Expert Advice': 'bg-blue-50 text-blue-700 border-blue-200',
  'Inclusive Parenting': 'bg-green-50 text-green-700 border-green-200',
  'Newborn Sleep': 'bg-purple-50 text-purple-700 border-purple-200',
  'Night Wakings': 'bg-orange-50 text-orange-700 border-orange-200',
  'Safe Sleep': 'bg-red-50 text-red-700 border-red-200',
  'Sleep Tools & Insights': 'bg-indigo-50 text-indigo-700 border-indigo-200',
} as const;

export function BlogCard({ post, getCategoryName, variant = 'default' }: BlogCardProps) {
  const categoryName = getCategoryName(post.category_id);
  const categoryColorClass = CATEGORY_COLORS[categoryName as keyof typeof CATEGORY_COLORS] || 'bg-gray-50 text-gray-700 border-gray-200';

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-2 hover:border-primary/30 bg-gradient-to-br from-card to-card/50">
        <Link to={`/blog/${post.slug}`} className="block">
          <div className="md:flex">
            {post.featured_image_url && (
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            )}
            
            <div className="md:w-1/2 p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Badge className={`text-sm font-medium ${categoryColorClass}`}>
                  ✨ Featured
                </Badge>
                {post.category_id && (
                  <Badge variant="outline" className="text-sm">
                    {categoryName}
                  </Badge>
                )}
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight hover:text-primary transition-colors duration-300">
                {post.title}
              </h2>
              
              {post.excerpt && (
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                  {post.excerpt}
                </p>
              )}
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  {format(new Date(post.publish_date), 'MMM d, yyyy')}
                </div>
                
                {post.read_time > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.read_time} min read
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-500 cursor-pointer border hover:border-primary/20 bg-gradient-to-br from-card to-card/80">
      <Link to={`/blog/${post.slug}`} className="block">
        {post.featured_image_url && (
          <div className="aspect-[16/10] overflow-hidden">
            <img
              src={post.featured_image_url}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-3">
            {post.category_id && (
              <Badge className={`text-xs font-medium ${categoryColorClass}`}>
                {categoryName}
              </Badge>
            )}
          </div>
          
          <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-300 text-xl leading-tight">
            {post.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {post.excerpt && (
            <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}
          
          <Separator className="my-4" />
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {format(new Date(post.publish_date), 'MMM d, yyyy')}
            </div>
            
            {post.read_time > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.read_time} min read
              </div>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}