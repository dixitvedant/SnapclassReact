import {
  Bot,
  Mic2,
  BarChart3,
  ShieldCheck
} from "lucide-react";

export default function FeatureBar() {

  return (

    <section
      className="
      max-w-6xl
      mx-auto
      grid
      md:grid-cols-4
      gap-5
      mt-14
      mb-16
      bg-white/70
      backdrop-blur-2xl
      rounded-[36px]
      shadow-xl
      p-8
      "
    >

      <Feature icon={<Bot />} title="AI Powered" />
      <Feature icon={<Mic2 />} title="Voice Verify" />
      <Feature icon={<BarChart3 />} title="Analytics" />
      <Feature icon={<ShieldCheck />} title="Secure" />

    </section>
  );
}

function Feature({
  icon,
  title
}) {

  return (

    <div className="flex items-center gap-4">

      <div
        className="
        p-4
        rounded-2xl
        bg-indigo-100
        text-indigo-600
        "
      >
        {icon}
      </div>

      <h3
        className="
        font-semibold
        text-slate-700
        "
      >
        {title}
      </h3>

    </div>
  );
}