export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badgeText,
  badgeType = "neutral",
  variant = "neutral",
  onClick
}) => {
  const variantStyles = {
    blue: "bg-[#EFF6FF] border-blue-100 text-blue-950",
    green: "bg-[#F0FDF4] border-green-100 text-green-950",
    amber: "bg-[#FFFBEB] border-amber-100 text-amber-950",
    red: "bg-[#FEF2F2] border-red-100 text-red-950",
    neutral: "bg-white border-slate-200 text-slate-900"
  };
  const titleStyles = {
    blue: "text-blue-600",
    green: "text-green-600",
    amber: "text-amber-600",
    red: "text-red-600",
    neutral: "text-slate-500"
  };
  const iconBgStyles = {
    blue: "bg-blue-100/80 text-blue-700",
    green: "bg-green-100/80 text-green-700",
    amber: "bg-amber-100/80 text-amber-700",
    red: "bg-red-100/80 text-red-700",
    neutral: "bg-slate-100 text-slate-600"
  };
  const badgeStyles = {
    success: "bg-emerald-100 text-emerald-800 border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border-amber-200",
    danger: "bg-red-100 text-red-800 border-red-200",
    info: "bg-sky-100 text-sky-800 border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200"
  };
  return <div
    onClick={onClick}
    className={`border rounded-lg p-4 shadow-xs transition-all ${variantStyles[variant]} ${onClick ? "cursor-pointer hover:shadow-sm hover:border-slate-300" : ""}`}
  >
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${titleStyles[variant]}`}>
          {title}
        </span>
        <div className={`p-1.5 rounded ${iconBgStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2.5 flex flewr items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight font-sans">
          {value}
        </span>
        {badgeText && <span
    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeStyles[badgeType]}`}
  >
            {badgeText}
          </span>}
      </div>

      {subtitle && <p className="text-xs text-wrap opacity-75 mt-1 truncate">{subtitle}</p>}
    </div>;
};
