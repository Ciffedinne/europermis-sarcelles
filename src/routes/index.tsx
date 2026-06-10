import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, UserCog, ShieldCheck } from "lucide-react";
import logoAsset from "@/assets/logo-blanc.webp.asset.json";
import {
  authenticateLocalUser,
  setActiveSession,
  startDemoSession,
  type MockRole,
} from "@/lib/local-auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Euro-Permis Sarcelles — Connexion" },
      {
        name: "description",
        content:
          "Espace en ligne de l'auto-école Euro-Permis Sarcelles : élèves, moniteurs et secrétariat.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const goToRole = (role: MockRole) => {
    if (role === "admin") navigate({ to: "/admin" });
    else if (role === "instructor") navigate({ to: "/instructor" });
    else navigate({ to: "/student" });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-5 pb-10 pt-12">
        <div className="flex flex-col items-center text-center">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Car className="h-8 w-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">
            Euro-Permis Sarcelles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Votre auto-école, dans votre poche.
          </p>
        </div>

        <form
          className="mt-8 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const user = authenticateLocalUser(username, password);
            if (!user) {
              setError("Identifiant ou mot de passe incorrect.");
              return;
            }
            setError(null);
            setActiveSession(user);
            goToRole(user.role);
          }}
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Identifiant (Username)
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ex. eleve_jean"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Se connecter
          </button>
          {error && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
              {error}
            </p>
          )}
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Accès démo
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <DemoButton
            label="Tester l'Espace Élève"
            sub="eleve_jean"
            icon={GraduationCap}
            onClick={() => {
              startDemoSession("student");
              navigate({ to: "/student" });
            }}
          />
          <DemoButton
            label="Tester l'Espace Moniteur"
            sub="moniteur_karim"
            icon={UserCog}
            onClick={() => {
              startDemoSession("instructor");
              navigate({ to: "/instructor" });
            }}
          />
          <DemoButton
            label="Tester l'Espace Secrétaire (Admin)"
            sub="admin_secretaire"
            icon={ShieldCheck}
            onClick={() => {
              startDemoSession("admin");
              navigate({ to: "/admin" });
            }}
          />
        </div>

        <p className="mt-8 text-center text-[11px] text-muted-foreground">
          56-58 Avenue Paul Valéry, 95200 Sarcelles · 01 34 29 01 54
        </p>
      </div>
    </div>
  );
}

function DemoButton({
  label,
  sub,
  icon: Icon,
  onClick,
}: {
  label: string;
  sub: string;
  icon: typeof GraduationCap;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4 text-left transition-colors hover:bg-primary/20"
    >
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold">🟢 {label}</span>
        <span className="block text-xs text-muted-foreground">{sub}</span>
      </span>
      <span className="text-primary">→</span>
    </button>
  );
}
