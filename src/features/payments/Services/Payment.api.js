import { apiClient } from "../../../services/apiClient.js";

// Backend: GET /api/admin/access/payments?regNo=&status=&offset=&limit=
export async function getAllPaymentsApi({ regNo, status, offset = 0, limit = 10 } = {}) {
  const params = { offset, limit };
  if (regNo) params.regNo = regNo;
  if (status) params.status = status;

  const response = await apiClient.get("/admin/access/payments", { params });
  return {
    data: response.transactions,
    pagination: {
      total: response.totalCount,
      offset: response.offset,
      limit: response.limit,
    },
  };
}
