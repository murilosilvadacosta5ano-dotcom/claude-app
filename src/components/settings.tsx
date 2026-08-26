import type { ReactNode } from "react";
import {
  Bell,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CircleUser,
  Languages,
  LayoutGrid,
  Link as LinkIcon,
  LogOut,
  MoonStar,
  Palette,
  Shield,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import type { Prefs } from "@/lib/store";
import type { SettingsPage } from "@/lib/types";
import { USER } from "@/lib/types";
import { cn } from "@/lib/utils";

const ACCOUNT = [
  { id: "profile" as const, label: "Perfil", Icon: CircleUser },
  { id: "billing" as const, label: "Cobrança", Icon: CircleDollarSign },
  { id: "notifications" as const, label: "Notificações", Icon: Bell },
  { id: "focus" as const, label: "Tempo e foco", Icon: MoonStar },
  { id: "privacy" as const, label: "Privacidade", Icon: Shield },
  { id: "shared" as const, label: "Links compartilhados", Icon: LinkIcon },
];

const APP = [
  { id: "features" as const, label: "Recursos", Icon: SlidersHorizontal },
  { id: "connectors" as const, label: "Connectors", Icon: LayoutGrid },
  { id: "permissions" as const, label: "Permissões", Icon: Users },
  { id: "appearance" as const, label: "Aparência", Icon: Palette },
  { id: "language" as const, label: "Idioma", Icon: Languages },
];

const TITLES: Record<SettingsPage, string> = {
  index: "Configurações",
  profile: "Perfil",
  billing: "Cobrança",
  notifications: "Notificações",
  focus: "Tempo e foco",
  privacy: "Privacidade",
  shared: "Links compartilhados",
  features: "Recursos",
  connectors: "Connectors",
  permissions: "Permissões",
  appearance: "Aparência",
  language: "Idioma",
  about: "Sobre",
};

export function SettingsSheet() {
  const open = useApp((s) => s.settingsOpen);
  const page = useApp((s) => s.settingsPage);
  const close = useApp((s) => s.closeSettings);
  const setPage = useApp((s) => s.setSettingsPage);
  const setInfo = useApp((s) => s.setInfo);
  const setUpgrade = useApp((s) => s.setUpgrade);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Fechar configurações"
        className="backdrop-in absolute inset-0 bg-fg/25"
        onClick={close}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="sheet-in relative z-10 flex h-[min(860px,96dvh)] w-full max-w-[430px] flex-col overflow-hidden rounded-t-sheet bg-bg md:h-[min(820px,92dvh)] md:rounded-sheet"
        style={{ boxShadow: "var(--shadow-sheet)" }}
      >
        <header className="flex items-center justify-between px-2 pb-1 pt-2.5">
          {page === "index" ? (
            <button
              type="button"
              aria-label="Fechar"
              onClick={close}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <X className="size-[22px]" strokeWidth={1.8} />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Voltar"
              onClick={() => setPage("index")}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <ChevronLeft className="size-[26px]" strokeWidth={1.8} />
            </button>
          )}
          <h1
            id="settings-title"
            className="text-[17px] font-semibold tracking-tight"
          >
            {TITLES[page]}
          </h1>
          {page === "index" ? (
            <button
              type="button"
              aria-label="Informações"
              onClick={() => setInfo(true)}
              className="press flex size-11 items-center justify-center text-fg"
            >
              <span className="flex size-[22px] items-center justify-center rounded-full border-[1.6px] border-fg text-[12px] font-semibold leading-none">
                i
              </span>
            </button>
          ) : (
            <span className="size-11" />
          )}
        </header>

        <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pb-10">
          {page === "index" ? (
            <IndexPage onUpgrade={() => setUpgrade(true)} />
          ) : (
            <DetailPage page={page} />
          )}
        </div>
      </div>
    </div>
  );
}

function IndexPage({ onUpgrade }: { onUpgrade: () => void }) {
  const setPage = useApp((s) => s.setSettingsPage);
  const resetAll = useApp((s) => s.resetAll);
  const close = useApp((s) => s.closeSettings);

  return (
    <>
      <div className="mb-3 rounded-group bg-muted px-4 py-3.5">
        <p className="truncate text-[16px] text-fg">{USER.email}</p>
      </div>

      <div
        className="mb-6 rounded-group bg-surface px-5 py-5"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h2 className="text-[18px] font-semibold tracking-tight">
          Obter mais Claude
        </h2>
        <p className="mt-1 text-[15px] leading-snug text-fg-muted">
          Faça upgrade para mais uso e recursos
        </p>
        <button
          type="button"
          onClick={onUpgrade}
          className="press mt-4 inline-flex h-11 items-center rounded-pill bg-ink px-5 text-[15px] font-medium text-surface"
        >
          Fazer upgrade
        </button>
      </div>

      <Section label="Conta">
        <Group>
          {ACCOUNT.map((item, i) => (
            <Row
              key={item.id}
              Icon={item.Icon}
              label={item.label}
              last={i === ACCOUNT.length - 1}
              onClick={() => setPage(item.id)}
            />
          ))}
        </Group>
      </Section>

      <Section label="App">
        <Group>
          {APP.map((item, i) => (
            <Row
              key={item.id}
              Icon={item.Icon}
              label={item.label}
              last={i === APP.length - 1}
              onClick={() => setPage(item.id)}
            />
          ))}
        </Group>
      </Section>

      <button
        type="button"
        onClick={() => {
          if (confirm("Sair e limpar conversas deste dispositivo?")) {
            resetAll();
            close();
          }
        }}
        className="press mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-group bg-muted text-[15px] font-medium text-fg"
      >
        <LogOut className="size-4" strokeWidth={1.8} />
        Sair
      </button>
      <p className="mt-4 text-center text-[12px] text-fg-subtle">Claude · 1.0</p>
    </>
  );
}

function DetailPage({ page }: { page: SettingsPage }) {
  const prefs = useApp((s) => s.prefs);
  const patch = useApp((s) => s.patchPrefs);
  const setUpgrade = useApp((s) => s.setUpgrade);

  if (page === "profile") {
    return (
      <>
        <div className="mb-5 flex flex-col items-center py-4">
          <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-muted text-[18px] font-medium">
            {USER.initials}
          </div>
          <p className="text-[17px] font-medium">{USER.fullName}</p>
          <p className="text-[14px] text-fg-muted">{USER.email}</p>
        </div>
        <Group>
          <InfoRow label="Nome" value={USER.fullName} />
          <InfoRow label="Apelido" value={USER.firstName} />
          <InfoRow label="E-mail" value={USER.email} last />
        </Group>
      </>
    );
  }

  if (page === "billing") {
    return (
      <>
        <Group>
          <InfoRow label="Plano" value="Gratuito" />
          <InfoRow label="Renovação" value="—" last />
        </Group>
        <div className="mt-4 rounded-group bg-muted px-4 py-4">
          <p className="mb-2 text-[14px] font-medium">Uso neste período</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted-2">
            <div className="h-full w-2/5 rounded-full bg-accent" />
          </div>
          <p className="mt-2 text-[13px] text-fg-muted">
            Faça upgrade para mais mensagens e modelos avançados.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUpgrade(true)}
          className="press mt-4 flex h-12 w-full items-center justify-center rounded-pill bg-ink text-[15px] font-medium text-surface"
        >
          Fazer upgrade
        </button>
      </>
    );
  }

  if (page === "notifications") {
    return (
      <Group>
        <ToggleRow
          label="Respostas prontas"
          hint="Avisar quando o Claude terminar de responder"
          on={prefs.notifications.replies}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              notifications: { ...p.notifications, replies: v },
            }))
          }
        />
        <ToggleRow
          label="Dicas"
          hint="Sugestões para aproveitar melhor o app"
          on={prefs.notifications.tips}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              notifications: { ...p.notifications, tips: v },
            }))
          }
        />
        <ToggleRow
          label="Novidades do produto"
          last
          on={prefs.notifications.product}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              notifications: { ...p.notifications, product: v },
            }))
          }
        />
      </Group>
    );
  }

  if (page === "focus") {
    return (
      <Group>
        <ToggleRow
          label="Não perturbe"
          hint="Silenciar notificações"
          on={prefs.focus.dnd}
          onChange={(v) =>
            patch((p) => ({ ...p, focus: { ...p.focus, dnd: v } }))
          }
        />
        <ToggleRow
          label="Limite de uso diário"
          hint="Lembrete para pausar depois de um tempo"
          last
          on={prefs.focus.usageLimit}
          onChange={(v) =>
            patch((p) => ({ ...p, focus: { ...p.focus, usageLimit: v } }))
          }
        />
      </Group>
    );
  }

  if (page === "privacy") {
    return (
      <Group>
        <ToggleRow
          label="Ajudar a treinar o modelo"
          hint="Conversas podem ser usadas para melhorar o Claude"
          on={prefs.privacy.train}
          onChange={(v) =>
            patch((p) => ({ ...p, privacy: { ...p.privacy, train: v } }))
          }
        />
        <ToggleRow
          label="Melhorar o produto"
          last
          on={prefs.privacy.improve}
          onChange={(v) =>
            patch((p) => ({ ...p, privacy: { ...p.privacy, improve: v } }))
          }
        />
      </Group>
    );
  }

  if (page === "shared") {
    return (
      <Empty
        title="Nenhum link compartilhado"
        body="Quando você publicar uma conversa, ela aparece aqui."
      />
    );
  }

  if (page === "features") {
    return (
      <Group>
        <ToggleRow
          label="Artefatos"
          hint="Gerar documentos e código em painel separado"
          on={prefs.features.artifacts}
          onChange={(v) =>
            patch((p) => ({ ...p, features: { ...p.features, artifacts: v } }))
          }
        />
        <ToggleRow
          label="Pesquisa"
          hint="Buscar informações atualizadas quando precisar"
          on={prefs.features.research}
          onChange={(v) =>
            patch((p) => ({ ...p, features: { ...p.features, research: v } }))
          }
        />
        <ToggleRow
          label="Análise estendida"
          last
          on={prefs.features.analysis}
          onChange={(v) =>
            patch((p) => ({ ...p, features: { ...p.features, analysis: v } }))
          }
        />
      </Group>
    );
  }

  if (page === "connectors") {
    const items = [
      { id: "gdrive", label: "Google Drive" },
      { id: "gmail", label: "Gmail" },
      { id: "github", label: "GitHub" },
      { id: "notion", label: "Notion" },
    ];
    return (
      <Group>
        {items.map((it, i) => (
          <ToggleRow
            key={it.id}
            label={it.label}
            last={i === items.length - 1}
            on={!!prefs.connectors[it.id]}
            onChange={(v) =>
              patch((p) => ({
                ...p,
                connectors: { ...p.connectors, [it.id]: v },
              }))
            }
          />
        ))}
      </Group>
    );
  }

  if (page === "permissions") {
    return (
      <Group>
        <ToggleRow
          label="Câmera"
          on={prefs.permissions.camera}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              permissions: { ...p.permissions, camera: v },
            }))
          }
        />
        <ToggleRow
          label="Microfone"
          on={prefs.permissions.mic}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              permissions: { ...p.permissions, mic: v },
            }))
          }
        />
        <ToggleRow
          label="Fotos"
          last
          on={prefs.permissions.photos}
          onChange={(v) =>
            patch((p) => ({
              ...p,
              permissions: { ...p.permissions, photos: v },
            }))
          }
        />
      </Group>
    );
  }

  if (page === "appearance") {
    const opts = ["system", "light", "dark"] as const;
    const labels: Record<(typeof opts)[number], string> = {
      system: "Sistema",
      light: "Claro",
      dark: "Escuro",
    };
    return (
      <Group>
        {opts.map((o, i) => (
          <button
            key={o}
            type="button"
            onClick={() => patch({ appearance: o })}
            className={cn(
              "flex h-14 w-full items-center justify-between px-4 text-[16px]",
              i !== opts.length - 1 && "border-b border-hairline",
            )}
          >
            {labels[o]}
            {prefs.appearance === o ? (
              <Check className="size-4 text-accent" strokeWidth={2.4} />
            ) : (
              <span className="size-4" />
            )}
          </button>
        ))}
      </Group>
    );
  }

  if (page === "language") {
    return (
      <Group>
        <InfoRow label="Idioma do app" value="Português (Brasil)" last />
      </Group>
    );
  }

  return null;
}

function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5">
      <h3 className="mb-2 px-3 text-[13px] font-medium text-fg-muted">{label}</h3>
      {children}
    </section>
  );
}

function Group({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-group bg-muted">{children}</div>;
}

function Row({
  Icon,
  label,
  last,
  onClick,
}: {
  Icon: typeof CircleUser;
  label: string;
  last?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-[54px] w-full items-center gap-3.5 px-4 text-left",
        !last && "border-b border-hairline",
      )}
    >
      <Icon className="size-[22px] shrink-0 text-fg" strokeWidth={1.6} />
      <span className="flex-1 text-[17px] text-fg">{label}</span>
      <ChevronRight className="size-5 text-fg-subtle" strokeWidth={1.6} />
    </button>
  );
}

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-h-14 items-center justify-between gap-3 px-4 py-3",
        !last && "border-b border-hairline",
      )}
    >
      <span className="text-[16px] text-fg-muted">{label}</span>
      <span className="truncate text-right text-[16px] text-fg">{value}</span>
    </div>
  );
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
  last,
}: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3.5",
        !last && "border-b border-hairline",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[16px] text-fg">{label}</p>
        {hint ? <p className="mt-0.5 text-[13px] text-fg-muted">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={cn(
          "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-200",
          on ? "bg-accent" : "bg-muted-2",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] size-[27px] rounded-full bg-surface shadow-sm transition-transform duration-200",
            on ? "translate-x-[22px]" : "translate-x-[2px]",
          )}
        />
      </button>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="px-4 py-16 text-center">
      <p className="text-[17px] font-medium">{title}</p>
      <p className="mt-1 text-[14px] text-fg-muted">{body}</p>
    </div>
  );
}
