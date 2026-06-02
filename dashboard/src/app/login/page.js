"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { WalletButton } from "../../components/WalletButton";
import { isFirebaseConfigured, loginPayLoopUser, registerPayLoopUser } from "../../lib/firebase";
import { roleOptions } from "../../lib/roles";

export default function LoginPage() {
  const [mode, setMode] = useState("register");
  const [selectedRole, setSelectedRole] = useState("member");
  const [form, setForm] = useState({ name: "", email: "", password: "", idCard: "", phoneNumber: "", country: "Kenya" });
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const activeRole = roleOptions.find((role) => role.id === selectedRole) || roleOptions[0];

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function continueToDashboard(event) {
    event.preventDefault();
    setStatus("");

    if (!form.email || !form.password) {
      setStatus("Enter an email and password.");
      return;
    }

    if (mode === "register") {
      if (!form.name || !form.idCard || !form.phoneNumber || !form.country) {
        setStatus("Please fill in all registration fields: Name, ID Card, Phone Number, and Country.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result =
        mode === "register"
          ? await registerPayLoopUser({
              email: form.email,
              password: form.password,
              displayName: form.name,
              role: activeRole.id,
              idCard: form.idCard,
              phoneNumber: form.phoneNumber,
              country: form.country,
            })
          : await loginPayLoopUser({
              email: form.email,
              password: form.password,
              fallbackRole: activeRole.id,
            });

      const savedRole = roleOptions.find((role) => role.id === result.role) || activeRole;
      window.localStorage.setItem("payloopRole", savedRole.id);
      router.push(savedRole.route);
    } catch (error) {
      setStatus(error.message || "Firebase login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="dashboard-shell min-h-screen px-4 py-8">
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-8">
        <div className="lg:sticky lg:top-12">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[7px] bg-[var(--accent)] font-black text-white">P</span>
            <span>
              <span className="block text-xl font-black">PayLoop</span>
              <span className="text-xs font-bold text-slate-500">Role-based dashboard access</span>
            </span>
          </Link>
          <p className="stat-label mb-3">Firebase Login / Register</p>
          <h1 className="max-w-xl text-4xl font-black tracking-normal sm:text-5xl">Choose your role before opening PayLoop.</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600">
            This screen creates or signs in a Firebase Authentication user, saves the role to Firestore, and redirects to the matching dashboard.
          </p>
          {!isFirebaseConfigured() && (
            <p className="mt-5 rounded-[7px] border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-700">
              Firebase config is missing. Add your Firebase web app values to .env.local, then restart the dashboard.
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <WalletButton compact />
            <Link className="button-secondary" href="/group-admin">Skip to Group Admin</Link>
          </div>
        </div>

        <form className="panel p-5" onSubmit={continueToDashboard}>
          <div className="mb-5">
            <h2 className="text-2xl font-black">Account access</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">Register a new user or sign in to an existing Firebase account.</p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-[7px] border border-[var(--border)] bg-slate-50 p-1">
            {["register", "login"].map((item) => (
              <button
                className={`min-h-10 rounded-[6px] text-sm font-black interactive-toggle ${mode === item ? "bg-white text-violet-700 shadow-sm" : "text-slate-500"}`}
                key={item}
                onClick={() => setMode(item)}
                type="button"
              >
                {item === "register" ? "Register" : "Login"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <label className="field">
                <span>Display name</span>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="John Kamau" />
              </label>
              <label className="field">
                <span>ID Card / National ID</span>
                <input value={form.idCard} onChange={(event) => updateField("idCard", event.target.value)} placeholder="12345678" />
              </label>
              <label className="field">
                <span>Phone Number</span>
                <input type="tel" value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="+254 700 000000" />
              </label>
              <label className="field">
                <span>Country</span>
                <select value={form.country} onChange={(event) => updateField("country", event.target.value)}>
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="Other">Other</option>
                </select>
              </label>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 mb-3">
            <label className="field">
              <span>Email</span>
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="user@payloop.test" />
            </label>
            <label className="field">
              <span>Password</span>
              <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="At least 6 characters" />
            </label>
          </div>

          {mode === "register" ? (
            <div className="mt-5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">Select Your Registration Role</span>
              <p className="text-xs font-medium text-slate-500 mb-3">Choose the role that matches your responsibilities. This will configure your dashboard access.</p>
              <div className="grid gap-3">
                {roleOptions.map((role) => (
                  <label
                    className={`grid cursor-pointer gap-2 rounded-[7px] border p-4 interactive-card ${
                      selectedRole === role.id ? "border-violet-500 bg-violet-50 shadow-sm" : "border-[var(--border)] bg-white hover:bg-slate-50"
                    }`}
                    key={role.id}
                  >
                    <span className="flex items-center gap-3">
                      <input className="h-4 w-4 accent-violet-600" checked={selectedRole === role.id} name="role" onChange={() => setSelectedRole(role.id)} type="radio" />
                      <strong className="text-lg">{role.role}</strong>
                      <span className="ml-auto text-xs font-black uppercase text-slate-400">{role.route}</span>
                    </span>
                    <span className="text-sm font-medium leading-6 text-slate-600">{role.description}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[7px] border border-violet-100 bg-violet-50 p-4">
              <h3 className="text-base font-black text-violet-800 mb-1">Automatic Redirection</h3>
              <p className="text-sm font-medium leading-6 text-violet-600">
                You will be automatically redirected to your assigned role's dashboard (<strong>Member, Treasurer, Group Admin, or Super Admin</strong>) based on your account's Firestore profile.
              </p>
              <p className="text-xs font-medium text-violet-500 mt-2">
                If your role is not yet configured, the system will use <span className="underline">{activeRole.role}</span> as a fallback. If you want to change the fallback role, select it below:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {roleOptions.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className={`px-3 py-1.5 rounded-[5px] text-xs font-black transition-all ${
                      selectedRole === role.id
                        ? "bg-violet-600 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-[var(--border)] hover:bg-slate-50 active:scale-95"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    Fallback: {role.role}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="button-primary mt-5 w-full" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Processing..." : mode === "register" ? `Register & Open ${activeRole.role} Dashboard` : "Login & Open My Dashboard"}
          </button>
          {status && <p className="mt-4 rounded-[7px] border border-[var(--border)] bg-slate-50 p-3 text-sm font-bold text-slate-600">{status}</p>}
        </form>
      </section>
    </main>
  );
}
