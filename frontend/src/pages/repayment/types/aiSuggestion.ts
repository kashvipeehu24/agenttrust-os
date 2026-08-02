export type SuggestionPriority = "low" | "medium" | "high";

export interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: SuggestionPriority;
}

export interface AISuggestionSummary {
  totalSuggestions: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
}