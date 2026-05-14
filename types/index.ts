export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ActivityResult = {
  title: string;
  materials: string[];
  steps: string[];
  learningBenefit: string;
  safety: string;
};
