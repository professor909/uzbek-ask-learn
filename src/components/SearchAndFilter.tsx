import { useState } from "react";
import { Search, Filter, SortAsc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const categories = [
  "all",
  "math",
  "physics", 
  "programming",
  "literature",
  "art",
  "history",
  "biology",
  "chemistry",
  "economics",
  "other"
];

const sortOptions = [
  { value: "newest", label: "Сначала новые" },
  { value: "oldest", label: "Сначала старые" },
  { value: "most_liked", label: "Популярные" },
  { value: "points_high", label: "Больше баллов" },
  { value: "points_low", label: "Меньше баллов" },
];

const SearchAndFilter = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SearchAndFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useLanguage();

  const activeFiltersCount = [
    selectedCategory !== "all",
    sortBy !== "newest"
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder={t('questions.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="relative flex-shrink-0"
        >
          <Filter className="w-4 h-4 mr-2" />
          Фильтры
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Категория
            </label>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? t('questions.allCategories') : t(`category.${category}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Сортировка
            </label>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center">
                      <SortAsc className="w-4 h-4 mr-2" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex items-end mt-4 sm:mt-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onCategoryChange("all");
                  onSortChange("newest");
                }}
                className="w-full sm:w-auto"
              >
                Сбросить
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex gap-2 flex-wrap">
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              {selectedCategory === "all" ? t('questions.allCategories') : t(`category.${selectedCategory}`)}
              <button
                onClick={() => onCategoryChange("all")}
                className="ml-1 hover:bg-destructive/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
          {sortBy !== "newest" && (
            <Badge variant="secondary" className="gap-1">
              {sortOptions.find(opt => opt.value === sortBy)?.label}
              <button
                onClick={() => onSortChange("newest")}
                className="ml-1 hover:bg-destructive/20 rounded-full w-4 h-4 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;