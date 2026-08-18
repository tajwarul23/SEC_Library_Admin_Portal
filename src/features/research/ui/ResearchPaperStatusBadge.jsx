import { Badge } from "../../../components/common/Badge";

const STATUS_CONFIG = {
  pending: { variant: "warning", label: "Pending" },
  approved: { variant: "success", label: "Approved" },
  rejected: { variant: "danger", label: "Rejected" },
};

export const ResearchPaperStatusBadge = ({ status, size = "sm" }) => {
  const config = STATUS_CONFIG[status] || { variant: "neutral", label: status || "Unknown" };
  return (
    <Badge variant={config.variant} size={size}>
      {config.label}
    </Badge>
  );
};
