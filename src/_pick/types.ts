export interface Data {
  expression: string;
  suggestions: Array<SuggestionType>
}
export type SuggestionType = {
  label: string;
  insertText: string;
  detail?: string;
  properties?: Array<SuggestionType>;
};
