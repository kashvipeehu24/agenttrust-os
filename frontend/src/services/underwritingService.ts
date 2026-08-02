import api from "./api";

export async function evaluateAgent(data: any) {
  const response = await api.post("/underwriting/evaluate", data);
  return response.data;
}