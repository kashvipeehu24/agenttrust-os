import axios from "axios";
import type {
  AISuggestion,
  AISuggestionSummary,
} from "../types/aiSuggestion";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

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