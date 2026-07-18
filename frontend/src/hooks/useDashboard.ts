import { getDashboardInfo } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashBoard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardInfo,
  });
};
