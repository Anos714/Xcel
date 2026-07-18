import { api } from "@/lib/axios";

export const getDashboardInfo = async () => {
  const response = await api.get("/dashboard/");
  return response.data.data;
};
