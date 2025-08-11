import { useParams, useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Tag } from "lucide-react";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // This would typically come from your database or API
  const projectDetails = {
    "eternals-studio": {
      title: "Eternals Studio",
      description: "A GFX, VFX, Coding, Music Production Studio!",
      fullDescription: "Eternals Studio is a comprehensive creative studio specializing in graphics design, visual effects, coding, and music production. We provide end-to-end creative solutions for gaming organizations, content creators, and businesses looking to establish a strong visual identity.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=600,fit=crop/YNqO7k0WyEUyB3w6/img_1795-YNqykO6O7yIrvvGr.jpg",
      tags: ["GFX", "VFX", "Coding", "Music Production"],
      category: "Studio",
      year: "2024",
      client: "Internal Project",
      gallery: [
        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/img_1795-YNqykO6O7yIrvvGr.jpg"
      ]
    },
    "eternals-gg": {
      title: "Eternals GGs",
      description: "A Content Creation and Esports Organization based in a wide variety of competitive games.",
      fullDescription: "Eternals GGs serves as our parent organization, focusing on content creation and esports across multiple competitive gaming platforms. We've helped establish their brand identity, create promotional materials, and develop their digital presence across various gaming communities.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=600,fit=crop/YNqO7k0WyEUyB3w6/e795ed40-7f78-4cc9-b0eb-11931e05891f_rw_1920-mp8vZO4gvOc1Vazm.jpg",
      tags: ["Esports", "Content Creation", "Organization", "Gaming"],
      category: "Esports",
      year: "2024",
      client: "Eternals GGs",
      gallery: [
        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/e795ed40-7f78-4cc9-b0eb-11931e05891f_rw_1920-mp8vZO4gvOc1Vazm.jpg"
      ]
    },
    "deceptive-grounds": {
      title: "Deceptive Grounds",
      description: "A multi-game based community hosting servers on games such as Garry's Mod and Arma 3.",
      fullDescription: "Deceptive Grounds is a thriving gaming community that we've helped establish through comprehensive branding and visual identity work. Our team created their logo, server graphics, promotional materials, and community assets that have helped them build a strong presence in the gaming world.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=600,fit=crop/YNqO7k0WyEUyB3w6/img_1853-AMqbkp9joNSR2Bl2.jpg",
      tags: ["Gaming", "Community", "Servers", "Multi-game"],
      category: "Gaming",
      year: "2024",
      client: "Deceptive Grounds Community",
      gallery: [
        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/img_1853-AMqbkp9joNSR2Bl2.jpg"
      ]
    },
    "7-cubed-films": {
      title: "7 Cubed Films",
      description: "A SFM animation artist specializing in Star Wars: The Clone Wars setting with over 5+ Million Views",
      fullDescription: "7 Cubed Films is a renowned SFM animation channel that has achieved incredible success with over 5 million views. We've provided comprehensive branding support, including logo design, channel graphics, and promotional materials that have helped establish their strong presence in the Star Wars animation community.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1200,h=600,fit=crop/YNqO7k0WyEUyB3w6/77f1-AoPvMlwkLbFo9JGJ.png",
      tags: ["Animation", "SFM", "Star Wars", "Film"],
      category: "Animation",
      year: "2024",
      client: "7 Cubed Films",
      gallery: [
        "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=600,fit=crop/YNqO7k0WyEUyB3w6/77f1-AoPvMlwkLbFo9JGJ.png"
      ]
    }
  };

  const project = projectDetails[projectId as keyof typeof projectDetails];

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/portfolio")} className="bg-seagram-green hover:bg-seagram-green/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <Button 
              onClick={() => navigate("/portfolio")} 
              variant="outline" 
              className="mb-8 hover:border-seagram-green hover:text-seagram-green"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portfolio
            </Button>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="border-seagram-green text-seagram-green">
                    {project.category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-1" />
                    {project.year}
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                  {project.title}
                </h1>
                
                <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="hover:bg-seagram-green/10 transition-colors">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Card className="p-6 bg-muted/30">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2 text-foreground">Client</h3>
                    <p className="text-muted-foreground">{project.client}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto rounded-lg shadow-xl hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Project Details */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Project Overview</h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-muted-foreground leading-relaxed">
                {project.fullDescription}
              </p>
            </div>
          </div>
        </section>
        
        {/* Gallery */}
        {project.gallery && project.gallery.length > 0 && (
          <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">Project Gallery</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.gallery.map((image, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover-lift">
                    <img
                      src={image}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Similar Work?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise and passion for excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white px-8 py-3 hover:scale-105 transition-all duration-300">
                Start Your Project
              </Button>
              <Button 
                variant="outline" 
                className="px-8 py-3 hover:border-seagram-green hover:text-seagram-green hover:scale-105 transition-all duration-300"
                onClick={() => navigate("/portfolio")}
              >
                View More Projects
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetail;