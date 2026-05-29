import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Users,
  Upload,
  ChevronLeft,
  ChevronRight,
  Database,
  FileSpreadsheet,
  FileUp,
  CalendarClock,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
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

type ImportedStudent = {
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  neph: string;
};

function parseDateFR(d: string): number {
  const m = d.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return Number.POSITIVE_INFINITY;
  const [, dd, mm, yyyy] = m;
  return new Date(`${yyyy}-${mm}-${dd}`).getTime();
}

function parseTxtTSV(text: string): ImportedStudent[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) throw new Error("Fichier vide");
  const rows = lines.slice(1).map((line) => {
    const cols = line.split("\t").map((c) => c.trim());
    if (cols.length < 6) throw new Error("Format invalide : 6 colonnes attendues séparées par des tabulations");
    return {
      civilite: cols[0],
      nom: cols[1],
      prenom: cols[2],
      dateNaissance: cols[3],
      lieuNaissance: cols[4],
      neph: cols[5],
    };
  });
  return rows;
}

function AdminImport() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [students, setStudents] = useState<ImportedStudent[]>([]);
  const [imported, setImported] = useState<ImportedStudent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleFile = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".txt")) {
      setError("Format invalide : seuls les fichiers .txt sont acceptés.");
      setFileName(file.name);
      setStudents([]);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result ?? "");
        const parsed = parseTxtTSV(text);
        setStudents(parsed);
        setFileName(file.name);
      } catch (err) {
        setStudents([]);
        setFileName(file.name);
        setError(err instanceof Error ? err.message : "Erreur de lecture");
      }
    };
    reader.onerror = () => setError("Impossible de lire le fichier.");
    reader.readAsText(file, "utf-8");
  };

  const launchImport = () => {
    if (students.length === 0) return;
    setImported(students);
    console.table(students);
    toast.success(`Import réussi : ${students.length} élève${students.length > 1 ? "s" : ""} ajouté${students.length > 1 ? "s" : ""}.`);
  };

  const sortByDate = () => {
    if (imported.length === 0) {
      toast.error("Lancez d'abord un import.");
      return;
    }
    const dir = sortAsc ? 1 : -1;
    const sorted = [...imported].sort(
      (a, b) => (parseDateFR(a.dateNaissance) - parseDateFR(b.dateNaissance)) * dir,
    );
    setImported(sorted);
    setSortAsc(!sortAsc);
    toast(`Tri par date de naissance (${sortAsc ? "croissant" : "décroissant"}).`);
  };

  const status = error
    ? { icon: <XCircle className="h-4 w-4" />, text: error, cls: "border-destructive/40 bg-destructive/10 text-destructive" }
    : students.length > 0
      ? {
          icon: <CheckCircle2 className="h-4 w-4" />,
          text: `Fichier chargé : ${students.length} élève${students.length > 1 ? "s" : ""} trouvé${students.length > 1 ? "s" : ""}`,
          cls: "border-primary/40 bg-primary/10 text-primary",
        }
      : {
          icon: <FileText className="h-4 w-4" />,
          text: fileName ?? "Aucun fichier chargé",
          cls: "border-border bg-secondary text-muted-foreground",
        };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/15 to-card p-4">
        <p className="text-xs uppercase tracking-wider text-accent">Import rapide</p>
        <p className="mt-1 text-sm">
          Importez un export .txt (colonnes séparées par tabulations) pour ajouter les élèves
          en lot.
        </p>
      </div>

      {/* Options statiques */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Database className="h-5 w-5" />
          </span>
          <div className="text-xs">
            <p className="font-semibold">Option A — Synchronisation API</p>
            <p className="text-muted-foreground">Temps réel (à venir).</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
            <FileSpreadsheet className="h-5 w-5" />
          </span>
          <div className="text-xs">
            <p className="font-semibold">Option B — Import .txt de secours</p>
            <p className="text-muted-foreground">Fichier tabulé (TSV).</p>
          </div>
        </div>
      </div>

      {/* Input fichier masqué + bouton */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,text/plain"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <FileUp className="h-4 w-4" />
          📁 Sélectionner un fichier .txt
        </button>
        <button
          type="button"
          onClick={launchImport}
          disabled={students.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Upload className="h-4 w-4" />
          Lancer l'import
        </button>
        <button
          type="button"
          onClick={sortByDate}
          disabled={imported.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-secondary px-4 py-3 text-sm font-semibold transition hover:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <CalendarClock className="h-4 w-4" />
          Date
        </button>
      </div>

      {/* Statut */}
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium ${status.cls}`}>
        {status.icon}
        <span className="truncate">{status.text}</span>
      </div>

      {/* Tableau résultat */}
      {imported.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Élèves importés ({imported.length})
            </p>
          </div>
          <div className="max-h-96 overflow-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Civilité</th>
                  <th className="px-3 py-2 font-medium">Nom</th>
                  <th className="px-3 py-2 font-medium">Prénom</th>
                  <th className="px-3 py-2 font-medium">Naissance</th>
                  <th className="px-3 py-2 font-medium">Lieu</th>
                  <th className="px-3 py-2 font-medium">NEPH</th>
                </tr>
              </thead>
              <tbody>
                {imported.map((s, i) => (
                  <tr key={`${s.neph}-${i}`} className="border-t border-border">
                    <td className="px-3 py-2">{s.civilite}</td>
                    <td className="px-3 py-2 font-semibold">{s.nom}</td>
                    <td className="px-3 py-2">{s.prenom}</td>
                    <td className="px-3 py-2">{s.dateNaissance}</td>
                    <td className="px-3 py-2">{s.lieuNaissance}</td>
                    <td className="px-3 py-2 font-mono text-[11px]">{s.neph}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}