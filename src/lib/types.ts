export type Role = "user" | "assistant";

export type MainView =
  | "home"
  | "chat"
  | "conversations"
  | "projects"
  | "project"
  | "code"
  | "artifacts"
  | "artifact";

export type SettingsPage =
  | "index"
  | "profile"
  | "billing"
  | "notifications"
  | "focus"
  | "privacy"
  | "shared"
  | "features"
  | "connectors"
  | "permissions"
  | "appearance"
  | "language"
  | "about";

export type ModelId = "sonnet-5-medium" | "sonnet-5-high" | "opus" | "haiku";

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
  temporary?: boolean;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: number;
}

export interface Artifact {
  id: string;
  title: string;
  kind: "code" | "doc" | "html";
  language?: string;
  content: string;
  conversationId?: string;
  createdAt: number;
}

export const MODELS: {
  id: ModelId;
  name: string;
  blurb: string;
}[] = [
  {
    id: "sonnet-5-medium",
    name: "Sonnet 5 Médio",
    blurb: "Equilíbrio entre rapidez e qualidade",
  },
  {
    id: "sonnet-5-high",
    name: "Sonnet 5 Alto",
    blurb: "Mais raciocínio para tarefas difíceis",
  },
  {
    id: "opus",
    name: "Opus 4.6",
    blurb: "O mais capaz para trabalho complexo",
  },
  {
    id: "haiku",
    name: "Haiku 4.5",
    blurb: "Respostas rápidas no dia a dia",
  },
];

export const USER = {
  firstName: "Muri",
  fullName: "Murilo Silva da Costa",
  email: "murilosilva.dacosta12@gmail.com",
  initials: "MS",
};
