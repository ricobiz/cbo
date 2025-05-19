
export type ContentType = "post" | "story" | "caption" | "thread" | "comment" | "bio";

export const CONTENT_TYPE_OPTIONS: { value: ContentType; label: string }[] = [
  { value: "post", label: "Пост" },
  { value: "story", label: "История" },
  { value: "caption", label: "Подпись к фото" },
  { value: "thread", label: "Тред" },
  { value: "comment", label: "Комментарий" },
  { value: "bio", label: "Биография профиля" },
];

export const TONE_OPTIONS = [
  { value: "professional", label: "Профессиональный" },
  { value: "friendly", label: "Дружелюбный" },
  { value: "casual", label: "Повседневный" },
  { value: "humorous", label: "Юмористический" },
  { value: "inspirational", label: "Вдохновляющий" },
  { value: "educational", label: "Образовательный" },
];
