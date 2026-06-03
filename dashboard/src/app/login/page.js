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
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const activeRole = roleOptions.find((role) => role.id === selectedRole) || roleOptions[0];

  function checkPasswordStrength(password) {
    if (!password) return { score: 0, label: "", color: "bg-slate-200", text: "text-slate-400" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-rose-500", text: "text-rose-500" };
    if (score <= 4) return { score, label: "Medium", color: "bg-amber-500", text: "text-amber-500" };
    return { score, label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" };
  }

  const passwordStrength = checkPasswordStrength(form.password);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleModeChange(newMode) {
    setMode(newMode);
    setStatus("");
    setSuccess("");
  }

  async function continueToDashboard(event) {
    event.preventDefault();
    setStatus("");
    setSuccess("");

    if (!form.email || !form.password) {
      setStatus("Enter an email and password.");
      return;
    }

    // Client-side validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setStatus("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setStatus("Password must be at least 6 characters long.");
      return;
    }

    if (mode === "register") {
      if (!form.name || !form.idCard || !form.phoneNumber || !form.country) {
        setStatus("Please fill in all registration fields.");
        return;
      }

      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      const cleanedPhone = form.phoneNumber.replace(/[\s-]/g, "");
      if (!phoneRegex.test(cleanedPhone)) {
        setStatus("Please enter a valid phone number with country code (e.g., +254700000000).");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === "register") {
        await registerPayLoopUser({
          email: form.email,
          password: form.password,
          displayName: form.name,
          role: activeRole.id,
          idCard: form.idCard,
          phoneNumber: form.phoneNumber,
          country: form.country,
        });

        setSuccess("Registration successful! Please log in with your credentials.");
        setMode("login");
        setForm((current) => ({ ...current, password: "" }));
      } else {
        const result = await loginPayLoopUser({
          email: form.email,
          password: form.password,
          fallbackRole: activeRole.id,
        });

        const savedRole = roleOptions.find((role) => role.id === result.role) || activeRole;
        window.localStorage.setItem("payloopRole", savedRole.id);
        router.push(savedRole.route);
      }
    } catch (error) {
      setStatus(error.message || "Firebase authentication failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="dashboard-shell min-h-screen px-4 py-8 relative overflow-hidden flex items-center justify-center transition-colors duration-300 dark:bg-[#090e1a]">
      {/* Background Floating Parallax Glow Orbs */}
      <div className="glow-orb glow-orb-primary w-[30rem] h-[30rem] top-[-10%] left-[-10%] animate-float-1 dark:opacity-20" />
      <div className="glow-orb glow-orb-secondary w-[30rem] h-[30rem] bottom-[-10%] right-[-10%] animate-float-2 dark:opacity-20" />
      <div className="glow-orb glow-orb-amber w-[25rem] h-[25rem] top-[40%] left-[60%] animate-float-rotate dark:opacity-10" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:py-8 animate-fade-in-up">
        <div className="lg:sticky lg:top-12">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-[7px] bg-[var(--accent)] font-black text-white shadow-md">P</span>
            <span>
              <span className="block text-xl font-black text-slate-800 dark:text-slate-100">PayLoop</span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Role-based dashboard access</span>
            </span>
          </Link>
          <p className="stat-label mb-3">Firebase Login / Register</p>
          <h1 className="max-w-xl text-4xl font-black tracking-normal sm:text-5xl text-slate-800 dark:text-slate-100">Choose your role before opening PayLoop.</h1>
          <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-slate-600 dark:text-slate-400">
            This screen creates or signs in a Firebase Authentication user, saves the role to Firestore, and redirects to the matching dashboard.
          </p>
          {!isFirebaseConfigured() && (
            <p className="mt-5 rounded-[7px] border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400">
              Firebase config is missing. Add your Firebase web app values to .env.local, then restart the dashboard.
            </p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <WalletButton compact />
            <Link className="button-secondary dark:border-slate-800" href="/group-admin">Skip to Group Admin</Link>
          </div>
        </div>

        <form className="panel glass-panel card-3d p-6 sm:p-8 border-slate-200 dark:border-slate-800" onSubmit={continueToDashboard}>
          <div className="mb-5">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Account access</h2>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">Register a new user or sign in to an existing Firebase account.</p>
          </div>

          <div className="mb-4 grid grid-cols-2 rounded-[7px] border border-[var(--border)] dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-1">
            {["register", "login"].map((item) => (
              <button
                className={`min-h-10 rounded-[6px] text-sm font-black interactive-toggle transition-all ${
                  mode === item 
                    ? "bg-white dark:bg-[#1e293b] text-violet-700 dark:text-violet-300 shadow-sm border border-slate-100 dark:border-slate-800" 
                    : "text-slate-500"
                }`}
                key={item}
                onClick={() => handleModeChange(item)}
                type="button"
              >
                {item === "register" ? "Register" : "Login"}
              </button>
            ))}
          </div>

          {mode === "register" && (
            <div className="mb-3 grid gap-3 sm:grid-cols-2">
              <label className="field">
                <span className="dark:text-slate-400">Display name</span>
                <input value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="John Kamau" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100" />
              </label>
              <label className="field">
                <span className="dark:text-slate-400">ID Card / National ID</span>
                <input value={form.idCard} onChange={(event) => updateField("idCard", event.target.value)} placeholder="12345678" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100" />
              </label>
              <label className="field">
                <span className="dark:text-slate-400">Phone Number</span>
                <input type="tel" value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} placeholder="+254 700 000000" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100" />
              </label>
              <label className="field">
                <span className="dark:text-slate-400">Country</span>
                <select value={form.country} onChange={(event) => updateField("country", event.target.value)} className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
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
              <span className="dark:text-slate-400">Email</span>
              <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="user@payloop.test" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100" />
            </label>
            <label className="field">
              <span className="dark:text-slate-400">Password</span>
              <input type="password" value={form.password} onChange={(event) => updateField("password", event.target.value)} placeholder="At least 6 characters" className="dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100" />
              {form.password && (
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-wider ${passwordStrength.text}`}>{passwordStrength.label}</span>
                </div>
              )}
            </label>
          </div>

          {mode === "register" ? (
            <div className="mt-5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">Select Your Registration Role</span>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">Choose the role that matches your responsibilities. This will configure your dashboard access.</p>
              <div className="grid gap-3">
                {roleOptions.map((role) => (
                  <label
                    className={`grid cursor-pointer gap-2 rounded-[7px] border p-4 interactive-card transition-all duration-200 ${
                      selectedRole === role.id 
                        ? "border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 shadow-sm" 
                        : "border-[var(--border)] dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    key={role.id}
                  >
                    <span className="flex flex-wrap items-center justify-between gap-2">
                      <span className="flex items-center gap-3">
                        <input className="h-4 w-4 accent-violet-600" checked={selectedRole === role.id} name="role" onChange={() => setSelectedRole(role.id)} type="radio" />
                        <strong className="text-base sm:text-lg text-slate-800 dark:text-slate-100">{role.role}</strong>
                      </span>
                      <span className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5">{role.route}</span>
                    </span>
                    <span className="text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">{role.description}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[7px] border border-violet-100 dark:border-violet-950 bg-violet-50 dark:bg-violet-950/20 p-4">
              <h3 className="text-base font-black text-violet-800 dark:text-violet-300 mb-1">Automatic Redirection</h3>
              <p className="text-sm font-medium leading-6 text-violet-600 dark:text-violet-400">
                You will be automatically redirected to your assigned role's dashboard (<strong>Member, Treasurer, Group Admin, or Super Admin</strong>) based on your account's Firestore profile.
              </p>
              <p className="text-xs font-medium text-violet-500 dark:text-violet-500 mt-2">
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
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-[var(--border)] dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    Fallback: {role.role}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button className="button-primary mt-6 w-full shadow-lg" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Processing..." : mode === "register" ? "Register Account" : "Login & Open My Dashboard"}
          </button>

          {success && (
            <div className="mt-4 rounded-[7px] border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900/20 p-3 text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{success}</span>
            </div>
          )}
          {status && (
            <div className="mt-4 rounded-[7px] border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-900/20 p-3 text-sm font-bold text-rose-800 dark:text-rose-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-50500 bg-rose-500 animate-pulse" />
              <span>{status}</span>
            </div>
          )}
        </form>
      </section>
    </main>
  );
}
