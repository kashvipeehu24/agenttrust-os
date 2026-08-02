type ComingSoonCardProps = {
  title: string;
  description?: string;
};

export default function ComingSoonCard({
  title,
  description = "This feature is currently under development.",
}: ComingSoonCardProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="text-xl font-semibold text-slate-900">
        {title}
      </h3>

      <p className="mt-3 text-sm text-slate-600">
        {description}
      </p>

      <div className="mt-6 inline-flex rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
        Coming Soon
      </div>
    </div>
  );
}