import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      content: "I had such a wonderful time working with Fives when it came to making my graphics, at no point did I feel rushed or hurried into giving design ideas and he even gave some of his own input allowing for a high quality design in the long run! I am super happy with how my logo's came out as well as the price for what I received them at! If your looking for fantastic graphics and having seen the entire teams portfolio I can happily tell you all that these individuals here who create Graphics are arguably the best at what they do here!",
      author: "Tronus",
      role: "Client",
      rating: 5,
      avatar: "https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=48,h=48,fit=crop/YNqO7k0WyEUyB3w6/dg_avi-m5Kw9r0g6WUEeL1E.jpg",
      highlights: [
        "Efficient Communication: Capable of getting what you want done to the finest point!",
        "Design Quality is perfect and what you'd be looking for!",
        "Great at giving feedback compared to individuals I have worked with before",
        "Reasonable prices for the amount you get! Bang for your buck!"
      ]
    },
    {
      content: "The interactive design captivated our audience, making it easy for them to navigate and explore.",
      author: "Jordan Lee",
      role: "Project Manager",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1536336076412-fd2a4de236f0?ixid=M3wzOTE5Mjl8MHwxfHNlYXJjaHwyMnx8bGFuZGluZyUyMHBhZ2V8ZW58MHx8fHwxNzMyOTQ1MzQ2fDA&ixlib=rb-4.0.3&auto=format&fit=crop&w=48&h=48"
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Don't just take our word for it - hear from clients who've experienced our exceptional service
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-xl transition-all duration-500 hover-lift">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <Quote className="w-8 h-8 text-seagram-green mr-2" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>

                {testimonial.highlights && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-seagram-green">
                      10/10 service.
                    </h3>
                    <ul className="space-y-2">
                      {testimonial.highlights.map((highlight, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-seagram-green mr-2">•</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <blockquote className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>

                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.author}
                    </div>
                    {testimonial.role && (
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="text-4xl font-bold text-seagram-green mb-2">Thank you!</div>
          <p className="text-muted-foreground">
            We appreciate the trust our clients place in us and strive to exceed expectations every time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;