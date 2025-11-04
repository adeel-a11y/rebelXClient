import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import logo from "/favicon.png";
import { loginAccount } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  // toast state
  const [toast, setToast] = useState({ show: false, text: "", type: "success" });
  const showToast = (text, type = "success") => {
    setToast({ show: true, text, type });
    // 2 sec baad slide-out + hide
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      const msg = "Please enter both email and password.";
      setErrorMsg(msg);
      showToast(msg, "error"); // sirf submit par show hoga
      return;
    }

    setLoading(true);
    try {
      const res = await loginAccount({ email, password });
      if (res?.success) {
        if (res.token) localStorage.setItem("token", res.token);
        setSuccessMsg("Logged in successfully.");
        showToast("Welcome back! 🎉", "success"); // submit success par show
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        const msg = "Email Or Password incorrect OR Inactive User.";
        setErrorMsg(msg);
        showToast(msg, "error"); // submit error par show
      }
    } catch (err) {
      const msg = "Email Or Password incorrect.";
      setErrorMsg(msg);
      showToast(msg, "error"); // submit error par show
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 via-sky-100 to-sky-200">
      {/* Decorative soft rings */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-20%] top-[10%] h-[60rem] w-[60rem] rounded-full border border-white/40 opacity-40" />
        <div className="absolute left-[-10%] top-[18%] h-[52rem] w-[52rem] rounded-full border border-white/40 opacity-40" />
        <div className="absolute right-[-15%] top-[20%] h-[58rem] w-[58rem] rounded-full border border-white/40 opacity-40" />
        <div className="absolute right-[-5%] top-[28%] h-[50rem] w-[50rem] rounded-full border border-white/40 opacity-40" />
      </div>

      {/* Center card */}
      <div className="relative h-screen z-10 mx-auto flex max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="rounded-3xl border border-white/60 bg-white/60 p-8 shadow-xl backdrop-blur-md">
            {/* Floating icon */}
            <div className="-mt-14 mb-6 flex justify-center">
              <div className="h-14 w-14 p-2 rounded-2xl bg-white shadow-md">
                <img src={logo} alt="brand" className="h-full w-full object-contain" />
              </div>
            </div>

            <h1 className="text-center text-2xl font-semibold text-gray-900">
              Sign in with email
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Make a new doc to bring your words, data,
              <br className="hidden sm:block" /> and teams together. For free
            </p>

            {/* Alerts */}
            {errorMsg ? (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                {errorMsg}
              </div>
            ) : null}
            {successMsg ? (
              <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                {successMsg}
              </div>
            ) : null}

            {/* Form */}
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-200 bg-white/80 py-3 pl-11 pr-11 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-gray-500 hover:bg-gray-100"
                >
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  className="text-sm font-medium text-gray-700 underline-offset-2 hover:underline"
                  onClick={() => alert("Implement forgot password flow")}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <ClipLoader size={16} color="#fff" />}
                <span>{loading ? "Signing in..." : "Login"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom toast: default hidden, only shows on submit for 2s */}
      <div
        className={[
          "fixed inset-x-0 bottom-4 z-50 flex justify-center will-change-transform transition-all duration-500",
          toast.show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none",
        ].join(" ")}
        aria-live="polite"
        aria-hidden={!toast.show}
      >
        <div
          className={[
            "mx-4 rounded-2xl px-4 py-3 text-sm shadow-lg",
            toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white",
          ].join(" ")}
        >
          {toast.text}
        </div>
      </div>

      {/* Subtle bottom clouds effect */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-4rem] h-64 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.8),rgba(255,255,255,0)_60%)]" />
    </div>
  );
}
