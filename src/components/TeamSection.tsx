import { Card, CardContent } from "@/components/ui/card";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "In Gloom Media",
      role: "COO",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/gipivnpn_400x400-mxBZn8j445hBNVxv.jpg",
      bio: "Leading the operational excellence and strategic growth of Eternals Studio."
    },
    {
      name: "Kiran",
      role: "Owner",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/cw2cevgn_400x400-YZ9VkX2rnbt4wERz.jpg",
      bio: "Founder and visionary behind Eternals Studio, driving innovation in creative services."
    },
    {
      name: "Fives",
      role: "Designer",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/avi-A0xwJrW1WjtajWrk.jpg",
      bio: "Creative designer specializing in visual identity and brand development."
    },
    {
      name: "Psyphonic",
      role: "Designer",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/8-jisol9_400x400-AGB6kvvqPJCxpqEe.jpg",
      bio: "Talented designer focused on creating engaging graphics and visual experiences."
    },
    {
      name: "Griff",
      role: "Texture Designer",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/griff-YX4ykEq1Nzcy4RgW.jpg",
      bio: "Expert in 3D texturing and material design for gaming and visualization projects."
    },
    {
      name: "Corbyn",
      role: "Website Coder",
      image: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=297,h=264,fit=crop/YNqO7k0WyEUyB3w6/social-avatar-ca-AMqbkJ1bl7C87xWE.jpg",
      bio: "Full-stack developer responsible for creating stunning web experiences and applications."
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Meet Our Team
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            The talented individuals behind our exceptional work
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-500 hover-lift">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-seagram-green font-medium">{member.role}</p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;