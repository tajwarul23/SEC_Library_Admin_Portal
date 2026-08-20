import { useQuery } from "@tanstack/react-query";
import { getAllPaymentsApi } from "../Services/Payment.api.js";

export function useGetPayments(filters = {}) {
  return useQuery({
    queryKey: ["payments", filters],
    queryFn: () => getAllPaymentsApi(filters),
    select: (response) => ({ payments: response.data, pagination: response.pagination }),
    placeholderData: (previousData) => previousData,
  });
}
