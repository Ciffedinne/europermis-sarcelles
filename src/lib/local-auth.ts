export const STUDENTS_STORAGE_KEY = "europermis.students.v1";
export const AUTH_USERS_STORAGE_KEY = "europermis.auth.users.v1";
export const ACTIVE_AUTH_STORAGE_KEY = "europermis.auth.active.v1";

export type MockRole = "student" | "instructor" | "admin";

export type StoredStudentProfile = {
  id: string;
  civilite: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  neph: string;
  pkg: string;
  hours: string;
  username: string;
  /**
   * SECURITY: passwords are stored only transiently for the local mock-auth
   * flow and are never written to localStorage. Any read from this field
   * should come from in-memory structures only (DEMO_AUTH_USERS, runtime state).
   * @deprecated Do not persist this field to localStorage.
   */
  password: string;
  source: "seed" | "import";
  createdAt?: number;
  // NOTE: Fields below are intentionally NOT persisted to localStorage.
  // They are kept in the type for in-memory use during the session only.
  adresse?: string;
  codePostal?: string;
  ville?: string;
  pays?: string;
  telephone?: string;
  email?: string;
  departementNaissance?: string;
  paysNaissance?: string;
  datePremierPermis?: string;
};

export type MockAuthUser = {
  id: string;
  role: MockRole;
  username: string;
  password: string;
  displayName: string;
  studentId?: string;
};

const DEMO_AUTH_USERS: MockAuthUser[] = [
  {
    id: "demo-student-jean",
    role: "student",
    username: "eleve_jean",
    password: "0123456789",
    displayName: "Jean Dupont",
    studentId: "0123456789",
  },
  {
    id: "demo-instructor-karim",
    role: "instructor",
    username: "moniteur_karim",
    password: "demo",
    displayName: "Karim Benali",
  },
  {
    id: "demo-admin-secretariat",
    role: "admin",
    username: "admin_secretaire",
    password: "demo",
    displayName: "Secrétariat Euro-Permis",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function getStoredStudents() {
  return readJson<StoredStudentProfile[]>(STUDENTS_STORAGE_KEY, []);
}

/**
 * Fields that must never be written to localStorage for privacy/security reasons.
 * Passwords, PII (address, phone, email, birth details) stay in memory only.
 */
const SENSITIVE_FIELDS: (keyof StoredStudentProfile)[] = [
  "password",
  "adresse",
  "codePostal",
  "ville",
  "pays",
  "telephone",
  "email",
  "dateNaissance",
  "lieuNaissance",
  "departementNaissance",
  "paysNaissance",
  "datePremierPermis",
];

function stripSensitiveFields(student: StoredStudentProfile): Omit<StoredStudentProfile, typeof SENSITIVE_FIELDS[number]> {
  const safe = { ...student } as Record<string, unknown>;
  for (const field of SENSITIVE_FIELDS) {
    delete safe[field];
  }
  return safe as StoredStudentProfile;
}

export function saveStoredStudents(students: StoredStudentProfile[]) {
  // Strip sensitive fields before persisting — passwords and PII never go to localStorage.
  writeJson(STUDENTS_STORAGE_KEY, students.map(stripSensitiveFields));
}

export function getStoredAuthUsers() {
  return readJson<MockAuthUser[]>(AUTH_USERS_STORAGE_KEY, []);
}

const SENSITIVE_AUTH_FIELDS: (keyof MockAuthUser)[] = ["password"];

function stripSensitiveAuthFields(user: MockAuthUser): Omit<MockAuthUser, "password"> {
  const safe = { ...user } as Record<string, unknown>;
  for (const field of SENSITIVE_AUTH_FIELDS) {
    delete safe[field];
  }
  return safe as MockAuthUser;
}

export function saveStoredAuthUsers(users: MockAuthUser[]) {
  // Strip passwords before persisting — they must never reach localStorage.
  writeJson(AUTH_USERS_STORAGE_KEY, users.map(stripSensitiveAuthFields));
}

export function syncStudentAuthUsers(students: StoredStudentProfile[]) {
  const current = getStoredAuthUsers();
  const nonStudentUsers = current.filter((user) => user.role !== "student" || !user.studentId);
  const studentUsers = students.map((student) => ({
    id: `student-${student.id}`,
    role: "student" as const,
    username: student.username,
    password: student.password,
    displayName: `${student.prenom} ${student.nom}`.trim(),
    studentId: student.id,
  }));
  saveStoredAuthUsers([...nonStudentUsers, ...studentUsers]);
}

export function getAllAuthUsers() {
  const byUsername = new Map<string, MockAuthUser>();
  for (const user of DEMO_AUTH_USERS) byUsername.set(normalizeUsername(user.username), user);
  for (const user of getStoredAuthUsers()) byUsername.set(normalizeUsername(user.username), user);
  return Array.from(byUsername.values());
}

export function authenticateLocalUser(username: string, password: string) {
  const cleanUsername = normalizeUsername(username);
  const cleanPassword = password.trim();

  const importedStudent = getStoredStudents().find(
    (student) =>
      normalizeUsername(student.username) === cleanUsername && student.password === cleanPassword,
  );
  if (importedStudent) {
    const user: MockAuthUser = {
      id: `student-${importedStudent.id}`,
      role: "student",
      username: importedStudent.username,
      password: importedStudent.password,
      displayName: `${importedStudent.prenom} ${importedStudent.nom}`.trim(),
      studentId: importedStudent.id,
    };
    syncStudentAuthUsers(getStoredStudents());
    return user;
  }

  return getAllAuthUsers().find(
    (user) => normalizeUsername(user.username) === cleanUsername && user.password === cleanPassword,
  );
}

export function setActiveSession(user: MockAuthUser) {
  writeJson(ACTIVE_AUTH_STORAGE_KEY, {
    role: user.role,
    username: user.username,
    displayName: user.displayName,
    studentId: user.studentId,
    authenticatedAt: new Date().toISOString(),
  });
}

export function startDemoSession(role: MockRole) {
  const user = DEMO_AUTH_USERS.find((demoUser) => demoUser.role === role);
  if (user) setActiveSession(user);
}

export type ActiveSession = {
  role?: MockRole;
  username?: string;
  displayName?: string;
  studentId?: string;
  authenticatedAt?: string;
};

export function getActiveSession(): ActiveSession | null {
  return readJson<ActiveSession | null>(ACTIVE_AUTH_STORAGE_KEY, null);
}

export function getActiveStudentProfile() {
  const session = readJson<{ role?: MockRole; username?: string; studentId?: string } | null>(
    ACTIVE_AUTH_STORAGE_KEY,
    null,
  );
  if (session?.role !== "student") return null;

  const students = getStoredStudents();
  return (
    students.find((student) => student.id === session.studentId) ??
    students.find((student) => normalizeUsername(student.username) === normalizeUsername(session.username ?? "")) ??
    null
  );
}

export function clearActiveStudentSession(studentId?: string) {
  if (!canUseStorage()) return;
  const session = readJson<{ role?: MockRole; studentId?: string } | null>(
    ACTIVE_AUTH_STORAGE_KEY,
    null,
  );
  if (session?.role === "student" && (!studentId || session.studentId === studentId)) {
    window.localStorage.removeItem(ACTIVE_AUTH_STORAGE_KEY);
  }
}