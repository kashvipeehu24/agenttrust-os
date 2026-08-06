import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  ForecastPoint,
  ForecastSummary,
} from "../types/forecast";

const forecastApi = {
  getSummary: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<ForecastSummary>(
      `/forecast/${walletId}/summary`, config,
    ),

  getHistory: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<ForecastPoint[]>(
      `/forecast/${walletId}`, config,
    ),
};

export default forecastApi;
