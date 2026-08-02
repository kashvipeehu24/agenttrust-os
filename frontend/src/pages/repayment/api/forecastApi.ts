import api from "../../../services/api";
import type {
  ForecastPoint,
  ForecastSummary,
} from "../types/forecast";

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