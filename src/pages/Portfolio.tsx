
import Navigation from "../components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Filter } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  const projects = [
    {
      id: "eternals-studio",
      title: "Eternals Studio",
      description: "A GFX, VFX, Coding, Music Production Studio!",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/img_1795-YNqykO6O7yIrvvGr.jpg",
      tags: ["GFX", "VFX", "Coding", "Music Production"],
      category: "Studio",
      year: "2024",
      featured: true
    },
    {
      id: "eternals-gg",
      title: "Eternals GGs",
      description: "A Content Creation and Esports Organization based in a wide variety of competitive games. Also our parent organization. They also provide content across multiple platforms.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/e795ed40-7f78-4cc9-b0eb-11931e05891f_rw_1920-mp8vZO4gvOc1Vazm.jpg",
      tags: ["Esports", "Content Creation", "Organization", "Gaming"],
      category: "Esports",
      year: "2024",
      featured: true
    },
    {
      id: "deceptive-grounds",
      title: "Deceptive Grounds",
      description: "A multi-game based community. They host servers on games such as Garry's Mod and Arma 3.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/img_1853-AMqbkp9joNSR2Bl2.jpg",
      tags: ["Gaming", "Community", "Servers", "Multi-game"],
      category: "Gaming",
      year: "2024"
    },
    {
      id: "team-uk-ireland",
      title: "Team UK & Ireland",
      description: "A new upcoming Organization that represents the spirit of Ireland and United Kingdom together.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/uki-YKb6q3vNMoiGV4V8.png",
      tags: ["Organization", "UK", "Ireland", "Gaming"],
      category: "Esports",
      year: "2024"
    },
    {
      id: "shinto-gaming-club",
      title: "Shinto Gaming Club",
      description: "A new esports gaming club that is partaking in various esports tournaments.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/img_1907-AGB6kk44XzULb0rL.jpg",
      tags: ["Esports", "Gaming Club", "Tournaments", "Competitive"],
      category: "Esports",
      year: "2024"
    },
    {
      id: "hp-league",
      title: "HP League",
      description: "A new Esports league that was partaking in XDefiant and PUBG.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/ddssd-YlevxJlDrxTEV0bG.png",
      tags: ["Esports", "League", "XDefiant", "PUBG"],
      category: "Esports",
      year: "2024"
    },
    {
      id: "neverfps",
      title: "NeverFPS",
      description: "A variety streamer turned game developer.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop/YNqO7k0WyEUyB3w6/nevers-kick-banner-AGB6RE277PfQ45LM.jpg",
      tags: ["Streaming", "Game Development", "Variety", "Content"],
      category: "Content Creation",
      year: "2024"
    },
    {
      id: "thumbnails",
      title: "Thumbnails",
      description: "Thumbnails are used to engage and draw audiences to a particular video.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=384,fit=crop,trim=0;129.31185944363105;0;16.866764275256223/YNqO7k0WyEUyB3w6/c3f4f288-9f7c-4ec9-89db-e3088a16a602_rw_1920-YrDle0221nILr5K9.jpg",
      tags: ["Design", "Thumbnails", "Video", "Engagement"],
      category: "Design",
      year: "2024"
    },
    {
      id: "3d-work",
      title: "3D Work",
      description: "This is a collection of our completed 3D Work.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=440,fit=crop,trim=267.3267326732673;0;324.3564356435644;0/YNqO7k0WyEUyB3w6/gif-AR0yxZWlxjHjRnnn.png",
      tags: ["3D", "Modeling", "Design", "Visualization"],
      category: "3D",
      year: "2024"
    },
    {
      id: "7-cubed-films",
      title: "7 Cubed Films",
      description: "A SFM animation artist that specializes in a Star Wars: The Clone Wars setting and has over 5+ Million Views",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=600,fit=crop/YNqO7k0WyEUyB3w6/77f1-AoPvMlwkLbFo9JGJ.png",
      tags: ["Animation", "SFM", "Star Wars", "Film"],
      category: "Animation",
      year: "2024",
      featured: true
    },
    {
      id: "posters",
      title: "Posters",
      description: "Posters were made as an advertisement tool to help people engage in the esports communities and drive engagement.",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=606,h=776,fit=crop/YNqO7k0WyEUyB3w6/c4a83127-4a3e-4f60-9ba8-8dba90f43791_rw_1200-AQEyOM9p1yF9GWwO.jpg",
      tags: ["Design", "Posters", "Advertising", "Esports"],
      category: "Design",
      year: "2024"
    },
    {
      id: "whysper",
      title: "ULoveWhysper",
      description: "A content creator and competitive player who steamed from Apex to Marvel Rivals!",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=709,h=384,fit=crop/YNqO7k0WyEUyB3w6/whysper-YbNqBQR7ykClLJ2q.jpg",
      tags: ["Content Creation", "Streaming", "Gaming", "Competitive"],
      category: "Content Creation",
      year: "2025",
      featured: true
    },
    {
      id: "midas-networks",
      title: "Midas Networks",
      description: "A Multi-Game Hosting Network based in Garry's Mod, FiveM, Arma, Squad and more!",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=709,h=384,fit=crop/YNqO7k0WyEUyB3w6/midas-for-website-Yyv0nV0WMjCMk3pq.jpg",
      tags: ["Gaming", "Hosting", "Network", "Multi-Game"],
      category: "Gaming",
      year: "2025"
    }
  ];

  const categories = ["All", "Studio", "Esports", "Gaming", "Content Creation", "Design", "3D", "Animation"];

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
                <Card 
                  key={index} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-500 group hover-lift animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => navigate(`/portfolio/${project.id}`)}
                >
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
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="bg-white/90 hover:bg-white hover:scale-110 transition-all"
                        onClick={() => navigate(`/portfolio/${project.id}`)}
                      >
                        <ExternalLink className="w-4 h-4" />
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
