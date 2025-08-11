
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Filter } from "lucide-react";
import { useState } from "react";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const projects = [
    {
      title: "7 Cubed Films",
      description: "Complete branding and visual identity package for 7 Cubed Films including logo design, promotional materials, and digital assets for their film production company.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=396,fit=crop/YNqO7k0WyEUyB3w6/77f3-AQEykV2w8vf9Gkzv.png",
      tags: ["Branding", "Logo Design", "Visual Identity", "Film"],
      category: "Branding",
      liveUrl: "https://eternalvisuals.myportfolio.com/7-cubed-films-commission",
      githubUrl: "#",
      featured: true
    },
    {
      title: "HP League",
      description: "Esports league branding and visual identity including team logos, tournament graphics, and promotional materials for competitive gaming organization.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=396,fit=crop/YNqO7k0WyEUyB3w6/hp_league_avi-YrDlvXpP6gHPZ9KB.png",
      tags: ["Esports", "Gaming", "Tournament Graphics", "Branding"],
      category: "Esports",
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "Deceptive Grounds",
      description: "Gaming brand visual identity and logo design for Deceptive Grounds, including social media assets and promotional graphics.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=396,fit=crop/YNqO7k0WyEUyB3w6/dg_avi-m5Kw9r0g6WUEeL1E.jpg",
      tags: ["Gaming", "Logo Design", "Social Media", "Branding"],
      category: "Gaming",
      liveUrl: "#",
      githubUrl: "#",
      featured: true
    },
    {
      title: "Eternals GG",
      description: "Complete branding package for Eternals gaming organization including team identity, merchandise design, and digital marketing materials.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=396,fit=crop/YNqO7k0WyEUyB3w6/dab21dff-54d2-443f-8116-92041be0886b_rw_1200-Yyv3b2NyzNsR7pVv.jpg",
      tags: ["Gaming", "Team Branding", "Merchandise", "Digital Marketing"],
      category: "Esports",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "DevilWolf Giveaway Winner",
      description: "Special promotional graphics and winner announcement materials for DevilWolf community giveaway campaign.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=396,fit=crop/YNqO7k0WyEUyB3w6/9a852f5f-5b04-45dd-9305-300b4aaacf34_rw_1200-ALpnkb3j7XSbVr1V.jpg",
      tags: ["Promotional Graphics", "Community", "Social Media", "Marketing"],
      category: "Marketing",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Shinto Gaming Club",
      description: "Gaming club branding and visual identity including logo design, team graphics, and tournament promotional materials.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=400,h=384,fit=crop/YNqO7k0WyEUyB3w6/sgc-avi-02-dWxyk2D7NPCn19M9.jpg",
      tags: ["Gaming Club", "Logo Design", "Tournament Graphics", "Team Identity"],
      category: "Gaming",
      liveUrl: "#",
      githubUrl: "#"
    },
    {
      title: "Corbyn Altman",
      description: "Personal branding and portfolio design for creative professional including logo design and digital presence optimization.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=284,h=255,fit=crop/YNqO7k0WyEUyB3w6/social-avatar-ca-AMqbkJ1bl7C87xWE.jpg",
      tags: ["Personal Branding", "Portfolio Design", "Digital Presence", "Creative"],
      category: "Personal Branding",
      liveUrl: "https://corbynaltman.com/#work",
      githubUrl: "#"
    },
    {
      title: "InGloom Media",
      description: "Media company branding and visual identity including logo design, brand guidelines, and digital marketing materials.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=284,h=255,fit=crop/YNqO7k0WyEUyB3w6/cw2cevgn_400x400-YZ9VkX2rnbt4wERz.jpg",
      tags: ["Media Branding", "Logo Design", "Brand Guidelines", "Digital Marketing"],
      category: "Branding",
      liveUrl: "https://ingloommedia.com/",
      githubUrl: "#"
    }
  ];

  const categories = ["All", "Branding", "Esports", "Gaming", "Marketing", "Personal Branding"];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent mb-6">
              Our Portfolio
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Discover our latest projects and see how we've helped businesses transform their digital presence.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-seagram-green rounded-full"></div>
                <span>{projects.length} Total Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-violet-purple rounded-full"></div>
                <span>{featuredProjects.length} Featured</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-8">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Filter by category:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={`hover:scale-105 transition-all duration-300 ${
                    activeCategory === category 
                      ? "bg-seagram-green hover:bg-seagram-green/90 shadow-lg shadow-seagram-green/25" 
                      : "hover:border-seagram-green hover:text-seagram-green"
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {projects.filter(p => p.category === category).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 group hover-lift animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="relative overflow-hidden">
                    {project.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-violet-purple text-white">Featured</Badge>
                      </div>
                    )}
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white hover:scale-110 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white hover:scale-110 transition-all">
                        <Github className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-seagram-green transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge variant="outline" className="group-hover:border-seagram-green group-hover:text-seagram-green transition-colors">
                        {project.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs hover:bg-seagram-green/10 transition-colors">
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

        {/* Stats Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">{projects.length}+</div>
                <div className="text-muted-foreground">Projects Completed</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-violet-purple mb-2">{categories.length - 1}</div>
                <div className="text-muted-foreground">Industries Served</div>
              </Card>
              <Card className="text-center p-6 hover-lift">
                <div className="text-3xl font-bold text-seagram-green mb-2">100%</div>
                <div className="text-muted-foreground">Client Satisfaction</div>
              </Card>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-seagram-green hover:bg-seagram-green/90 text-white px-8 py-3 hover:scale-105 transition-all duration-300">
                Start Your Project
              </Button>
              <Button variant="outline" className="px-8 py-3 hover:border-seagram-green hover:text-seagram-green hover:scale-105 transition-all duration-300">
                View More Work
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
