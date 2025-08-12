import Image from "next/image";
import { AnimatedSection } from "@/components/animated-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const trendingItems = [
  {
    imageUrl: "https://placehold.co/300x250.png",
    alt: "Trending item 1",
    imageHint: "abstract art",
  },
  {
    imageUrl: "https://placehold.co/300x250.png",
    alt: "Trending item 2",
    imageHint: "modern sculpture",
  },
  {
    imageUrl: "https://placehold.co/300x250.png",
    alt: "Trending item 3",
    imageHint: "digital painting",
  },
  {
    imageUrl: "https://placehold.co/300x250.png",
    alt: "Trending item 4",
    imageHint: "fantasy landscape",
  },
];

export function TrendingSection() {
  return (
    <AnimatedSection id="trending" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Left Column - Image Grid */}
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 md:gap-6">
            {trendingItems.map((item, index) => (
              <div
                key={index}
                className="aspect-[4/3] overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  width={300}
                  height={250}
                  className="object-cover w-full h-full "
                  data-ai-hint={item.imageHint}
                />
              </div>
            ))}
          </div>

          {/* Right Column - Text Content */}
          <div className="lg:w-1/2 lg:pl-10">
            <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
              Popular Item
            </p>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Hot Trending <br /> On This Week
            </h2>
            <p className="text-foreground/80 text-lg mb-8">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa.
            </p>
            <Button variant="link" asChild className="text-primary p-0 h-auto hover:text-primary/80">
              <Link href="#see-all-trending" className="flex items-center gap-2 text-md">
                See all <ArrowRight size={20}/>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
