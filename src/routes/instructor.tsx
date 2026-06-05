import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Home,
  ClipboardCheck,
  User,
  X,
  Check,
  MessageSquare,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BottomNav, type TabItem } from "@/components/BottomNav";
import { INSTRUCTOR } from "@/lib/mock-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getStoredStudents, STUDENTS_STORAGE_KEY } from "@/lib/local-auth";
import {
  addAppreciation,
  formatShortDate,
  getAppreciations,
  type Appreciation,
} from "@/lib/appreciations";

export const Route = createFileRoute("/instructor")({
  head: () => ({ meta: [{ title: "Espace Moniteur — Euro-Permis Sarcelles" }] }),
  component: InstructorApp,
});

type Tab = "home" | "validate" | "profile";

const TABS: TabItem<Tab>[] = [
  { id: "home", label: "Journée", icon: Home },
  { id: "validate", label: "Appréciations", icon: ClipboardCheck },
  { id: "profile", label: "Profil", icon: User },
];

function InstructorApp() {
  const [tab, setTab] = useState<Tab>("home");
  const titles: Record<Tab, string> = {
    home: "Ma journée",
    validate: "Appréciations élèves",
    profile: "Mon profil",
  };
  return (
    <>
      <AppShell title={titles[tab]} subtitle={`Moniteur · ${INSTRUCTOR.fullName}`}>
        {tab === "home" && <InstructorHome />}
        {tab === "validate" && <InstructorAppreciations />}
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

type LessonItem = (typeof INSTRUCTOR.today)[number];

function InstructorHome() {
  const [openLesson, setOpenLesson] = useState<LessonItem | null>(null);
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
          onClick={() => setOpenLesson(l)}
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
      {openLesson && (
        <LessonValidationModal lesson={openLesson} onClose={() => setOpenLesson(null)} />
      )}
    </div>
  );
}

function LessonValidationModal({
  lesson,
  onClose,
}: {
  lesson: LessonItem;
  onClose: () => void;
}) {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [signed, setSigned] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-xl">
        {confirmed ? (
          <div className="space-y-3 py-6 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
              <Check className="h-8 w-8" />
            </div>
            <p className="text-base font-semibold">Cours validé !</p>
            <p className="text-sm text-muted-foreground">Le livret de l'élève a été mis à jour.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
            >
              Fermer
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-primary">Élève</p>
                <p className="mt-1 text-base font-semibold">{lesson.student}</p>
                <p className="text-xs text-muted-foreground">{lesson.time} · {lesson.type}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4">
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

            <div className="rounded-2xl border border-border bg-background p-4">
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
        )}
      </div>
    </div>
  );
}

function InstructorAppreciations() {
  const [list, setList] = useState<Appreciation[]>([]);
  const [studentName, setStudentName] = useState(INSTRUCTOR.today[0]?.student ?? "");
  const [type, setType] = useState(INSTRUCTOR.today[0]?.type ?? "Conduite");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(false);

  const [storedStudents, setStoredStudents] = useState(() =>
    typeof window !== "undefined" ? getStoredStudents() : [],
  );

  useEffect(() => {
    setList(getAppreciations());
    const refresh = () => setStoredStudents(getStoredStudents());
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === STUDENTS_STORAGE_KEY) refresh();
    };
    const onFocus = () => refresh();
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  // Liste fusionnée : élèves importés/stockés + planning du jour + historique des appréciations
  const studentOptions = useMemo(() => {
    const set = new Set<string>();
    storedStudents.forEach((s) => {
      const name = `${s.prenom ?? ""} ${s.nom ?? ""}`.trim();
      if (name) set.add(name);
    });
    INSTRUCTOR.today.forEach((l) => l.student && set.add(l.student));
    list.forEach((a) => a.studentName && set.add(a.studentName));
    return Array.from(set).sort((a, b) =>
      a.localeCompare(b, "fr", { sensitivity: "base" }),
    );
  }, [storedStudents, list]);

  const submit = () => {
    if (!studentName.trim() || !comment.trim()) return;
    addAppreciation({
      studentName: studentName.trim(),
      type: type.trim() || "Conduite",
      instructor: shortName(INSTRUCTOR.fullName),
      date: formatShortDate(),
      comment: comment.trim(),
    });
    setList(getAppreciations());
    setComment("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Nouvelle appréciation</h2>
        </div>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Élève
            </label>
            <StudentCombobox
              value={studentName}
              options={studentOptions}
              onChange={setStudentName}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Type de cours
            </label>
            <input
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Conduite urbaine, Manœuvres…"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Appréciation
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Bonne gestion du gabarit, attention aux angles morts…"
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={!studentName.trim() || !comment.trim()}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40"
          >
            {saved ? "✓ Appréciation enregistrée" : "Enregistrer l'appréciation"}
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Livret d'apprentissage — historique</h2>
        </div>
        {list.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Aucune appréciation enregistrée pour le moment.
          </p>
        ) : (
          <ul className="space-y-3">
            {list.map((h) => (
              <li key={h.id} className="rounded-xl bg-secondary p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{h.type}</p>
                  <span className="text-[11px] text-muted-foreground">{h.date}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Élève : {h.studentName} · Moniteur : {h.instructor}
                </p>
                <p className="mt-2 text-sm italic text-foreground/90">« {h.comment} »</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function shortName(full: string) {
  const parts = full.trim().split(/\s+/);
  if (parts.length < 2) return full;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
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

function normalizeText(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function StudentCombobox({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalizeText(query.trim());
    if (!q) return options;
    return options.filter((o) => normalizeText(o).includes(q));
  }, [options, query]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-11 w-full items-center justify-between rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary"
        >
          <span className={value ? "" : "text-muted-foreground"}>
            {value || "Sélectionnez un élève…"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un élève…"
            className="h-7 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="max-h-64 overflow-y-auto p-1">
          {filtered.length === 0 ? (
            <div className="px-2 py-6 text-center text-xs text-muted-foreground">
              {options.length === 0
                ? "Aucun élève. Importez un fichier .txt côté admin."
                : "Aucun résultat."}
            </div>
          ) : (
            filtered.map((s) => {
              const selected = s === value;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm transition ${
                    selected ? "bg-primary/10 text-primary" : "hover:bg-secondary"
                  }`}
                >
                  <span className="truncate">{s}</span>
                  {selected && <Check className="h-4 w-4" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
