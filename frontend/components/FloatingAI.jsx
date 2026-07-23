import { Rocket } from "lucide-react";

export default function FloatingAI() {

  return (

    <button
      className="
      fixed
      bottom-8
      right-8
      z-50
      w-20
      h-20
      rounded-full
      text-white
      bg-gradient-to-br
      from-blue-600
      to-violet-600
      shadow-2xl
      hover:scale-110
      transition
      flex
      items-center
      justify-center
      "
    >
      <Rocket size={34} />
    </button>
  );
}