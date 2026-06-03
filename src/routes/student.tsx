import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Home,
  CalendarDays,
  CreditCard,
  User,
  Phone,
  MapPin,
  Clock,
  Plus,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  MessageSquare,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { BottomNav, type TabItem } from "@/components/BottomNav";
import { SCHOOL, STUDENT, PRICING } from "@/lib/mock-data";
import { getActiveStudentProfile, type StoredStudentProfile } from "@/lib/local-auth";

export const Route = createFileRoute("/student")({
  head: () => ({ meta: [{ title: "Espace Élève — Euro-Permis Sarcelles" }] }),
  component: StudentApp,
});

type Tab = "home" | "planning" | "payment" | "profile";

const TABS: TabItem<Tab>[] = [
  { id: "home", label: "Accueil", icon: Home },
  { id: "planning", label: "Planning", icon: CalendarDays },
  { id: "payment", label: "Paiement", icon: CreditCard },
  { id: "profile", label: "Profil", icon: User },
];

function StudentApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [activeStudent] = useState<StoredStudentProfile | null>(() => getActiveStudentProfile());
  const firstName = activeStudent?.prenom || "Jean";
  const titles: Record<Tab, string> = {
    home: `Bonjour ${firstName} 👋`,
    planning: "Mon planning",
    payment: "Paiement & tarifs",
    profile: "Mon profil",
  };
  return (
    <>
      <AppShell title={titles[tab]} subtitle="Espace Élève">
        {tab === "home" && <StudentHome student={activeStudent} />}
        {tab === "planning" && <StudentPlanning student={activeStudent} />}
        {tab === "payment" && <StudentPayment />}
        {tab === "profile" && <StudentProfile student={activeStudent} />}
      </AppShell>
      <BottomNav items={TABS} active={tab} onChange={setTab} />
    </>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card p-4 ${className}`}>{children}</div>
  );
}

function fullName(student: StoredStudentProfile | null) {
  return student ? `${student.prenom} ${student.nom}`.trim() : STUDENT.fullName;
}

function initials(student: StoredStudentProfile | null) {
  return student ? `${student.prenom[0] ?? ""}${student.nom[0] ?? ""}`.toUpperCase() : "JD";
}

function parseHours(hours?: string) {
  const match = (hours ?? "").match(/^(\d+)\/(\d+)/);
  if (!match) return { done: STUDENT.hoursDone, total: STUDENT.hoursTotal };
  return { done: Number(match[1]), total: Number(match[2]) || STUDENT.hoursTotal };
}

function StudentHome() {
  const pct = Math.round((STUDENT.hoursDone / STUDENT.hoursTotal) * 100);
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary/25 to-card">
        <p className="text-xs uppercase tracking-wider text-primary">Prochain cours</p>
        <p className="mt-1 text-lg font-semibold">{STUDENT.nextLesson.date}</p>
        <p className="text-sm text-muted-foreground">
          {STUDENT.nextLesson.time} · {STUDENT.nextLesson.instructor}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{STUDENT.nextLesson.place}</p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <p className="text-xs text-muted-foreground">Heures effectuées</p>
          <p className="mt-1 text-2xl font-bold">
            {STUDENT.hoursDone}
            <span className="text-sm font-medium text-muted-foreground">/{STUDENT.hoursTotal}h</span>
          </p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-secondary">
            <div className="h-1.5 rounded-full bg-primary" style={{ width: `${pct}%` }} />
          </div>
        </Card>
        <Card>
          <p className="text-xs text-muted-foreground">Solde</p>
          <p className="mt-1 text-2xl font-bold">{STUDENT.balance} €</p>
          <p className="mt-2 text-[11px] text-muted-foreground">Crédit disponible</p>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={SCHOOL.phoneHref}
          className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          <Phone className="h-4 w-4" /> Appeler
        </a>
        <a
          href={SCHOOL.mapsHref}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"
        >
          <MapPin className="h-4 w-4" /> Itinéraire
        </a>
      </div>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Horaires de l'agence</h2>
        </div>
        <ul className="divide-y divide-border text-sm">
          {SCHOOL.hours.map((h) => (
            <li key={h.day} className="flex justify-between py-2">
              <span className="text-muted-foreground">{h.day}</span>
              <span className="font-medium">{h.time}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function StudentPlanning() {
  return (
    <div className="space-y-3">
      <Card>
        <p className="text-xs text-muted-foreground">Semaine en cours</p>
        <p className="mt-1 text-base font-semibold">26 mai – 1 juin 2026</p>
      </Card>
      {STUDENT.upcoming.map((l, i) => (
        <Card key={i} className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold">{l.type}</p>
            <p className="text-xs text-muted-foreground">
              {l.date} · {l.time} · {l.instructor}
            </p>
          </div>
          <span className="rounded-full bg-secondary px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            À venir
          </span>
        </Card>
      ))}
    </div>
  );
}

function StudentPayment() {
  const [bought, setBought] = useState(0);
  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-accent/25 to-card">
        <p className="text-xs uppercase tracking-wider text-accent">Solde financier</p>
        <p className="mt-1 text-3xl font-bold">{STUDENT.balance + bought * 60} €</p>
        <p className="text-xs text-muted-foreground">Mis à jour à l'instant</p>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Heures supplémentaires</h2>
        <div className="flex items-center justify-between rounded-xl bg-secondary p-3">
          <div>
            <p className="text-sm font-medium">1 heure de conduite</p>
            <p className="text-xs text-muted-foreground">60 € · facturée à la séance</p>
          </div>
          <button
            type="button"
            onClick={() => setBought((b) => b + 1)}
            className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Plus className="h-3.5 w-3.5" /> Acheter
          </button>
        </div>
        {bought > 0 && (
          <p className="mt-2 text-xs text-success">
            ✓ {bought} h ajoutée{bought > 1 ? "s" : ""} (simulation)
          </p>
        )}
      </Card>

      <div>
        <h2 className="mb-2 px-1 text-sm font-semibold">Grille tarifaire</h2>
        <div className="space-y-2">
          {PRICING.map((p) => (
            <Card key={p.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{p.title}</p>
                {p.badge && (
                  <span className="mt-1 inline-block rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary">
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-base font-bold text-primary">{p.price} €</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentProfile() {
  return (
    <div className="space-y-4">
      <Card className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          JD
        </div>
        <div>
          <p className="text-base font-semibold">{STUDENT.fullName}</p>
          <p className="text-xs text-muted-foreground">@{STUDENT.username}</p>
          <p className="text-xs text-muted-foreground">NEPH : {STUDENT.neph}</p>
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold">Livret pédagogique</h2>
        <ul className="space-y-2">
          {STUDENT.skills.map((s) => (
            <li key={s.name} className="flex items-center gap-2 text-sm">
              {s.done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={s.done ? "" : "text-muted-foreground"}>{s.name}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Mes documents</h2>
        </div>
        <ul className="space-y-2">
          {STUDENT.documents.map((d) => (
            <li
              key={d.name}
              className="flex items-center gap-3 rounded-xl bg-secondary p-3"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{d.name}</p>
                <p className="text-[11px] text-muted-foreground">{d.size}</p>
              </div>
              {d.status === "valid" ? (
                <span className="rounded-full bg-success/15 px-2 py-1 text-[10px] font-semibold uppercase text-success">
                  Validé ✔
                </span>
              ) : (
                <span className="rounded-full bg-accent/20 px-2 py-1 text-[10px] font-semibold uppercase text-accent">
                  En attente ⏳
                </span>
              )}
              <button
                type="button"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground"
                aria-label={`Télécharger ${d.name}`}
              >
                <Download className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Livret d'apprentissage — historique</h2>
        </div>
        <ul className="space-y-3">
          {STUDENT.history.map((h, i) => (
            <li key={i} className="rounded-xl bg-secondary p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{h.type}</p>
                <span className="text-[11px] text-muted-foreground">{h.date}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Moniteur : {h.instructor}</p>
              <p className="mt-2 text-sm italic text-foreground/90">« {h.comment} »</p>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
