import axios from "axios";
import type {
  ForecastPoint,
  ForecastSummary,
} from "../types/forecast";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

const forecastApi = {
  getSummary: (walletId: string) =>
    api.get<ForecastSummary>(
      `/forecast/${walletId}/summary`
    ),

  getHistory: (walletId: string) =>
    api.get<ForecastPoint[]>(
      `/forecast/${walletId}`
    ),
};

export default forecastApi;