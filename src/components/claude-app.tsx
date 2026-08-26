import { useEffect } from "react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { HomeView } from "./home-view";
import { ChatView } from "./chat-view";
import { SettingsSheet } from "./settings";
import {
  ArtifactDetail,
  ArtifactsView,
  CodeView,
  ConversationsView,
  ProjectDetail,
  ProjectsView,
} from "./views";
import {
  AttachSheet,
  InfoSheet,
  ModelPicker,
  UpgradeSheet,
  VoiceSheet,
} from "./sheets";

export function ClaudeApp() {
  const view = useApp((s) => s.view);
  const sidebarOpen = useApp((s) => s.sidebarOpen);
  const appearance = useApp((s) => s.prefs.appearance);
  const setHydrated = useApp((s) => s.setHydrated);
  const setSidebar = useApp((s) => s.setSidebar);

  useEffect(() => {
    void Promise.resolve(useApp.persist.rehydrate()).then(() => {
      const s = useApp.getState();
      const conv = s.conversations.find((c) => c.id === s.currentId);
      if (conv && conv.messages.length > 0) {
        useApp.setState({ view: "chat", hydrated: true });
      } else {
        setHydrated();
      }
    });
  }, [setHydrated]);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (a: string) => {
      const dark =
        a === "dark" ||
        (a === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", dark);
    };
    apply(appearance);
    if (appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => apply("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [appearance]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebar(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen, setSidebar]);

  return (
    <div className="relative flex h-dvh overflow-hidden bg-bg">
      <Sidebar />
      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-1 flex-col bg-bg-warm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          sidebarOpen && "translate-x-[min(320px,86vw)]",
        )}
      >
        <main className="min-h-0 min-w-0 flex-1">
          {view === "home" ? <HomeView /> : null}
          {view === "chat" ? <ChatView /> : null}
          {view === "conversations" ? <ConversationsView /> : null}
          {view === "projects" ? <ProjectsView /> : null}
          {view === "project" ? <ProjectDetail /> : null}
          {view === "code" ? <CodeView /> : null}
          {view === "artifacts" ? <ArtifactsView /> : null}
          {view === "artifact" ? <ArtifactDetail /> : null}
        </main>
      </div>
      <SettingsSheet />
      <ModelPicker />
      <UpgradeSheet />
      <AttachSheet />
      <VoiceSheet />
      <InfoSheet />
    </div>
  );
}
