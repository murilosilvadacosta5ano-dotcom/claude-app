import { useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { BubbleIcon, CodeGlyph, PuzzleIcon, TrayIcon } from "./claude-mark";
import { Markdown } from "./markdown";
import { MenuButton } from "./sidebar";
import { useApp } from "@/lib/store";
import { formatRelative } from "@/lib/utils";

function Screen({
  title,
  children,
  onBack,
  action,
}: {
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-warm">
      <header className="flex items-center gap-1 border-b border-hairline px-2 pb-2 pt-[max(8px,env(safe-area-inset-top))]">
        {onBack ? (
          <button
            type="button"
            aria-label="Voltar"
            onClick={onBack}
            className="press flex size-11 items-center justify-center"
          >
            <ChevronLeft className="size-6" strokeWidth={1.7} />
          </button>
        ) : (
          <MenuButton />
        )}
        <h1 className="flex-1 truncate px-1 font-display text-[26px] font-medium tracking-tight">
          {title}
        </h1>
        {action}
      </header>
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        {children}
      </div>
    </div>
  );
}

function Empty({
  icon,
  title,
  hint,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center px-6 pt-24 text-center">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-muted text-fg-muted">
        {icon}
      </div>
      <p className="text-[17px] font-medium text-fg">{title}</p>
      <p className="mt-1 max-w-xs text-[14px] leading-5 text-fg-muted">{hint}</p>
    </div>
  );
}

export function ConversationsView() {
  const conversations = useApp((s) => s.conversations);
  const openConversation = useApp((s) => s.openConversation);
  const deleteConversation = useApp((s) => s.deleteConversation);
  const list = conversations.filter((c) => !c.temporary);

  return (
    <Screen title="Conversas">
      {list.length === 0 ? (
        <Empty
          icon={<BubbleIcon className="size-6" />}
          title="Nenhuma conversa ainda"
          hint="Toque em Novo bate-papo no menu para começar."
        />
      ) : (
        <ul className="mt-2 divide-y divide-hairline overflow-hidden rounded-group bg-muted/60">
          {list.map((c) => (
            <li key={c.id} className="flex items-stretch">
              <button
                type="button"
                onClick={() => openConversation(c.id)}
                className="flex min-w-0 flex-1 flex-col items-start px-4 py-3.5 text-left"
              >
                <span className="w-full truncate text-[16px] font-medium text-fg">
                  {c.title}
                </span>
                <span className="mt-0.5 text-[13px] text-fg-muted">
                  {formatRelative(c.updatedAt)}
                  {c.messages.length
                    ? ` · ${c.messages.length} mensagens`
                    : ""}
                </span>
              </button>
              <button
                type="button"
                aria-label="Excluir conversa"
                onClick={() => deleteConversation(c.id)}
                className="press px-3 text-fg-muted hover:text-red-600"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ProjectsView() {
  const projects = useApp((s) => s.projects);
  const addProject = useApp((s) => s.addProject);
  const openProject = useApp((s) => s.openProject);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Screen
      title="Projetos"
      action={
        <button
          type="button"
          aria-label="Novo projeto"
          onClick={() => setCreating(true)}
          className="press flex size-11 items-center justify-center"
        >
          <Plus className="size-5" strokeWidth={1.8} />
        </button>
      }
    >
      {creating ? (
        <form
          className="mt-3 rounded-group bg-muted/60 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const n = name.trim();
            if (!n) return;
            addProject(n, description.trim());
            setName("");
            setDescription("");
            setCreating(false);
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do projeto"
            className="mb-2 h-11 w-full rounded-2xl bg-surface px-3 text-[15px] outline-none"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (opcional)"
            rows={3}
            className="mb-3 w-full resize-none rounded-2xl bg-surface px-3 py-2.5 text-[15px] outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="h-11 flex-1 rounded-pill bg-surface text-[15px] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-pill bg-ink text-[15px] font-medium text-surface"
            >
              Criar
            </button>
          </div>
        </form>
      ) : null}

      {projects.length === 0 && !creating ? (
        <Empty
          icon={<TrayIcon className="size-6" />}
          title="Nenhum projeto"
          hint="Agrupe conversas e arquivos em um projeto. Toque em + para criar."
        />
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {projects.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => openProject(p.id)}
                className="press flex w-full flex-col items-start rounded-group bg-muted/60 px-4 py-3.5 text-left"
              >
                <span className="text-[16px] font-medium text-fg">{p.name}</span>
                {p.description ? (
                  <span className="mt-0.5 line-clamp-2 text-[13px] text-fg-muted">
                    {p.description}
                  </span>
                ) : (
                  <span className="mt-0.5 text-[13px] text-fg-muted">
                    {formatRelative(p.createdAt)}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ProjectDetail() {
  const id = useApp((s) => s.currentProjectId);
  const projects = useApp((s) => s.projects);
  const conversations = useApp((s) => s.conversations);
  const setView = useApp((s) => s.setView);
  const newChat = useApp((s) => s.newChat);
  const openConversation = useApp((s) => s.openConversation);
  const deleteProject = useApp((s) => s.deleteProject);
  const project = projects.find((p) => p.id === id);
  const convs = conversations.filter((c) => c.projectId === id);

  if (!project) {
    return (
      <Screen title="Projeto" onBack={() => setView("projects")}>
        <p className="pt-10 text-center text-fg-muted">Projeto não encontrado.</p>
      </Screen>
    );
  }

  return (
    <Screen
      title={project.name}
      onBack={() => setView("projects")}
      action={
        <button
          type="button"
          aria-label="Excluir projeto"
          onClick={() => deleteProject(project.id)}
          className="press flex size-11 items-center justify-center text-fg-muted"
        >
          <Trash2 className="size-4" />
        </button>
      }
    >
      {project.description ? (
        <p className="mt-3 text-[15px] leading-6 text-fg-muted">
          {project.description}
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => newChat({ projectId: project.id })}
        className="press mt-4 flex h-11 w-full items-center justify-center gap-1 rounded-pill bg-ink text-[15px] font-medium text-surface"
      >
        <Plus className="size-4" />
        Novo bate-papo neste projeto
      </button>
      <h2 className="mb-2 mt-8 text-[13px] font-medium uppercase tracking-wide text-fg-muted">
        Conversas
      </h2>
      {convs.length === 0 ? (
        <p className="text-[14px] text-fg-muted">Nenhuma conversa neste projeto.</p>
      ) : (
        <ul className="divide-y divide-hairline overflow-hidden rounded-group bg-muted/60">
          {convs.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => openConversation(c.id)}
                className="flex w-full flex-col items-start px-4 py-3.5 text-left"
              >
                <span className="text-[16px] font-medium">{c.title}</span>
                <span className="text-[13px] text-fg-muted">
                  {formatRelative(c.updatedAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function CodeView() {
  const artifacts = useApp((s) => s.artifacts);
  const openArtifact = useApp((s) => s.openArtifact);
  const addArtifact = useApp((s) => s.addArtifact);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [content, setContent] = useState("");
  const code = artifacts.filter((a) => a.kind === "code" || a.kind === "html");

  return (
    <Screen
      title="Código"
      action={
        <button
          type="button"
          aria-label="Novo trecho"
          onClick={() => setCreating(true)}
          className="press flex size-11 items-center justify-center"
        >
          <Plus className="size-5" />
        </button>
      }
    >
      {creating ? (
        <form
          className="mt-3 rounded-group bg-muted/60 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            const body = content.trim();
            if (!body) return;
            addArtifact({
              title: title.trim() || "Trecho",
              kind: language === "html" ? "html" : "code",
              language,
              content: body,
            });
            setTitle("");
            setContent("");
            setCreating(false);
          }}
        >
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
            className="mb-2 h-11 w-full rounded-2xl bg-surface px-3 text-[15px] outline-none"
          />
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Linguagem"
            className="mb-2 h-11 w-full rounded-2xl bg-surface px-3 text-[15px] outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cole o código…"
            rows={8}
            className="mb-3 w-full resize-none rounded-2xl bg-surface px-3 py-2.5 font-mono text-[13px] outline-none"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="h-11 flex-1 rounded-pill bg-surface text-[15px] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="h-11 flex-1 rounded-pill bg-ink text-[15px] font-medium text-surface"
            >
              Salvar
            </button>
          </div>
        </form>
      ) : null}

      {code.length === 0 && !creating ? (
        <Empty
          icon={<CodeGlyph className="size-6" />}
          title="Nenhum código ainda"
          hint="Peça um trecho no chat ou toque em + para colar código."
        />
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {code.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => openArtifact(a.id)}
                className="press flex w-full flex-col items-start rounded-group bg-muted/60 px-4 py-3.5 text-left"
              >
                <span className="text-[16px] font-medium">{a.title}</span>
                <span className="mt-0.5 text-[13px] text-fg-muted">
                  {a.language || a.kind} · {formatRelative(a.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ArtifactsView() {
  const artifacts = useApp((s) => s.artifacts);
  const openArtifact = useApp((s) => s.openArtifact);

  return (
    <Screen title="Artefatos">
      {artifacts.length === 0 ? (
        <Empty
          icon={<PuzzleIcon className="size-6" />}
          title="Nenhum artefato"
          hint="Quando o Claude gerar código longo, ele aparece aqui."
        />
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {artifacts.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => openArtifact(a.id)}
                className="press flex w-full flex-col items-start rounded-group bg-muted/60 px-4 py-3.5 text-left"
              >
                <span className="text-[16px] font-medium">{a.title}</span>
                <span className="mt-0.5 text-[13px] text-fg-muted">
                  {a.kind === "html"
                    ? "HTML"
                    : a.kind === "doc"
                      ? "Documento"
                      : a.language || "Código"}{" "}
                  · {formatRelative(a.createdAt)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}

export function ArtifactDetail() {
  const id = useApp((s) => s.currentArtifactId);
  const artifacts = useApp((s) => s.artifacts);
  const setView = useApp((s) => s.setView);
  const deleteArtifact = useApp((s) => s.deleteArtifact);
  const art = artifacts.find((a) => a.id === id);

  if (!art) {
    return (
      <Screen title="Artefato" onBack={() => setView("artifacts")}>
        <p className="pt-10 text-center text-fg-muted">Artefato não encontrado.</p>
      </Screen>
    );
  }

  return (
    <Screen
      title={art.title}
      onBack={() => setView("artifacts")}
      action={
        <button
          type="button"
          aria-label="Excluir artefato"
          onClick={() => deleteArtifact(art.id)}
          className="press flex size-11 items-center justify-center text-fg-muted"
        >
          <Trash2 className="size-4" />
        </button>
      }
    >
      <p className="mb-3 mt-2 text-[13px] text-fg-muted">
        {art.language || art.kind} · {formatRelative(art.createdAt)}
      </p>
      {art.kind === "doc" ? (
        <div className="rounded-group bg-muted/60 p-4 text-[15px] leading-6">
          <Markdown text={art.content} />
        </div>
      ) : (
        <pre className="overflow-x-auto rounded-group bg-[#1a1916] p-4 text-[12.5px] leading-5 text-[#f3f1ec]">
          <code>{art.content}</code>
        </pre>
      )}
    </Screen>
  );
}
