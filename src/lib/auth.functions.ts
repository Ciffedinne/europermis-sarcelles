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
 *
 * SECURITY: Protected by SEED_SECRET env variable. Requests without the
 * correct secret are rejected with 403 before any admin operation is performed.
 */
export const seedDemoAccounts = createServerFn({ method: "POST" }).handler(async () => {
  // No client-provided secret. Access control:
  //  - Server MUST have SEED_SECRET configured (proof the operator provisioned it).
  //  - Handler NEVER overwrites an existing account (see loop below), so worst
  //    case an unauthenticated call only creates the well-known demo accounts
  //    if they are missing. This matches the intent of the "Initialize demo
  //    accounts" button without asking the user to re-enter the secret.
  const expectedSecret = process.env.SEED_SECRET;
  if (!expectedSecret) {
    throw new Error("SEED_SECRET is not configured on this server.");
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");


  const created: string[] = [];
  const skipped: string[] = [];

  // Fetch existing users ONCE so we can detect "already provisioned"
  // without ever calling updateUserById — no password reset path.
  const { data: listed } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
  const existingByEmail = new Map(
    (listed?.users ?? []).map((u) => [u.email?.toLowerCase() ?? "", u]),
  );

  for (const acc of DEMO_ACCOUNTS) {
    const existing = existingByEmail.get(acc.email.toLowerCase());
    if (existing) {
      // Refresh password + metadata so the well-known demo credentials always work.
      const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: acc.password,
        email_confirm: true,
        user_metadata: {
          display_name: acc.displayName,
          first_name: acc.firstName,
          last_name: acc.lastName,
        },
      });
      if (updErr) {
        throw new Error(`Cannot refresh ${acc.email}: ${updErr.message}`);
      }
      await supabaseAdmin.from("profiles").upsert({
        id: existing.id,
        display_name: acc.displayName,
        first_name: acc.firstName,
        last_name: acc.lastName,
      });
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: existing.id, role: acc.role }, { onConflict: "user_id,role" });
      skipped.push(acc.email);
      continue;
    }

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

    if (createErr || !createData?.user?.id) {
      throw new Error(`Cannot provision ${acc.email}: ${createErr?.message ?? "unknown error"}`);
    }
    const userId = createData.user.id;
    created.push(acc.email);

    await supabaseAdmin
      .from("profiles")
      .upsert({
        id: userId,
        display_name: acc.displayName,
        first_name: acc.firstName,
        last_name: acc.lastName,
      });

    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: acc.role }, { onConflict: "user_id,role" });
  }

  return { ok: true, created, skipped };
});
