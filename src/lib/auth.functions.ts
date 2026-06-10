import { createServerFn } from "@tanstack/react-start";

export const DEMO_ACCOUNTS = [
  {
    email: "admin@europermis.fr",
    password: "Admin2026!Demo",
    role: "admin" as const,
    displayName: "Secrétariat Euro-Permis",
    firstName: "Secrétariat",
    lastName: "Euro-Permis",
  },
  {
    email: "moniteur@europermis.fr",
    password: "Moniteur2026!Demo",
    role: "instructor" as const,
    displayName: "Karim Benali",
    firstName: "Karim",
    lastName: "Benali",
  },
  {
    email: "eleve@europermis.fr",
    password: "Eleve2026!Demo",
    role: "student" as const,
    displayName: "Jean Dupont",
    firstName: "Jean",
    lastName: "Dupont",
  },
];

/**
 * Provision (or refresh) the three demo accounts on the backend.
 * Idempotent: safe to call repeatedly. Uses the service-role client.
 */
export const seedDemoAccounts = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const created: string[] = [];
  for (const acc of DEMO_ACCOUNTS) {
    // Try to create
    const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: acc.email,
      password: acc.password,
      email_confirm: true,
      user_metadata: {
        display_name: acc.displayName,
        first_name: acc.firstName,
        last_name: acc.lastName,
      },
    });

    let userId = createData?.user?.id;

    if (createErr) {
      // Already exists — find it
      const { data: listed } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
      const existing = listed?.users.find((u) => u.email?.toLowerCase() === acc.email.toLowerCase());
      if (!existing) throw new Error(`Cannot provision ${acc.email}: ${createErr.message}`);
      userId = existing.id;
      // Reset password so demo creds always work
      await supabaseAdmin.auth.admin.updateUserById(userId, { password: acc.password });
    } else {
      created.push(acc.email);
    }

    if (!userId) continue;

    // Ensure profile exists (trigger handles new ones)
    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        display_name: acc.displayName,
        first_name: acc.firstName,
        last_name: acc.lastName,
      });

    // Ensure role assigned
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: acc.role }, { onConflict: "user_id,role" });
  }

  return { ok: true, created };
});
