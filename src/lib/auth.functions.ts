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
export const seedDemoAccounts = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    if (
      !data ||
      typeof data !== "object" ||
      !("secret" in data) ||
      typeof (data as Record<string, unknown>).secret !== "string"
    ) {
      throw new Error("Missing or invalid secret");
    }
    return data as { secret: string };
  })
  .handler(async ({ data }) => {
  // Verify the caller knows the seed secret before any admin operation.
  const expectedSecret = process.env.SEED_SECRET;
  if (!expectedSecret) {
    throw new Error("SEED_SECRET is not configured on this server.");
  }
  if (data.secret !== expectedSecret) {
    throw new Error("Forbidden: invalid seed secret.");
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
    // SECURITY: if the account already exists we do NOT touch it —
    // no password reset, no role change. This prevents a leaked SEED_SECRET
    // from being used to reset a live admin/instructor password to the
    // well-known DEMO_ACCOUNTS value.
    if (existingByEmail.has(acc.email.toLowerCase())) {
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
