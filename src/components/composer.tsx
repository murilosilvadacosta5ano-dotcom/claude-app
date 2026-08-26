import { useRef } from "react";
import { Mic, Plus, ArrowUp } from "lucide-react";
import { useApp } from "@/lib/store";
import { MODELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { askClaude } from "@/lib/ask";
import { WaveformIcon } from "./claude-mark";

export function Composer({
  showUpsell,
  compact,
}: {
  showUpsell?: boolean;
  compact?: boolean;
}) {
  const draft = useApp((s) => s.draft);
  const setDraft = useApp((s) => s.setDraft);
  const model = useApp((s) => s.model);
  const sending = useApp((s) => s.sending);
  const setModelPicker = useApp((s) => s.setModelPicker);
  const setUpgrade = useApp((s) => s.setUpgrade);
  const setAttach = useApp((s) => s.setAttach);
  const setVoice = useApp((s) => s.setVoice);
  const onSend = useSend();
  const ref = useRef<HTMLTextAreaElement>(null);
  const modelName = MODELS.find((m) => m.id === model)?.name ?? "Sonnet 5 Médio";
  const hasText = draft.trim().length > 0;

  function resize() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  return (
    <div className={cn("px-3.5 pb-3 pt-1", compact && "px-3.5 pb-3")}>
      <div
        className="rounded-card bg-surface px-3.5 pb-3 pt-3.5"
        style={{ boxShadow: "var(--shadow-composer)" }}
      >
        {showUpsell ? (
          <div className="mb-3.5 rounded-[18px] bg-muted px-4 pb-3 pt-3.5">
            <p className="mb-2.5 text-center text-[15px] text-fg-muted">
              Tenha mais com o Claude Pro
            </p>
            <button
              type="button"
              onClick={() => setUpgrade(true)}
              className="press flex h-11 w-full items-center justify-center rounded-pill bg-surface text-[16px] font-medium text-fg"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              Fazer upgrade
            </button>
          </div>
        ) : null}

        <textarea
          ref={ref}
          rows={1}
          value={draft}
          disabled={sending}
          placeholder="Chat com Claude"
          onChange={(e) => {
            setDraft(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (hasText && !sending) onSend();
            }
          }}
          className="mb-2.5 max-h-40 w-full resize-none bg-transparent px-1.5 py-1 text-[17px] leading-snug text-fg outline-none placeholder:text-fg-subtle disabled:opacity-60"
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Anexar"
            onClick={() => setAttach(true)}
            className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-fg"
          >
            <Plus className="size-[18px]" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => setModelPicker(true)}
            className="press flex h-10 max-w-[58%] items-center rounded-full bg-muted px-3.5 text-[14px] font-medium text-fg"
          >
            <span className="truncate">{modelName}</span>
          </button>
          <div className="flex-1" />
          <button
            type="button"
            aria-label="Voz"
            onClick={() => {
              const w = window as unknown as {
                SpeechRecognition?: new () => Rec;
                webkitSpeechRecognition?: new () => Rec;
              };
              const Speech = w.SpeechRecognition || w.webkitSpeechRecognition;
              if (!Speech) {
                setVoice(true);
                return;
              }
              const rec = new Speech();
              rec.lang = "pt-BR";
              rec.interimResults = false;
              rec.onresult = (ev) => {
                const t = ev.results[0]?.[0]?.transcript ?? "";
                if (t) setDraft(t);
              };
              rec.start();
            }}
            className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-fg"
          >
            <Mic className="size-[18px]" strokeWidth={1.8} />
          </button>
          {hasText ? (
            <button
              type="button"
              aria-label="Enviar"
              disabled={sending}
              onClick={onSend}
              className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-surface disabled:opacity-40"
            >
              <ArrowUp className="size-[18px]" strokeWidth={2.4} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Modo de voz"
              onClick={() => setVoice(true)}
              className="press flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-surface"
            >
              <WaveformIcon className="size-[18px]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function useSend() {
  const addUserMessage = useApp((s) => s.addUserMessage);
  const finishAssistant = useApp((s) => s.finishAssistant);
  const failAssistant = useApp((s) => s.failAssistant);
  const addArtifact = useApp((s) => s.addArtifact);
  const draft = useApp((s) => s.draft);
  const sending = useApp((s) => s.sending);
  const model = useApp((s) => s.model);
  const prefs = useApp((s) => s.prefs);

  return async function send() {
    const text = draft.trim();
    if (!text || sending) return;
    const { convId, messages } = addUserMessage(text);
    try {
      const res = await askClaude({ data: { messages, model } });
      if (res.ok) {
        finishAssistant(convId, res.text);
        if (prefs.features.artifacts) {
          const blocks = [...res.text.matchAll(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g)];
          for (const b of blocks) {
            const body = b[2].trim();
            if (body.split("\n").length < 6) continue;
            const lang = b[1] || "text";
            const kind = lang === "html" ? "html" : "code";
            const first = body.split("\n").find((l) => l.trim()) ?? "Artefato";
            addArtifact({
              title: first.replace(/^[#/\s*]+/, "").slice(0, 48) || "Artefato",
              kind,
              language: lang,
              content: body,
              conversationId: convId,
            });
          }
        }
      } else {
        failAssistant(convId);
      }
    } catch {
      failAssistant(convId);
    }
  };
}

type Rec = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((ev: { results: { 0?: { 0?: { transcript?: string } } } }) => void) | null;
};
