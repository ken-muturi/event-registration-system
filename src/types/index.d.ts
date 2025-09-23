export type DataObject<T> = {
  id: string;
  type: string;
  body: T;
};

export type Text = {
  language: "en" | "es" | "fr" | "ar" | "ny";
  text: string;
};

export type TranslationText = Text

export type PartialTranslation = Pick<DataObject<Text>, 'body'>;

export type LoanStatus = {
  id: number
  label: string
  abbrev: string
}