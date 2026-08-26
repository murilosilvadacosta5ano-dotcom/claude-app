import { useEffect, useRef, useState } from "react";
import { Copy, MoreHorizontal, Pencil, Trash2, X } from "lucide-react";
import { ClaudeMark, GhostIcon } from "./claude-mark";
import { Composer } from "./composer";
import { Markdown } from "./markdown";
import { MenuButton } from "./sidebar";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ChatView() {
  const newChat = useApp((s) => s.newChat);
  const currentId = useApp((s) => s.currentId);
  const conversations = useApp((s) => s.conversations);
  const sending = useApp((s) => s.sending);
  const deleteConversation = useApp((s) => s.deleteConversation);
  const renameConversation = useApp((s) => s.renameConversation);
  const conv = conversations.find((c) => c.id === currentId);
  const scroller = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [conv?.messages.length, sending]);

  if (!conv) return null;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-warm">
      <header className="flex items-center gap-1 border-b border-hairline px-2 pb-1 pt-[max(8px,env(safe-area-inset-top))]">
        <MenuButton />
        <div className="min-w-0 flex-1 truncate px-2 text-center text-[15px] font-medium text-fg">
          {conv.title}
        </div>
        <button
          type="button"
          aria-label="Bate-papo temporário"
          onClick={() => newChat({ temporary: true })}
          className="press flex size-11 items-center justify-center text-fg"
        >
          <GhostIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Mais"
          onClick={() => setMenu(true)}
          className="press flex size-11 items-center justify-center text-fg"
        >
          <MoreHorizontal className="size-5" strokeWidth={1.8} />
        </button>
      </header>

      <div
        ref={scroller}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-6">
          {conv.messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {m.role === "assistant" ? (
                <div className="flex max-w-[92%] gap-3">
                  <ClaudeMark className="mt-1 size-5 shrink-0 text-accent" />
                  <div className="min-w-0 text-[16px] leading-7 text-fg">
                    <Markdown text={m.content} />
                  </div>
                </div>
              ) : (
                <div className="max-w-[85%] rounded-[22px] bg-muted px-4 py-2.5 text-[16px] leading-6 text-fg">
                  {m.content}
                </div>
              )}
            </div>
          ))}
          {sending ? (
            <div className="flex items-center gap-3">
              <ClaudeMark className="think-mark size-5 text-accent" />
              <span className="text-[15px] text-fg-muted">Pensando…</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl pb-[max(6px,env(safe-area-inset-bottom))]">
        <Composer />
      </div>

      {menu ? (
        <div className="fixed inset-0 z-[90] flex items-end justify-center md:items-center">
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-fg/25"
            onClick={() => setMenu(false)}
          />
          <div className="sheet-in relative z-10 mb-3 w-[min(380px,calc(100%-24px))] overflow-hidden rounded-3xl bg-surface p-2 shadow-[var(--shadow-sheet)]">
            {renaming ? (
              <form
                className="flex flex-col gap-2 p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  renameConversation(conv.id, titleDraft);
                  setRenaming(false);
                  setMenu(false);
                }}
              >
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="h-11 rounded-2xl bg-muted px-3 text-[15px] outline-none"
                />
                <button
                  type="submit"
                  className="h-11 rounded-pill bg-ink text-[15px] font-medium text-surface"
                >
                  Salvar
                </button>
              </form>
            ) : (
              <>
                <button
                  type="button"
                  className="flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-[16px] hover:bg-muted"
                  onClick={() => {
                    setTitleDraft(conv.title);
                    setRenaming(true);
                  }}
                >
                  <Pencil className="size-4" />
                  Renomear
                </button>
                <button
                  type="button"
                  className="flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-[16px] hover:bg-muted"
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      conv.messages.map((m) => m.content).join("\n\n"),
                    );
                    setMenu(false);
                  }}
                >
                  <Copy className="size-4" />
                  Copiar conversa
                </button>
                <button
                  type="button"
                  className="flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-[16px] text-red-600 hover:bg-muted"
                  onClick={() => {
                    deleteConversation(conv.id);
                    setMenu(false);
                  }}
                >
                  <Trash2 className="size-4" />
                  Excluir
                </button>
                <button
                  type="button"
                  className="flex h-12 w-full items-center gap-3 rounded-2xl px-3 text-[16px] hover:bg-muted"
                  onClick={() => setMenu(false)}
                >
                  <X className="size-4" />
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
