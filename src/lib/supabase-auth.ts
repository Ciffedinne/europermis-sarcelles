import { supabase } from "@/integrations/supabase/client";
import { setActiveSession, type MockAuthUser, type MockRole } from "@/lib/local-auth";

// Legacy username -> demo email mapping (for backward compat with old login form)
const USERNAME_TO_EMAIL: Record<string, string> = {
  admin_secretaire: "admin@europermis.fr",
  moniteur_karim: "moniteur@europermis.fr",
  eleve_jean: "eleve@europermis.fr",
};

function resolveEmail(input: string) {
  const trimmed = input.trim();
  if (trimmed.includes("@")) return trimmed.toLowerCase();
  const lower = trimmed.toLowerCase();
  return USERNAME_TO_EMAIL[lower] ?? lower;
}

export async function signInWithCredentials(
  usernameOrEmail: string,
  password: string,
): Promise<{ user: MockAuthUser; role: MockRole } | { error: string }> {
  const email = resolveEmail(usernameOrEmail);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    return { error: "Identifiant ou mot de passe incorrect." };
  }

  // Fetch role
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  const role = (roles?.[0]?.role as MockRole | undefined) ?? "student";

  const displayName =
    (data.user.user_metadata?.display_name as string | undefined) ?? data.user.email ?? "Utilisateur";

  const user: MockAuthUser = {
    id: data.user.id,
    role,
    username: data.user.email ?? email,
    password: "",
    displayName,
    studentId: role === "student" ? data.user.id : undefined,
  };

  setActiveSession(user);
  return { user, role };
}

export async function signOutBackend() {
  try {
    await supabase.auth.signOut();
  } catch {
    /* ignore */
  }
}
