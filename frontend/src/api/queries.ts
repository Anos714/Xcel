import { api } from "@/lib/axios";

export interface QueryItem {
  id: string;
  query: string;
  active: boolean;
  createdAt?: string;
}

export const getQueries = async () => (await api.get<{ data: QueryItem[] }>("/queries")).data.data;
export const createQuery = async (query: string) => (await api.post<{ data: QueryItem }>("/queries", { query })).data.data;
export const updateQuery = async (id: string, active: boolean) => (await api.patch<{ data: QueryItem }>(`/queries/${id}`, { active })).data.data;
export const deleteQuery = async (id: string) => api.delete(`/queries/${id}`);
