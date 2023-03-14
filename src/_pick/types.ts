export interface Data {
  suggestions: Array<SuggestionType>
  picks: Array<PickType>
  inputSchema: any
}

export type PickType = {
  key: string
  title: string,
  expression: string
}

export type SuggestionType = {
  label: string;
  insertText: string;
  detail?: string;
  properties?: Array<SuggestionType>;
};
