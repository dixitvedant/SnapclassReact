export default function MetricCard({ title, value }) {
  return (
    <div
      className="
      bg-white
      rounded-[32px]
      shadow-lg
      p-7
      text-slate-900
    "
    >
      <p className="text-slate-600">
        {title}
      </p>

      <h3
        className="
        text-4xl
        font-black
        text-slate-900
        mt-3
      "
      >
        {value}
      </h3>
    </div>
  );
}