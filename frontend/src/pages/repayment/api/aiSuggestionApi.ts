import api from "../../../services/api";
import type {
  AISuggestion,
  AISuggestionSummary,
} from "../types/aiSuggestion";

const aiSuggestionApi = {
  getSummary: (walletId: string) =>
    api.get<AISuggestionSummary>(
      `/ai-suggestions/${walletId}/summary`
    ),

  getSuggestions: (walletId: string) =>
    api.get<AISuggestion[]>(
      `/ai-suggestions/${walletId}`
    ),
};

export default aiSuggestionApi;