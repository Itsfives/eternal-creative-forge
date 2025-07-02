
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--seagram-green)/0.1),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--violet-purple)/0.1),transparent_70%)]"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-seagram-green rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-violet-purple rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-seagram-green rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-1/3 w-2 h-2 bg-violet-purple rounded-full animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="block text-foreground">Welcome to</span>
            <span className="block bg-gradient-to-r from-seagram-green via-violet-purple to-seagram-green bg-clip-text text-transparent animate-pulse">
              Eternals Studio
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            Your vision, our expertise. We transform ideas into stunning digital experiences through 
            <span className="text-seagram-green font-semibold"> coding</span>, 
            <span className="text-violet-purple font-semibold"> design</span>, 
            <span className="text-seagram-green font-semibold"> 3D modeling</span>, 
            <span className="text-violet-purple font-semibold"> animation</span>, 
            <span className="text-seagram-green font-semibold"> music</span>, and 
            <span className="text-violet-purple font-semibold"> video editing</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-seagram-green to-seagram-green/90 hover:from-seagram-green/90 hover:to-seagram-green text-white px-8 py-6 text-lg font-semibold group"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-violet-purple text-violet-purple hover:bg-violet-purple hover:text-white px-8 py-6 text-lg font-semibold group"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Watch Our Work
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-seagram-green">500+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-violet-purple">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-seagram-green">24/7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-violet-purple">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
