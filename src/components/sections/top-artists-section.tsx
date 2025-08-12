import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedSection } from "@/components/animated-section";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const artists = [
  {
    name: "Joney sin",
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "artist portrait",
    coverImageUrl: "https://placehold.co/600x400.png",
    coverImageHint: "abstract painting",
  },
  {
    name: "Ani Joy",
    avatarUrl: "https://placehold.co/40x40.png",
    avatarHint: "female artist",
    coverImageUrl: "https://placehold.co/600x400.png",
    coverImageHint: "colorful mural",
  },
];

export function TopArtistsSection() {
  return (
    <AnimatedSection id="top-artists" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="lg:w-1/3">
            <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
              Artist
            </p>
            <h2 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Top List Artist
            </h2>
            <p className="text-foreground/80 text-lg">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
              commodo ligula eget dolor. Aenean massa.
            </p>
          </div>

          {/* Right Column - Artist Cards */}
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            {artists.map((artist) => (
              <Card
                key={artist.name}
                className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
              >
                <div className="relative aspect-[3/2]">
                  <Image
                    src={artist.coverImageUrl}
                    alt={`${artist.name}'s artwork`}
                    fill
                    className="object-cover"
                    data-ai-hint={artist.coverImageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-primary-foreground">
                        <AvatarImage
                          src={artist.avatarUrl}
                          alt={artist.name}
                          data-ai-hint={artist.avatarHint}
                        />
                        <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg text-primary-foreground">
                        {artist.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
