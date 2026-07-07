import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ProvisionRole = "student" | "instructor";

export type ProvisionInput = {
  role: ProvisionRole;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  // Student-specific — persisted to public.students when role === "student"
  student?: {
    civilite?: string;
    dateNaissance?: string;
    lieuNaissance?: string;
    departementNaissance?: string;
    paysNaissance?: string;
    neph?: string;
    pkg?: string;
    hours?: string;
    adresse?: string;
    codePostal?: string;
    ville?: string;
    pays?: string;
    telephone?: string;
    username?: string;
    datePremierPermis?: string;
    source?: "seed" | "import";
  };
};

export type ProvisionResult = {
  ok: boolean;
  created: string[];
  skipped: string[];
  errors: { email: string; message: string }[];
};

function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

/**
 * Provision Supabase Auth accounts for imported students / instructors.
 * Admin-only: caller must be authenticated AND have the 'admin' role.
 * Uses the same "create only, never reset" pattern as seedDemoAccounts.
 */
export const provisionAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown): { users: ProvisionInput[]; resetPassword?: boolean } => {
    if (!data || typeof data !== "object" || !("users" in data)) {
      throw new Error("Missing users payload");
    }
    const users = (data as { users: unknown }).users;
    const resetPassword = Boolean((data as { resetPassword?: unknown }).resetPassword);
    if (!Array.isArray(users)) throw new Error("users must be an array");
    for (const u of users) {
      if (!u || typeof u !== "object") throw new Error("Invalid user entry");
      const r = u as Record<string, unknown>;
      if (typeof r.email !== "string" || !r.email.includes("@")) {
        throw new Error("Each user needs a valid email");
      }
      if (typeof r.password !== "string" || r.password.length < 6) {
        throw new Error(`Password too short for ${r.email}`);
      }
      if (r.role !== "student" && r.role !== "instructor") {
        throw new Error(`Invalid role for ${r.email}`);
      }
    }
    return { users: users as ProvisionInput[], resetPassword };
  })
  .handler(async ({ data, context }): Promise<ProvisionResult> => {
    // Authorization: caller must be admin.
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      throw new Error("Forbidden: admin role required");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // List existing users once to detect duplicates without ever resetting.
    const { data: listed } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
    const existingByEmail = new Map(
      (listed?.users ?? []).map((u) => [u.email?.toLowerCase() ?? "", u]),
    );

    const created: string[] = [];
    const skipped: string[] = [];
    const errors: { email: string; message: string }[] = [];

    for (const u of data.users) {
      const email = normalizeEmail(u.email);
      try {
        let userId: string | undefined;
        const existing = existingByEmail.get(email);

        if (existing) {
          userId = existing.id;
          if (data.resetPassword) {
            // Explicit password reset requested — replace old credential.
            const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(existing.id, {
              password: u.password,
              email_confirm: true,
            });
            if (updErr) {
              errors.push({ email, message: `password reset failed: ${updErr.message}` });
              continue;
            }
          }
          skipped.push(email);
          // Ensure role + profile exist even for pre-existing accounts.
          const displayName = u.displayName ?? `${u.firstName} ${u.lastName}`.trim();
          await supabaseAdmin.from("profiles").upsert({
            id: userId,
            display_name: displayName,
            first_name: u.firstName,
            last_name: u.lastName,
          });
          await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: userId, role: u.role }, { onConflict: "user_id,role" });
        } else {
          const displayName = u.displayName ?? `${u.firstName} ${u.lastName}`.trim();
          const { data: createData, error: createErr } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: u.password,
            email_confirm: true,
            user_metadata: {
              display_name: displayName,
              first_name: u.firstName,
              last_name: u.lastName,
            },
          });
          if (createErr || !createData?.user?.id) {
            errors.push({ email, message: createErr?.message ?? "createUser failed" });
            continue;
          }
          userId = createData.user.id;
          created.push(email);

          await supabaseAdmin.from("profiles").upsert({
            id: userId,
            display_name: displayName,
            first_name: u.firstName,
            last_name: u.lastName,
          });

          await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: userId, role: u.role }, { onConflict: "user_id,role" });
        }

        // Upsert student record if applicable — safe on both create and skip.
        if (u.role === "student" && userId) {
          const s = u.student ?? {};
          await supabaseAdmin.from("students").upsert(
            {
              user_id: userId,
              civilite: s.civilite ?? null,
              nom: u.lastName,
              prenom: u.firstName,
              date_naissance: s.dateNaissance ?? null,
              lieu_naissance: s.lieuNaissance ?? null,
              departement_naissance: s.departementNaissance ?? null,
              pays_naissance: s.paysNaissance ?? null,
              neph: s.neph ?? null,
              pkg: s.pkg ?? "À définir",
              hours: s.hours ?? "0/20",
              adresse: s.adresse ?? null,
              code_postal: s.codePostal ?? null,
              ville: s.ville ?? null,
              pays: s.pays ?? null,
              telephone: s.telephone ?? null,
              email,
              username: s.username ?? null,
              date_premier_permis: s.datePremierPermis ?? null,
              source: s.source ?? "import",
            },
            { onConflict: "user_id" },
          );
        }
      } catch (e) {
        errors.push({ email, message: e instanceof Error ? e.message : String(e) });
      }
    }

    return { ok: errors.length === 0, created, skipped, errors };
  });

export type ResetStudentsResult = {
  ok: boolean;
  deletedAuth: number;
  deletedStudents: number;
  errors: { email: string; message: string }[];
};

/**
 * Purge ALL student accounts (auth + public.students + public.user_roles rows for role=student).
 * Admin-only. Preserves admin & instructor accounts. Destructive and irreversible.
 */
export const resetStudentAccounts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ResetStudentsResult> => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Forbidden: admin role required");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Collect all user_ids currently flagged as students.
    const { data: studentRoles, error: rolesErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "student");
    if (rolesErr) throw new Error(`Cannot list student roles: ${rolesErr.message}`);

    const studentUserIds = Array.from(
      new Set((studentRoles ?? []).map((r) => r.user_id).filter(Boolean)),
    );

    // Delete public.students rows (all — this table only holds students).
    const { count: deletedStudents } = await supabaseAdmin
      .from("students")
      .delete({ count: "exact" })
      .not("id", "is", null);

    // Delete student role rows.
    if (studentUserIds.length > 0) {
      await supabaseAdmin
        .from("user_roles")
        .delete()
        .in("user_id", studentUserIds)
        .eq("role", "student");
    }

    // Delete auth users (cascades profiles via trigger/FK if present).
    const errors: { email: string; message: string }[] = [];
    let deletedAuth = 0;
    for (const uid of studentUserIds) {
      const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(uid);
      if (delErr) {
        errors.push({ email: uid, message: delErr.message });
      } else {
        deletedAuth++;
      }
    }

    return {
      ok: errors.length === 0,
      deletedAuth,
      deletedStudents: deletedStudents ?? 0,
      errors,
    };
  });
