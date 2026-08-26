import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu } from "lucide-react";
import { BubbleIcon, CodeGlyph, PuzzleIcon, TrayIcon } from "./claude-mark";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "conversations" as const, label: "Conversas", Icon: BubbleIcon },
  { id: "projects" as const, label: "Projetos", Icon: TrayIcon },
  { id: "code" as const, label: "Código", Icon: CodeGlyph },
  { id: "artifacts" as const, label: "Artefatos", Icon: PuzzleIcon },
];

export function MenuButton() {
  const setSidebar = useApp((s) => s.setSidebar);
  const open = useApp((s) => s.sidebarOpen);
  return (
    <button
      type="button"
      aria-label="Menu"
      aria-expanded={open}
      onClick={(e) => {
        e.stopPropagation();
        setSidebar(true);
      }}
      className="press relative z-20 flex size-11 items-center justify-center text-fg"
    >
      <Menu className="size-6" strokeWidth={1.7} />
    </button>
  );
}

export function Sidebar() {
  const open = useApp((s) => s.sidebarOpen);
  const setSidebar = useApp((s) => s.setSidebar);
  const setView = useApp((s) => s.setView);
  const view = useApp((s) => s.view);
  const newChat = useApp((s) => s.newChat);
  const openSettings = useApp((s) => s.openSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const node = (
    <>
      <button
        type="button"
        aria-label="Fechar barra"
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setSidebar(false)}
        className={cn(
          "fixed inset-0 z-[60] bg-black/25 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 left-0 z-[70] flex w-[min(320px,86vw)] max-w-[320px] flex-col bg-[#f7f6f3] pt-[max(10px,env(safe-area-inset-top))] shadow-[12px_0_40px_rgba(26,25,22,0.12)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] dark:bg-[#1c1b18]",
          open ? "translate-x-0" : "pointer-events-none -translate-x-full",
        )}
      >
        <div className="px-7 pb-8 pt-5">
          <h1 className="font-display text-[36px] font-medium leading-none tracking-[-0.03em] text-fg">
            Claude
          </h1>
        </div>

        <nav className="flex flex-1 flex-col gap-2.5 px-3">
          {NAV.map(({ id, label, Icon }) => {
            const active =
              view === id ||
              (id === "projects" && view === "project") ||
              (id === "artifacts" && view === "artifact");
            return (
              <button
                key={id}
                type="button"
                onClick={() => setView(id)}
                className={cn(
                  "press flex h-12 items-center gap-4 rounded-2xl px-4 text-[17px] text-fg",
                  active ? "bg-muted" : "hover:bg-muted/70",
                )}
              >
                <Icon className="size-[22px] shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
          <button
            type="button"
            onClick={openSettings}
            aria-label="Configurações"
            className="press flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-medium tracking-wide text-fg"
          >
            {USER.initials}
          </button>
          <button
            type="button"
            onClick={() => newChat()}
            className="press flex h-11 flex-1 items-center justify-center gap-1 rounded-pill bg-ink text-[15px] font-medium text-surface"
          >
            <span className="text-[18px] leading-none">+</span>
            Novo bate-papo
          </button>
        </div>
      </aside>
    </>
  );

  if (!mounted) return null;
  return createPortal(node, document.body);
}
