
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Palette, Box, Film, Music, Video } from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites, web applications, and e-commerce solutions built with modern technologies.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20"
    },
    {
      icon: Palette,
      title: "Graphic Design",
      description: "Stunning visual identities, branding, logos, and marketing materials that captivate audiences.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20"
    },
    {
      icon: Box,
      title: "3D Modeling",
      description: "Detailed 3D models, product visualizations, and architectural renderings.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20"
    },
    {
      icon: Film,
      title: "Animation",
      description: "Bring your ideas to life with smooth 2D and 3D animations, motion graphics, and visual effects.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20"
    },
    {
      icon: Music,
      title: "Music Production",
      description: "Professional music composition, sound design, and audio production for all your projects.",
      color: "text-seagram-green",
      bgColor: "bg-seagram-green/10",
      borderColor: "border-seagram-green/20"
    },
    {
      icon: Video,
      title: "Video Editing",
      description: "Professional video editing, color grading, and post-production services.",
      color: "text-violet-purple",
      bgColor: "bg-violet-purple/10",
      borderColor: "border-violet-purple/20"
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, we offer comprehensive creative services to bring your vision to life.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className={`group hover:scale-105 transition-all duration-300 ${service.borderColor} ${service.bgColor} backdrop-blur-sm hover:shadow-xl hover:shadow-${service.color.split('-')[1]}-500/10`}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-16 h-16 rounded-full ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-8 w-8 ${service.color}`} />
                </div>
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-${service.color.split('-')[1]}-500 transition-colors">
                  {service.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-center leading-relaxed">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center w-full max-w-md mx-auto p-1 bg-gradient-to-r from-seagram-green to-violet-purple rounded-full">
            <div className="bg-background rounded-full px-8 py-4 w-full text-center">
              <p className="text-foreground font-semibold">
                Ready to start your project?{" "}
                <span className="bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent cursor-pointer hover:underline">
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
