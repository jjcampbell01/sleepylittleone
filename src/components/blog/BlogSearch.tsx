import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface BlogSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function BlogSearch({ onSearch, placeholder = "Search articles..." }: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  return (
    <div className="relative max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12 text-base border-2 focus:border-primary transition-colors"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}