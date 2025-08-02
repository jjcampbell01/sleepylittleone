import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <Skeleton className="h-16 w-96 mx-auto mb-6" />
          <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>

        {/* Search and Filter Skeleton */}
        <div className="space-y-6 mb-12">
          <Skeleton className="h-12 w-80 mx-auto" />
          <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24" />
            ))}
          </div>
        </div>

        {/* Featured Post Skeleton */}
        <section className="mb-16">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="overflow-hidden">
            <div className="md:flex">
              <Skeleton className="md:w-1/2 aspect-video md:aspect-auto h-64 md:h-auto" />
              <div className="md:w-1/2 p-8">
                <div className="flex gap-2 mb-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-8 w-full mb-2" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <div className="flex gap-6 mb-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </Card>
        </section>

        {/* Recent Posts Grid Skeleton */}
        <section>
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video" />
                <CardHeader className="pb-3">
                  <Skeleton className="h-6 w-20 mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="pt-0">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}