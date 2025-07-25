import { Play, Volume2 } from "lucide-react";
import { useState } from "react";

export const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const video = e.currentTarget.querySelector('video') as HTMLVideoElement;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            See the Method in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Watch this brief introduction to understand how the Sleepy Little One Method™ 
            can transform your baby's sleep—gently and effectively.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative bg-card rounded-3xl overflow-hidden shadow-floating group cursor-pointer" onClick={handleVideoClick}>
          {/* Video Thumbnail */}
          <div className="relative aspect-video bg-gradient-hero/20">
            <video 
              src="https://kajabi-storefronts-production.s3.amazonaws.com/file-uploads/sites/2148650071/video/5122a6a-60d-4827-3862-b3f0e3ee7f4_000-Intro_Sleepy_Little_One_website.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI4TIKYMSB4PQMFBA%2F20250725%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250725T025635Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=c60a5ee5a2524db44523bbee26cd5f3d32d70d967aaa465c16a7567d64547e7f"
              preload="metadata"
              controls
              className="w-full h-full object-cover"
              poster="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2161380481/settings_images/53644-3d28-da27-424a-1caf34a6768_v3_Intro_website-Cover.jpg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-hero/30 group-hover:bg-gradient-hero/20 transition-all duration-300"></div>
            
            {/* Play Button - Only show when not playing */}
            {!isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-primary-foreground/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-floating">
                  <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
            )}

            {/* Video Info */}
            <div className="absolute bottom-4 left-4 text-primary-foreground">
              <div className="flex items-center space-x-2 text-sm">
                <Volume2 className="w-4 h-4" />
                <span>Introduction Video • 3:42</span>
              </div>
            </div>
          </div>

          {/* Video Caption */}
          <div className="p-6 bg-card">
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Introduction to the Sleepy Little One Method™
            </h3>
            <p className="text-muted-foreground">
              Learn the science behind our gentle approach and see real testimonials 
              from families who have transformed their sleep in just days.
            </p>
          </div>
        </div>

        {/* Video Benefits */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-accent/20 rounded-2xl">
            <h4 className="font-semibold text-foreground mb-2">Learn the Science</h4>
            <p className="text-sm text-muted-foreground">
              Understand the biological systems behind healthy baby sleep
            </p>
          </div>
          <div className="text-center p-6 bg-accent/20 rounded-2xl">
            <h4 className="font-semibold text-foreground mb-2">See Real Results</h4>
            <p className="text-sm text-muted-foreground">
              Hear from real parents about their transformation stories
            </p>
          </div>
          <div className="text-center p-6 bg-accent/20 rounded-2xl">
            <h4 className="font-semibold text-foreground mb-2">Preview the Method</h4>
            <p className="text-sm text-muted-foreground">
              Get a glimpse of the gentle techniques you'll learn
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};