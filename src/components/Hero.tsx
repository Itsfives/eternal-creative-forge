
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import AnimatedCounter from "./AnimatedCounter";
import LogoParticles from "./LogoParticles";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const [heroRef, heroVisible] = useScrollAnimation(0.1);
  const [statsRef, statsVisible] = useScrollAnimation(0.3);
  const { trackInteraction, trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <LogoParticles />
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(var(--seagram-green)/0.15),transparent_70%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(var(--violet-purple)/0.15),transparent_70%)] animate-pulse delay-1000"></div>
        
        {/* Enhanced floating particles */}
        <div className="absolute top-20 left-10 w-3 h-3 bg-seagram-green rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-40 right-20 w-4 h-4 bg-violet-purple rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-seagram-green rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-violet-purple rounded-full animate-bounce delay-1500"></div>
        <div className="absolute top-1/2 left-20 w-2 h-2 bg-seagram-green rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/3 right-40 w-3 h-3 bg-violet-purple rounded-full animate-pulse delay-1200"></div>
      </div>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`space-y-8 transition-all duration-1000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Main Heading with enhanced animation */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className={`block text-foreground transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              Welcome to
            </span>
            <span className={`block bg-gradient-to-r from-seagram-green via-violet-purple to-seagram-green bg-clip-text text-transparent transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              Eternals Studio
            </span>
          </h1>

          {/* Subtitle with staggered animation */}
          <div className={`max-w-4xl mx-auto space-y-4 transition-all duration-700 delay-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Transform Your Vision into Reality
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground italic">
              Where Ideas Become Reality
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              We are dedicated to enhancing the success of individuals and organizations across various fields, including business and esports, through our exceptional
              <span className="text-seagram-green font-semibold hover:scale-105 inline-block transition-transform cursor-default">&nbsp;graphical expertise</span>. 
              We understand that compelling visuals are essential in capturing attention and communicating ideas effectively. Whether it's creating stunning 
              <span className="text-violet-purple font-semibold hover:scale-105 inline-block transition-transform cursor-default">&nbsp;logos</span>, 
              immersive 
              <span className="text-seagram-green font-semibold hover:scale-105 inline-block transition-transform cursor-default">&nbsp;esports graphics</span>, 
              or engaging 
              <span className="text-violet-purple font-semibold hover:scale-105 inline-block transition-transform cursor-default">&nbsp;promotional materials</span>, 
              our team is committed to delivering high-quality solutions that elevate brands and drive growth.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-700 delay-900 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-seagram-green to-seagram-green/90 hover:from-seagram-green/90 hover:to-seagram-green text-white px-8 py-6 text-lg font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-seagram-green/25"
              onClick={() => {
                trackInteraction('hero_cta', 'click');
                trackBusinessEvent('project_inquiry_started', 'conversion');
                navigate('/contact');
              }}
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-violet-purple text-violet-purple hover:bg-violet-purple hover:text-white px-8 py-6 text-lg font-semibold group hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-violet-purple/25"
              onClick={() => {
                trackInteraction('hero_video', 'click');
                trackBusinessEvent('portfolio_viewed', 'engagement');
                window.open('https://www.youtube.com/@eternals_studio', '_blank');
              }}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              Watch Our Work
            </Button>
          </div>

          {/* Enhanced Animated Stats */}
          <div ref={statsRef} className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-1000 delay-1100 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-seagram-green">
                <AnimatedCounter end={4} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-seagram-green transition-colors">Projects Completed</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-violet-purple">
                <AnimatedCounter end={50} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-violet-purple transition-colors">Happy Clients</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-seagram-green">
                <AnimatedCounter end={5} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-seagram-green transition-colors">Years Experience</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-3xl md:text-4xl font-bold text-violet-purple">
                <span className="text-3xl inline-flex items-center">24/<AnimatedCounter end={7} /></span>
              </div>
              <div className="text-sm text-muted-foreground group-hover:text-violet-purple transition-colors">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
