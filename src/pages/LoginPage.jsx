import { useState } from "react";

const API_BASE = "https://e-suratmasuk-production.up.railway.app";

const ROLE_ROUTES = {
  ADMIN:            "/dashboard/admin",
  VALIDATOR_KHUSUS: "/dashboard/validator-khusus",
  VALIDATOR_UMUM:   "/dashboard/validator-umum",
  APPROVER:         "/dashboard/approver",
  KATU:             "/dashboard/katu",
  STAFF:            "/dashboard/staff",
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = ({ open }) => open ? (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
    <path d="M19 12H5"/><path d="m12 5-7 7 7 7"/>
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-6 h-6">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ─── Success Popup ────────────────────────────────────────────────────────────
function SuccessPopup({ jabatan, username }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xs text-center overflow-hidden"
        style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Green header */}
        <div className="bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] px-6 pt-8 pb-6 relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-white/10" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border border-white/10" />
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white relative z-10">
            <IconCheck />
          </div>
          <p className="text-[#FEFFD3] text-sm font-medium relative z-10">Login Berhasil!</p>
          <h2 className="text-white text-xl font-black mt-0.5 relative z-10">Selamat Datang 👋</h2>
        </div>
        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-400 text-sm mb-1">Anda masuk sebagai</p>
          <p className="text-gray-900 font-black text-base">{jabatan || "Pengguna"}</p>
          {username && <p className="text-gray-400 text-xs mt-0.5 mb-4">@{username}</p>}
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #6D9E51, #4a7a36)",
                animation: "progressBar 2s linear forwards",
              }}
            />
          </div>
          <p className="text-gray-400 text-xs mt-2">Mengarahkan ke dashboard...</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main LoginPage ───────────────────────────────────────────────────────────
export default function LoginPage() {
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [successData, setSuccessData] = useState(null);

  const validate = () => {
    const e = {};
    if (!username.trim()) e.username = "Username wajib diisi";
    if (!password)        e.password = "Password wajib diisi";
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Username atau password salah");

      const token        = data.token || data.accessToken || data.data?.token;
      if (token) localStorage.setItem("authToken", token);

      const role         = data.role         || data.data?.role         || data.user?.role;
      const jabatan      = data.jabatan      || data.data?.jabatan      || data.user?.jabatan      || role || "Pengguna";
      const uname        = data.username     || data.data?.username     || data.user?.username     || username.trim();
      const redirectPath = ROLE_ROUTES[role] || "/dashboard";

      setSuccessData({ jabatan, username: uname, redirectPath });
      setTimeout(() => { window.location.href = redirectPath; }, 2200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }

        @keyframes fadeIn     { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp    { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        @keyframes popIn      { from { opacity:0; transform:scale(0.82) translateY(16px) } to { opacity:1; transform:scale(1) translateY(0) } }
        @keyframes progressBar { from { width:0% } to { width:100% } }
        @keyframes float      { 0%,100% { transform:translateY(0) rotate(-1deg) } 50% { transform:translateY(-14px) rotate(1deg) } }
        @keyframes shimmer    { 0% { background-position:-200% center } 100% { background-position:200% center } }

        .login-card { animation: slideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
        .float-img  { animation: float 5s ease-in-out infinite; }

        .field-wrap { position: relative; }
        .field-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#9ca3af; pointer-events:none; }
        .field-input {
          width:100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          padding: 11px 14px 11px 38px;
          font-size: 13.5px;
          font-weight: 500;
          background: #f9fafb;
          color: #111827;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
        }
        .field-input::placeholder { color: #d1d5db; font-weight: 400; }
        .field-input:focus {
          border-color: #6D9E51;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(109,158,81,0.13);
        }
        .field-input.err { border-color: #fca5a5; background: #fff8f8; }

        .submit-btn {
          width:100%;
          background: linear-gradient(90deg, #6D9E51, #4a7a36, #6D9E51);
          background-size: 200% auto;
          color: white;
          font-weight: 800;
          font-size: 14px;
          border: none;
          border-radius: 14px;
          padding: 13px;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          animation: shimmer 2.5s linear infinite;
        }
        .submit-btn:hover  { transform: translateY(-1.5px); box-shadow: 0 8px 24px rgba(109,158,81,0.32); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity:0.62; cursor:not-allowed; transform:none; animation:none; }
      `}</style>

      {/* ── Page background ── */}
      <div
        className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 55%, #ecfdf5 100%)" }}
      >
        {/* Decorative blobs */}
        <div className="absolute pointer-events-none" style={{ top: "-15%", left: "-10%", width: 420, height: 420, borderRadius: "50%", background: "rgba(109,158,81,0.09)", filter: "blur(60px)" }} />
        <div className="absolute pointer-events-none" style={{ bottom: "-10%", right: "-8%",  width: 480, height: 480, borderRadius: "50%", background: "rgba(188,217,162,0.15)", filter: "blur(70px)" }} />

        {/* ── Login card ── */}
        <div
          className="login-card relative w-full bg-white rounded-2xl sm:rounded-[28px] overflow-hidden"
          style={{
            maxWidth: 800,
            boxShadow: "0 24px 64px rgba(109,158,81,0.11), 0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <div className="flex flex-col sm:flex-row" style={{ minHeight: 0 }}>

            {/* ── LEFT: image panel ── */}
            <div
              className="hidden md:flex flex-col relative overflow-hidden md:w-[42%] flex-shrink-0"
              style={{ background: "linear-gradient(155deg, #6D9E51 0%, #4a7a36 50%, #355e28 100%)", minHeight: 460 }}
            >
              {/* Decorative rings */}
              <div className="absolute" style={{ top: "-60px", right: "-60px", width: 200, height: 200, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.1)" }} />
              <div className="absolute" style={{ bottom: "-80px", left: "-60px", width: 260, height: 260, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.08)" }} />

              {/* Logo strip */}
              <div className="relative z-10 flex items-center gap-2.5 px-6 pt-6">
                <div className="w-8 h-8 bg-white/20 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <img src="/logomts.png" alt="Logo"
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" class="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`; }} />
                </div>
                <span className="text-white font-black text-sm tracking-tight">e-SuratMasuk</span>
              </div>

              {/* Illustration — user supplies /login-illustration.png */}
              {/* Illustration pinned to bottom-left, peeking effect */}
              <div className="flex-1 flex items-end justify-start relative z-10">
                <div className="float-img" style={{ marginLeft: "-8px", maxWidth: 210 }}>
                  <img
                    src="/loginfix.png"
                    alt="Ilustrasi"
                    className="w-full h-auto object-contain"
                    style={{ filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.2))" }}
                    onError={e => {
                      e.target.parentElement.innerHTML = `
                        <div style="height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0.45;padding-left:16px">
                          <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
                            <circle cx="40" cy="28" r="16" stroke="white" strokeWidth="2"/>
                            <path d="M12 72c0-15.464 12.536-28 28-28s28 12.536 28 28" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                          <p style="color:rgba(255,255,255,0.5);font-size:11px;text-align:center;line-height:1.5">Letakkan gambar di<br/>/login-illustration.png</p>
                        </div>`;
                    }}
                  />
                </div>
              </div>

              {/* Bottom text */}
              <div className="relative z-10 px-6 pb-6 pt-4">
                <p className="text-white/40 text-xs leading-relaxed">
                  Sistem Manajemen Surat Masuk Digital<br/>
                  <span className="text-white/25">© 2025 e-SuratMasuk</span>
                </p>
              </div>
            </div>

            {/* ── RIGHT: form panel ── */}
            <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 md:px-10 py-8 sm:py-9">

              {/* Mobile green top bar */}
              <div className="md:hidden h-1.5 w-full rounded-full mb-6" style={{ background: "linear-gradient(90deg, #6D9E51, #4a7a36)" }} />
              {/* Mobile logo */}
              <div className="md:hidden flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0" style={{ background: "linear-gradient(135deg,#6D9E51,#4a7a36)" }}>
                  <img src="/logomts.png" alt="" className="w-full h-full object-cover"
                    onError={e => { e.target.style.display="none"; }} />
                </div>
                <span className="font-black text-gray-900 text-base tracking-tight">e-Surat<span style={{ color: "#6D9E51" }}>Masuk</span></span>
              </div>

              {/* Back link */}
              <a href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#6D9E51] transition-colors mb-5 group w-fit">
                <span className="group-hover:-translate-x-0.5 transition-transform"><IconArrowLeft /></span>
                Kembali ke Portal
              </a>

              {/* Heading */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-[26px] font-black text-gray-900 leading-tight mb-1.5">Masuk ke Sistem</h1>
                <p className="text-gray-400 text-sm">Halo! Masukkan kredensial Anda untuk lanjut.</p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5" style={{ animation: "slideUp 0.2s ease-out" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-4 h-4 flex-shrink-0 mt-px">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p className="text-red-600 text-xs font-semibold">{error}</p>
                </div>
              )}

              {/* Fields */}
              <div className="space-y-3.5 mb-5">
                {/* Username */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Username</label>
                  <div className="field-wrap">
                    <span className="field-icon"><IconUser /></span>
                    <input type="text" value={username}
                      onChange={e => { setUsername(e.target.value); setFieldErrors(p => ({ ...p, username: "" })); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                      placeholder="Masukkan username"
                      className={`field-input ${fieldErrors.username ? "err" : ""}`}
                    />
                  </div>
                  {fieldErrors.username && <p className="text-red-400 text-xs mt-1 ml-0.5">{fieldErrors.username}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="field-wrap">
                    <span className="field-icon"><IconLock /></span>
                    <input type={showPw ? "text" : "password"} value={password}
                      onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: "" })); setError(""); }}
                      onKeyDown={e => e.key === "Enter" && handleLogin()}
                      placeholder="Masukkan password"
                      className={`field-input ${fieldErrors.password ? "err" : ""}`}
                      style={{ paddingRight: 40 }}
                    />
                    <button type="button" onClick={() => setShowPw(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#6D9E51] transition-colors">
                      <IconEye open={showPw} />
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-400 text-xs mt-1 ml-0.5">{fieldErrors.password}</p>}
                </div>
              </div>

              {/* Submit */}
              <button className="submit-btn" onClick={handleLogin} disabled={loading}>
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Memproses...</>
                ) : (
                  <><IconLock />Masuk ke Sistem</>
                )}
              </button>

              {/* Footer */}
              <p className="text-center text-xs text-gray-400 mt-5 leading-relaxed">
                Akses hanya untuk petugas terdaftar.<br/>
                Hubungi Admin jika mengalami kendala masuk.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ── Success popup ── */}
      {successData && (
        <SuccessPopup jabatan={successData.jabatan} username={successData.username} />
      )}
    </>
  );
}