import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, ClipboardCheck, User, X, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BottomNav, type TabItem } from "@/components/BottomNav";
import { INSTRUCTOR } from "@/lib/mock-data";

export const Route = createFileRoute("/instructor")({
  head: () => ({ meta: [{ title: "Espace Moniteur — Euro-Permis Sarcelles" }] }),
  component: InstructorApp,
});

type Tab = "home" | "validate" | "profile";

const TABS: TabItem<Tab>[] = [
  { id: "home", label: "Journée", icon: Home },
  { id: "validate", label: "Validation", icon: ClipboardCheck },
  { id: "profile", label: "Profil", icon: User },
];

function InstructorApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const titles: Record<Tab, string> = {
    home: "Ma journée",
    validate: "Valider un cours",
    profile: "Mon profil",
  };
  return (
    <>
      <AppShell title={titles[tab]} subtitle={`Moniteur · ${INSTRUCTOR.fullName}`}>
        {tab === "home" && <InstructorHome onOpen={(id) => { setOpenLesson(id); setTab("validate"); }} />}
        {tab === "validate" && <InstructorValidate lessonId={openLesson} setLessonId={setOpenLesson} onClose={() => { setOpenLesson(null); setTab("home"); }} />}
        {tab === "profile" && <InstructorProfile />}
      </AppShell>
      <BottomNav items={TABS} active={tab} onChange={setTab} />
    </>
  );
}

function statusBadge(s: string) {
  if (s === "done")
    return <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold uppercase text-success">Terminé</span>;
  if (s === "current")
    return <span className="rounded-full bg-primary/20 px-2 py-1 text-[10px] font-semibold uppercase text-primary">En cours</span>;
  return <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-semibold uppercase text-muted-foreground">À venir</span>;
}

function InstructorHome({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-xs uppercase tracking-wider text-primary">Aujourd'hui</p>
        <p className="mt-1 text-base font-semibold">{INSTRUCTOR.today.length} cours planifiés</p>
      </div>
      {INSTRUCTOR.today.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onOpen(l.id)}
          className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/50"
        >
          <div className="grid w-16 shrink-0 place-items-center rounded-xl bg-secondary py-2">
            <p className="text-[10px] uppercase text-muted-foreground">heure</p>
            <p className="text-sm font-bold text-primary">{l.time.split(" ")[0]}</p>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{l.student}</p>
            <p className="text-xs text-muted-foreground">{l.type} · {l.time}</p>
          </div>
          {statusBadge(l.status)}
        </button>
      ))}
    </div>
  );
}

function InstructorValidate({
  lessonId,
  setLessonId,
  onClose,
}: {
  lessonId: string | null;
  setLessonId: (id: string | null) => void;
  onClose: () => void;
}) {
  const lesson = INSTRUCTOR.today.find((l) => l.id === lessonId) ?? INSTRUCTOR.today[2];
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [signed, setSigned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (confirmed) {
    return (
      <div className="space-y-3 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <Check className="h-8 w-8" />
        </div>
        <p className="text-base font-semibold">Cours validé !</p>
        <p className="text-sm text-muted-foreground">Le livret de l'élève a été mis à jour.</p>
        <button
          type="button"
          onClick={() => {
            setConfirmed(false);
            setChecks({});
            setSigned(false);
            setLessonId(null);
          }}
          className="mt-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between rounded-2xl border border-border bg-card p-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary">Élève</p>
          <p className="mt-1 text-base font-semibold">{lesson.student}</p>
          <p className="text-xs text-muted-foreground">{lesson.time} · {lesson.type}</p>
        </div>
        <button
          type="button"
          onClick={() => { setLessonId(null); onClose(); }}
          className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-3 text-sm font-semibold">Compétences travaillées</h2>
        <ul className="space-y-2">
          {INSTRUCTOR.skills.map((s) => {
            const on = !!checks[s];
            return (
              <li key={s}>
                <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-secondary px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => setChecks((c) => ({ ...c, [s]: e.target.checked }))}
                    className="peer sr-only"
                  />
                  <span className={`grid h-5 w-5 place-items-center rounded-md border ${on ? "border-primary bg-primary" : "border-border bg-background"}`}>
                    {on && <Check className="h-3.5 w-3.5 text-primary-foreground" />}
                  </span>
                  <span className="text-sm">{s}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold">Signature de l'élève</h2>
        <button
          type="button"
          onClick={() => setSigned((s) => !s)}
          className={`grid h-28 w-full place-items-center rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${
            signed
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-background text-muted-foreground"
          }`}
        >
          {signed ? "✍ Signature capturée — appuyer pour effacer" : "Appuyer pour signer ici"}
        </button>
      </div>

      <button
        type="button"
        disabled={!signed}
        onClick={() => setConfirmed(true)}
        className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
      >
        Valider le cours
      </button>
    </div>
  );
}

function InstructorProfile() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          KB
        </div>
        <div>
          <p className="text-base font-semibold">{INSTRUCTOR.fullName}</p>
          <p className="text-xs text-muted-foreground">@{INSTRUCTOR.username}</p>
          <p className="text-xs text-muted-foreground">Moniteur diplômé — BEPECASER</p>
        </div>
      </div>
    </div>
  );
}
