import { useEffect, useState } from "react";
import { ClaudeMark, GhostIcon } from "./claude-mark";
import { Composer } from "./composer";
import { MenuButton } from "./sidebar";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/types";
import { greetingForHour } from "@/lib/utils";

export function HomeView() {
  const newChat = useApp((s) => s.newChat);
  const [greet, setGreet] = useState("Boa tarde");

  useEffect(() => {
    setGreet(greetingForHour(new Date().getHours()));
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg-warm">
      <header className="flex items-center justify-between border-b border-hairline px-3 pb-1.5 pt-[max(8px,env(safe-area-inset-top))]">
        <MenuButton />
        <button
          type="button"
          aria-label="Bate-papo temporário"
          onClick={() => newChat({ temporary: true })}
          className="press flex size-11 items-center justify-center text-fg"
        >
          <GhostIcon className="size-[22px]" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6">
        <div className="greeting-in flex flex-col items-center">
          <ClaudeMark className="mb-5 size-[42px] text-accent" />
          <h2 className="font-display text-center text-[32px] font-medium leading-[1.15] tracking-[-0.02em] text-fg md:text-[36px]">
            {greet}, {USER.firstName}
          </h2>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl pb-[max(6px,env(safe-area-inset-bottom))]">
        <Composer showUpsell />
      </div>
    </div>
  );
}
