import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Users, Upload, ChevronLeft, ChevronRight, Database, FileSpreadsheet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BottomNav, type TabItem } from "@/components/BottomNav";
import { INSTRUCTORS, PLANNING } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Espace Admin — Euro-Permis Sarcelles" }] }),
  component: AdminApp,
});

type Tab = "planning" | "students" | "import";

const TABS: TabItem<Tab>[] = [
  { id: "planning", label: "Planning", icon: CalendarDays },
  { id: "students", label: "Élèves", icon: Users },
  { id: "import", label: "Import", icon: Upload },
];

function AdminApp() {
  const [tab, setTab] = useState<Tab>("planning");
  const titles: Record<Tab, string> = {
    planning: "Planning général",
    students: "Gestion élèves",
    import: "Synchronisation",
  };
  return (
    <>
      <AppShell title={titles[tab]} subtitle="Secrétariat · Admin">
        {tab === "planning" && <AdminPlanning />}
        {tab === "students" && <AdminStudents />}
        {tab === "import" && <AdminImport />}
      </AppShell>
      <BottomNav items={TABS} active={tab} onChange={setTab} />
    </>
  );
}

const DAYS = [
  "Lundi 26 mai",
  "Mardi 27 mai",
  "Mercredi 28 mai",
  "Jeudi 29 mai",
  "Vendredi 30 mai",
  "Samedi 31 mai",
];

function AdminPlanning() {
  const [idx, setIdx] = useState(3);
  const [instructorIdx, setInstructorIdx] = useState(0);
  const currentInstructor = INSTRUCTORS[instructorIdx];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-2">
        <button
          type="button"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground"
          aria-label="Jour précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Jour affiché</p>
          <p className="text-sm font-semibold">{DAYS[idx]}</p>
        </div>
        <button
          type="button"
          onClick={() => setIdx((i) => Math.min(DAYS.length - 1, i + 1))}
          className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground"
          aria-label="Jour suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIdx(3)}
        className="w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
      >
        Aujourd'hui
      </button>

      {/* Mobile : sélecteur moniteur avec flèches */}
      <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-2 md:hidden">
        <button
          type="button"
          onClick={() =>
            setInstructorIdx((i) => (i - 1 + INSTRUCTORS.length) % INSTRUCTORS.length)
          }
          className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground"
          aria-label="Moniteur précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {currentInstructor.charAt(0)}
          </div>
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Moniteur</p>
            <p className="text-sm font-semibold">{currentInstructor}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInstructorIdx((i) => (i + 1) % INSTRUCTORS.length)}
          className="grid h-10 w-10 place-items-center rounded-xl bg-secondary text-foreground"
          aria-label="Moniteur suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile : colonne unique */}
      <div className="md:hidden">
        <InstructorColumn name={currentInstructor} />
      </div>

      {/* Desktop / tablette : grille responsive sans scroll horizontal */}
      <div className="hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-3">
        {INSTRUCTORS.map((name) => (
          <InstructorColumn key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

function InstructorColumn({ name }: { name: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {name.charAt(0)}
        </div>
        <p className="text-sm font-semibold">{name}</p>
      </div>
      <ul className="space-y-2">
        {(PLANNING[name] ?? []).map((l, i) => (
          <li key={i} className="rounded-xl bg-secondary p-2.5">
            <p className="text-[11px] font-semibold text-primary">{l.time}</p>
            <p className="mt-0.5 text-sm font-medium leading-tight">{l.student}</p>
            <p className="text-[11px] text-muted-foreground">{l.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AdminStudents() {
  const list = [
    { name: "Jean Dupont", neph: "0123456789", pkg: "Permis B 20h", hours: "14/20" },
    { name: "Aïcha Traoré", neph: "0223456712", pkg: "Permis B 30h", hours: "22/30" },
    { name: "Marc Lefèvre", neph: "0392345621", pkg: "Automatique 13h", hours: "11/13" },
    { name: "Léa Martin", neph: "0411223344", pkg: "Code illimité", hours: "—" },
    { name: "Yanis K.", neph: "0556677889", pkg: "Permis B 20h", hours: "06/20" },
  ];
  return (
    <div className="space-y-2">
      {list.map((s) => (
        <div key={s.neph} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
            {s.name.split(" ").map((p) => p[0]).join("").slice(0, 2)}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{s.name}</p>
            <p className="text-[11px] text-muted-foreground">NEPH · {s.neph} · {s.pkg}</p>
          </div>
          <span className="rounded-full bg-secondary px-2 py-1 text-[11px] font-semibold text-primary">
            {s.hours}
          </span>
        </div>
      ))}
    </div>
  );
}

function AdminImport() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 to-card p-4">
        <p className="text-xs uppercase tracking-wider text-accent">Import rapide</p>
        <p className="mt-1 text-sm">
          Synchronisez votre planning ou importez un fichier CSV de secours pour mettre à jour les
          données rapidement.
        </p>
      </div>

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 text-left"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Database className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Option A — Synchronisation API</span>
          <span className="block text-xs text-muted-foreground">
            Connexion temps réel avec le système de l'auto-école.
          </span>
        </span>
      </button>

      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 text-left"
      >
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-accent-foreground">
          <FileSpreadsheet className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Option B — Import CSV de secours</span>
          <span className="block text-xs text-muted-foreground">
            Téléversez un fichier .csv si l'API est indisponible.
          </span>
        </span>
      </button>
    </div>
  );
}
