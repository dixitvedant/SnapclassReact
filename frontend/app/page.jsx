import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PortalCards from "@/components/PortalCards";
import FeatureBar from "@/components/FeatureBar";
import FloatingAI from "@/components/FloatingAI";

export default function Home() {

  return (

    <main
      className="
      relative
      min-h-screen
      overflow-hidden
      bg-gradient-to-br
      from-[#eef4ff]
      via-[#f6f7ff]
      to-[#edf1ff]
      "
    >

      <div
        className="
        absolute
        -top-32
        -left-24
        w-[450px]
        h-[450px]
        bg-blue-300/30
        blur-[120px]
        rounded-full
        "
      />

      <div
        className="
        absolute
        top-40
        -right-20
        w-[400px]
        h-[400px]
        bg-violet-300/30
        blur-[120px]
        rounded-full
        "
      />

      <div
        className="
        absolute
        inset-0
        opacity-15
        bg-cover
        bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1800')"
        }}
      />

      <Navbar />
      <Hero />
      <PortalCards />
      <FeatureBar />
      <FloatingAI />

    </main>
  );
}