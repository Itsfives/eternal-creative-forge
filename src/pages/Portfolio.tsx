
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const Portfolio = () => {
  const projects = [
    {
      title: "EcoTech Solutions",
      description: "A modern e-commerce platform for sustainable technology products with advanced filtering and payment integration.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      tags: ["React", "Node.js", "Stripe", "MongoDB"],
      category: "E-commerce",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "MedConnect",
      description: "Healthcare platform connecting patients with medical professionals through secure video consultations.",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      tags: ["React", "WebRTC", "Socket.io", "PostgreSQL"],
      category: "Healthcare",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "FinanceFlow",
      description: "Personal finance management dashboard with real-time analytics and budgeting tools.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tags: ["Vue.js", "D3.js", "Firebase", "Plaid API"],
      category: "FinTech",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "EduHub",
      description: "Online learning platform with interactive courses, progress tracking, and certification system.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
      tags: ["React", "GraphQL", "AWS", "MongoDB"],
      category: "Education",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "RestaurantPro",
      description: "Complete restaurant management system with online ordering, inventory tracking, and analytics.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop",
      tags: ["Next.js", "Prisma", "Stripe", "Vercel"],
      category: "Restaurant",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "FitTracker",
      description: "Fitness application with workout planning, progress tracking, and social features.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      tags: ["React Native", "Node.js", "MongoDB", "Redux"],
      category: "Health & Fitness",
      liveUrl: "#",
      githubUrl: "#"
    }
  ];

  const categories = ["All", "E-commerce", "Healthcare", "FinTech", "Education", "Restaurant", "Health & Fitness"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover our latest projects and see how we've helped businesses transform their digital presence.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  className={index === 0 ? "bg-seagram-green hover:bg-seagram-green/90" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant="secondary">{project.category}</Badge>
                    </div>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-muted-foreground mb-8">
              Let's discuss how we can help bring your vision to life with our expertise and passion for excellence.
            </p>
            <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white px-8 py-3">
              Start Your Project
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
