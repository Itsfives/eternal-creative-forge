import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, ExternalLink, Github, Calendar, User, Quote } from "lucide-react";
import Navigation from "@/components/Navigation";
import { usePortfolio } from "@/hooks/usePortfolio";

const ProjectDetail = () => {
  const { slug } = useParams();
  const { getPortfolioBySlug } = usePortfolio();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (slug) {
        try {
          const data = await getPortfolioBySlug(slug);
          setProject(data);
        } catch (error) {
          console.error('Error fetching project:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProject();
  }, [slug, getPortfolioBySlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-seagram-green"></div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/portfolio">
              <Button className="bg-seagram-green hover:bg-seagram-green/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/portfolio">
              <Button variant="ghost" className="hover:bg-muted">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="outline" className="mb-2">
                    {project.category}
                  </Badge>
                  {project.featured && (
                    <Badge className="bg-seagram-green hover:bg-seagram-green/90">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-seagram-green to-violet-purple bg-clip-text text-transparent">
                  {project.title}
                </h1>
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  {project.live_url && (
                    <Button asChild className="bg-seagram-green hover:bg-seagram-green/90">
                      <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live Site
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" asChild>
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        View Code
                      </a>
                    </Button>
                  )}
                </div>

                {/* Project Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.client && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="w-4 h-4" />
                      <span>Client: {project.client}</span>
                    </div>
                  )}
                  {project.completed_date && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Completed: {new Date(project.completed_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-1/2">
                {project.images && project.images.length > 0 && (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-64 lg:h-96 object-cover rounded-lg shadow-2xl"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Technologies Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {project.challenges && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Challenges</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.challenges}
                  </p>
                </CardContent>
              </Card>
            )}

            {project.solutions && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-600">Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.solutions}
                  </p>
                </CardContent>
              </Card>
            )}

            {project.results && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.results}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 1 && (
            <Card className="mb-12">
              <CardHeader>
                <CardTitle>Project Gallery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {project.images.slice(1).map((image: string, index: number) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${project.title} screenshot ${index + 2}`}
                      className="w-full h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Testimonial */}
          {project.testimonial && (
            <Card className="mb-12 bg-muted/30">
              <CardContent className="p-8">
                <Quote className="w-8 h-8 text-seagram-green mb-4" />
                <blockquote className="text-lg italic mb-4 leading-relaxed">
                  "{project.testimonial}"
                </blockquote>
                {project.testimonial_author && (
                  <cite className="text-muted-foreground">
                    — {project.testimonial_author}
                  </cite>
                )}
              </CardContent>
            </Card>
          )}

          {/* CTA Section */}
          <Card className="text-center bg-gradient-to-r from-seagram-green/10 to-violet-purple/10">
            <CardContent className="p-12">
              <h2 className="text-2xl font-bold mb-4">Interested in Working Together?</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to bring your project to life? Let's discuss how we can help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="bg-seagram-green hover:bg-seagram-green/90">
                  <Link to="/contact">Start Your Project</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/portfolio">View More Work</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;