export const Badge = ({
  children,
  variant = "neutral",
  size = "md",
  className = ""
}) => {
  const variantStyles = {
    primary: "bg-blue-50 text-blue-800 border-blue-200",
    secondary: "bg-indigo-50 text-indigo-800 border-indigo-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-red-50 text-red-800 border-red-200",
    info: "bg-sky-50 text-sky-800 border-sky-200",
    neutral: "bg-slate-100 text-slate-700 border-slate-200"
  };
  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs"
  };
  return <span
    className={`inline-flex items-center font-medium border rounded ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
  >
      {children}
    </span>;
};
export const DeptBadge = ({ dept }) => {
  const deptColors = {
    CSE: "bg-slate-900 text-white border-slate-900",
    EEE: "bg-blue-900 text-blue-50 border-blue-900",
    CE: "bg-amber-900 text-amber-50 border-amber-900",
  };
  return <span
    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase border ${deptColors[dept] || "bg-slate-800 text-white"}`}
  >
      {dept}
    </span>;
};
