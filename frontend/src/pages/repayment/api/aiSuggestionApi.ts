import api from "../../../services/api";
import type { AxiosRequestConfig } from "axios";
import type {
  AISuggestion,
  AISuggestionSummary,
} from "../types/aiSuggestion";

const aiSuggestionApi = {
  getSummary: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<AISuggestionSummary>(
      `/ai-suggestions/${walletId}/summary`, config,
    ),

  getSuggestions: (walletId: string, config?: AxiosRequestConfig) =>
    api.get<AISuggestion[]>(
      `/ai-suggestions/${walletId}`, config,
    ),
};

export default aiSuggestionApi;
