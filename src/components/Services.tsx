
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Palette, Box, Film, Music, Video } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Services = () => {
  const [headerRef, headerVisible] = useScrollAnimation(0.2);
  const [gridRef, gridVisible] = useScrollAnimation(0.1);
  const [ctaRef, ctaVisible] = useScrollAnimation(0.3);

  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites, web applications, and e-commerce solutions built with modern technologies.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20",
      hoverShadow: "hover:shadow-seagram-green/20"
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Stunning visual identities, branding, logos, and marketing materials that captivate audiences.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20",
      hoverShadow: "hover:shadow-violet-purple/20"
    },
    {
      icon: Box,
      title: "3D Modeling",
      description: "Detailed 3D models, product visualizations, and architectural renderings.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20",
      hoverShadow: "hover:shadow-seagram-green/20"
    },
    {
      icon: Film,
      title: "Animation",
      description: "Bring your ideas to life with smooth 2D and 3D animations, motion graphics, and visual effects.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20",
      hoverShadow: "hover:shadow-violet-purple/20"
    },
    {
      icon: Music,
      title: "Music Production",
      description: "Professional music composition, sound design, and audio production for all your projects.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20",
      hoverShadow: "hover:shadow-seagram-green/20"
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing, color grading, and post-production services.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20",
      hoverShadow: "hover:shadow-violet-purple/20"
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className={`text-center mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, we offer comprehensive creative services to bring your vision to life.
          </p>
        </div>

        {/* Enhanced Services Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className={`group hover:scale-105 transition-all duration-500 ${service.borderColor} ${service.bgColor} backdrop-blur-sm hover:shadow-2xl ${service.hoverShadow} cursor-pointer ${
                gridVisible 
                  ? `opacity-100 translate-y-0 transition-delay-[${index * 100}ms]` 
                  : 'opacity-0 translate-y-10'
              }`}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) rotateY(5deg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotateY(0deg)';
              }}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 group-hover:shadow-lg ${service.hoverShadow}`}>
                  <service.icon className={`h-8 w-8 ${service.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <CardTitle className={`text-xl font-bold text-foreground group-hover:${service.color} transition-all duration-300`}>
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center leading-relaxed group-hover:text-foreground transition-colors duration-300">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <div ref={ctaRef} className={`text-center mt-16 transition-all duration-1000 ${ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center justify-center w-full max-w-md mx-auto p-1 bg-gradient-to-r from-seagram-green to-violet-purple rounded-full hover:scale-105 transition-transform duration-300 hover:shadow-lg hover:shadow-seagram-green/25">
            <div className="bg-background rounded-full px-8 py-4 w-full text-center hover:bg-background/90 transition-colors duration-300">
              <p className="text-foreground font-semibold">
                Ready to start your project?{" "}
                <span className="bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent cursor-pointer hover:underline hover:scale-105 inline-block transition-all duration-300">
                  Let's talk!
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
