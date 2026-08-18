import { useQuery } from "@tanstack/react-query";
import { getReservationsApi } from "../Services/Reservation.api.js";

export function useGetReservations(filters = {}) {
  return useQuery({
    queryKey: ["reservations", filters],
    queryFn: () => getReservationsApi(filters),
    select: response => ({ reservations: response.data, pagination: response.pagination }),
    placeholderData: previousData => previousData
  });
}
