import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import EventGrid from "@/components/home/EventGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <div className="bg-white">
        <EventGrid />
      </div>
      
      {/* Newsletter Section - Matching Eventry Minimalist Style */}
      <section className="bg-secondary py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Stay in the <span className="text-primary italic font-serif">Loop</span>
          </h2>
          <p className="text-muted mb-10 text-lg">
            Subscribe to our newsletter to get the latest event updates and exclusive offers delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full sm:w-96 h-14 px-8 rounded-full border border-accent bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
            <button className="bg-foreground text-white h-14 px-10 rounded-full font-bold hover:bg-foreground/90 transition-all whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
      
    </div>
  );
}
