import { useState, useEffect, useRef, useCallback } from "react";

// ─── Utility: cn ────────────────────────────────────────────────────────────
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);
const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IconCopy = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconArrow = ({ dir = "right" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cn("w-5 h-5 transition-transform", dir === "right" && "group-hover:translate-x-1")}>
    {dir === "right" ? <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></> : <><path d="m19 12-7-7-7 7" /><path d="M12 19V5" /></>}
  </svg>
);
const IconWhatsapp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 13h6M9 17h6" />
  </svg>
);
const IconTicket = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
    <path d="M3 7v2a3 3 0 1 1 0 6v2c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
    <path d="M12 5v14" strokeDasharray="3 3" />
  </svg>
);
const IconFileText = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8M16 13H8M16 17H8" />
  </svg>
);
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
// Login icon (door with arrow)
const IconLogin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const API_BASE = "https://e-suratmasuk-production.up.railway.app";

// ─── Status mapping (covers all backend status values) ───────────────────────
const STATUS_MAP = {
  // backend exact values
  PENDING_VALIDATION: { label: "Menunggu Validasi", color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200" },
  VALIDATED:          { label: "Tervalidasi",        color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
  APPROVED:           { label: "Disetujui",          color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
  REJECTED:           { label: "Ditolak",            color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
  DONE:               { label: "Selesai",            color: "text-[#6D9E51]",  bg: "bg-[#FEFFD3]", border: "border-[#BCD9A2]" },
  COMPLETED:          { label: "Selesai",            color: "text-[#6D9E51]",  bg: "bg-[#FEFFD3]", border: "border-[#BCD9A2]" },
  // lowercase fallbacks
  pending:            { label: "Menunggu",           color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200" },
  processing:         { label: "Diproses",           color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200" },
  approved:           { label: "Disetujui",          color: "text-green-600",  bg: "bg-green-50",   border: "border-green-200" },
  rejected:           { label: "Ditolak",            color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200" },
  done:               { label: "Selesai",            color: "text-[#6D9E51]",  bg: "bg-[#FEFFD3]", border: "border-[#BCD9A2]" },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef();
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Floating Particles ───────────────────────────────────────────────────────
function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4,
    x: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.4 + 0.1,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-[#6D9E51]"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, bottom: "-10%",
            opacity: p.opacity,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Step Cards ───────────────────────────────────────────────────────────────
function StepCard({ num, title, desc, delay }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const rotations = [-6, 4, -3, 5];
  return (
    <div
      ref={ref}
      className="relative bg-white rounded-3xl p-7 shadow-2xl border border-[#BCD9A2]/40 transition-all duration-700 hover:rotate-0 hover:scale-105 hover:shadow-[0_20px_60px_rgba(109,158,81,0.2)] cursor-pointer"
      style={{
        transform: visible ? `rotate(${rotations[(num - 1) % 4]}deg)` : `translateY(80px) rotate(${rotations[(num - 1) % 4]}deg)`,
        opacity: visible ? 1 : 0,
        transition: `all 0.7s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms`,
      }}
    >
      <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-[#6D9E51] flex items-center justify-center shadow-lg">
        <span className="text-white font-black text-sm">0{num}</span>
      </div>
      <div className="absolute top-2 right-3 w-3 h-3 rounded-full bg-[#BCD9A2]" />
      <h3 className="text-2xl font-black text-gray-900 mb-3 mt-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ icon, title, desc }) {
  return (
    <div className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-[#6D9E51]/20 hover:border-[#6D9E51]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(109,158,81,0.2)]">
      <div className="text-[#BCD9A2] mb-4 group-hover:text-[#FEFFD3] group-hover:scale-110 transition-all duration-300 inline-block">{icon}</div>
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

// ─── Ticket Popup ─────────────────────────────────────────────────────────────
// FIX: scrollable overlay so top/bottom are never clipped
function TicketPopup({ data, onClose }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
    // Prevent body scroll while popup is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 400);
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      style={{
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.4s ease",
        padding: "24px 16px",
      }}
    >
      <div
        className="relative w-full max-w-md my-auto"
        style={{
          transform: visible ? "scale(1) translateY(0)" : "scale(0.8) translateY(40px)",
          transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full pointer-events-none"
            style={{
              background: ["#6D9E51", "#BCD9A2", "#FEFFD3", "#fff"][i % 4],
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `confettiFall 1s ${i * 0.1}s ease-out forwards`,
              opacity: 0,
            }}
          />
        ))}

        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] px-8 pt-8 pb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute w-32 h-32 rounded-full border-2 border-white"
                  style={{ top: `${i * 20 - 30}%`, right: `${i * 15 - 20}%` }} />
              ))}
            </div>
            <button onClick={handleClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
              <IconX />
            </button>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <IconTicket />
              </div>
              <div>
                <p className="text-[#FEFFD3] text-sm font-medium">Surat berhasil dikirim! 🎉</p>
                <h2 className="text-white text-xl font-black">Tiket Pengiriman</h2>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-2xl p-4 relative z-10">
              <p className="text-[#FEFFD3] text-xs font-medium mb-1">Nomor Antrian / Tracking ID</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-black text-xl tracking-wider">
                  {data.trackingId || data._id?.slice(-8).toUpperCase() || "TRK-XXXXX"}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs rounded-lg px-3 py-1.5 transition-all"
                >
                  {copied ? <IconCheck /> : <IconCopy />}
                  {copied ? "Disalin!" : "Salin"}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center">
            <div className="w-6 h-6 bg-gray-100 rounded-full -ml-3" />
            <div className="flex-1 border-t-2 border-dashed border-[#BCD9A2]" />
            <div className="w-6 h-6 bg-gray-100 rounded-full -mr-3" />
          </div>

          {/* Body */}
          <div className="px-8 py-6 bg-[#FEFFD3]/20">
            <div className="space-y-4">
              {[
                { icon: <IconUser />, label: "Nama Pengirim", value: data.namaPengirim },
                { icon: <IconMail />, label: "Email", value: data.emailPengirim },
                { icon: <IconWhatsapp />, label: "WhatsApp", value: data.waPengirim },
                { icon: <IconBuilding />, label: "Instansi", value: data.instansi },
                { icon: <IconFileText />, label: "File Surat", value: data.fileName || "Dokumen PDF" },
                { icon: <IconClock />, label: "Tanggal Kirim", value: formatDate() },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3" style={{ animation: `slideInRight 0.4s ${0.1 + i * 0.08}s ease-out both` }}>
                  <div className="text-[#6D9E51] flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">{item.label}</p>
                    <p className="text-gray-800 font-semibold text-sm truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-[#6D9E51]/10 border border-[#6D9E51]/30 rounded-2xl p-4 flex items-center gap-3" style={{ animation: "slideInRight 0.4s 0.7s ease-out both" }}>
              <div className="w-8 h-8 bg-[#6D9E51] rounded-full flex items-center justify-center flex-shrink-0">
                <IconCheck />
              </div>
              <div>
                <p className="text-[#4a7a36] font-bold text-sm">Surat Sedang Diproses</p>
                <p className="text-gray-500 text-xs">Gunakan Tracking ID untuk memantau status surat Anda</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 pb-8">
            <button onClick={handleClose} className="w-full bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold py-4 rounded-2xl hover:shadow-[0_8px_30px_rgba(109,158,81,0.4)] transition-all hover:-translate-y-0.5 active:translate-y-0">
              Tutup &amp; Lacak Surat Saya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tracking Status Widget ───────────────────────────────────────────────────
// FIX: response structure is data.data (not data directly), status mapping updated
function TrackingWidget() {
  const [trackId, setTrackId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    if (!trackId.trim()) { setError("Masukkan Tracking ID terlebih dahulu"); return; }
    setLoading(true); setError(""); setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/surat/track/${trackId.trim()}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Surat tidak ditemukan");
      // Handle both { data: {...} } and flat response shapes
      const payload = json.data || json;
      setResult(payload);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const st = result?.status ? (STATUS_MAP[result.status] || STATUS_MAP.pending) : null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#BCD9A2]/30">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <input
            value={trackId}
            onChange={(e) => { setTrackId(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            placeholder="Masukkan Tracking ID (misal: 1B02DEF23B)"
            className="w-full border-2 border-[#BCD9A2] rounded-2xl py-4 px-5 outline-none focus:border-[#6D9E51] transition-colors text-gray-700 placeholder:text-gray-300 pr-12"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#BCD9A2]"><IconSearch /></div>
        </div>
        <button
          onClick={handleTrack}
          disabled={loading}
          className="bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white px-6 py-4 rounded-2xl font-bold hover:shadow-[0_8px_30px_rgba(109,158,81,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 whitespace-nowrap"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : "Cek Status"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium mb-4">
          ⚠️ {error}
        </div>
      )}

      {result && st && (
        <div className={cn("border-2 rounded-2xl p-5 transition-all", st.bg, st.border)}>
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <p className="text-xs text-gray-500 mb-1">Tracking ID</p>
              <p className="font-black text-gray-800 text-lg">{result.trackingId || trackId}</p>
            </div>
            <span className={cn("px-4 py-1.5 rounded-full text-sm font-bold border", st.bg, st.border, st.color)}>
              {st.label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {result.nomorSurat && <div><p className="text-gray-400 text-xs">Nomor Surat</p><p className="font-semibold text-gray-700">{result.nomorSurat}</p></div>}
            {result.instansi && <div><p className="text-gray-400 text-xs">Instansi</p><p className="font-semibold text-gray-700">{result.instansi}</p></div>}
            {result.namaPengirim && <div className="col-span-2"><p className="text-gray-400 text-xs">Pengirim</p><p className="font-semibold text-gray-700">{result.namaPengirim}</p></div>}
            {result.emailPengirim && <div className="col-span-2"><p className="text-gray-400 text-xs">Email</p><p className="font-semibold text-gray-700">{result.emailPengirim}</p></div>}
            {result.updatedAt && (
              <div className="col-span-2">
                <p className="text-gray-400 text-xs">Terakhir Diperbarui</p>
                <p className="font-semibold text-gray-700">
                  {new Date(result.updatedAt).toLocaleString("id-ID", { dateStyle: "long", timeStyle: "short" })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({ name, label, type = "text", placeholder, icon, value, error, onChange }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6D9E51]">{icon}</div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={cn(
            "w-full border-2 rounded-2xl py-4 pl-12 pr-5 outline-none transition-all text-gray-700 placeholder:text-gray-300",
            error ? "border-red-300 bg-red-50" : "border-gray-200 focus:border-[#6D9E51] focus:bg-[#FEFFD3]/30"
          )}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
}

// ─── Submit Form ──────────────────────────────────────────────────────────────
// FIX: accept resetKey prop so parent can force reset after ticket closed
function SubmitForm({ onSuccess, resetKey }) {
  const [namaPengirim, setNamaPengirim] = useState("");
  const [emailPengirim, setEmailPengirim] = useState("");
  const [waPengirim, setWaPengirim] = useState("");
  const [instansi, setInstansi] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  // Reset all fields when resetKey changes
  useEffect(() => {
    setNamaPengirim("");
    setEmailPengirim("");
    setWaPengirim("");
    setInstansi("");
    setFile(null);
    setErrors({});
  }, [resetKey]);

  const validate = () => {
    const e = {};
    if (!namaPengirim.trim()) e.namaPengirim = "Nama wajib diisi";
    if (!emailPengirim.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.emailPengirim = "Email tidak valid";
    if (!waPengirim.trim()) e.waPengirim = "Nomor WhatsApp wajib diisi";
    if (!instansi.trim()) e.instansi = "Instansi wajib diisi";
    if (!file) e.file = "File PDF wajib diunggah";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("namaPengirim", namaPengirim);
      fd.append("emailPengirim", emailPengirim);
      fd.append("waPengirim", waPengirim);
      fd.append("instansi", instansi);
      fd.append("file", file);
      const res = await fetch(`${API_BASE}/api/surat/submit`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal mengirim surat");
      // Pass form data + response to parent
      onSuccess({ namaPengirim, emailPengirim, waPengirim, instansi, fileName: file.name, ...data });
    } catch (e) {
      setErrors(prev => ({ ...prev, submit: e.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <FormField
        name="namaPengirim" label="Nama Lengkap" placeholder="Masukkan nama lengkap Anda"
        icon={<IconUser />} value={namaPengirim} error={errors.namaPengirim}
        onChange={(e) => { setNamaPengirim(e.target.value); setErrors(prev => ({ ...prev, namaPengirim: "" })); }}
      />
      <FormField
        name="emailPengirim" label="Alamat Email" type="email" placeholder="contoh@email.com"
        icon={<IconMail />} value={emailPengirim} error={errors.emailPengirim}
        onChange={(e) => { setEmailPengirim(e.target.value); setErrors(prev => ({ ...prev, emailPengirim: "" })); }}
      />
      <FormField
        name="waPengirim" label="Nomor WhatsApp" placeholder="08xxxxxxxxxx"
        icon={<IconWhatsapp />} value={waPengirim} error={errors.waPengirim}
        onChange={(e) => { setWaPengirim(e.target.value); setErrors(prev => ({ ...prev, waPengirim: "" })); }}
      />
      <FormField
        name="instansi" label="Instansi / Organisasi" placeholder="Nama instansi Anda"
        icon={<IconBuilding />} value={instansi} error={errors.instansi}
        onChange={(e) => { setInstansi(e.target.value); setErrors(prev => ({ ...prev, instansi: "" })); }}
      />

      {/* File Drop */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Lampiran Surat (PDF)</label>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setDragOver(false);
            const f = e.dataTransfer.files[0];
            if (f?.type === "application/pdf") { setFile(f); setErrors(prev => ({ ...prev, file: "" })); }
          }}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all",
            dragOver ? "border-[#6D9E51] bg-[#6D9E51]/10 scale-[1.02]" : "",
            file ? "border-[#6D9E51] bg-[#FEFFD3]/40" : "border-gray-200 hover:border-[#BCD9A2] hover:bg-[#FEFFD3]/20",
            errors.file ? "border-red-300 bg-red-50" : ""
          )}
        >
          <input ref={fileRef} type="file" accept=".pdf" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setErrors(prev => ({ ...prev, file: "" })); } }} />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-[#6D9E51]/20 rounded-xl flex items-center justify-center text-[#6D9E51]"><IconFileText /></div>
              <div className="text-left">
                <p className="font-semibold text-[#4a7a36] text-sm">{file.name}</p>
                <p className="text-gray-400 text-xs">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-gray-400 hover:text-red-400"><IconX /></button>
            </div>
          ) : (
            <div>
              <div className="w-12 h-12 bg-[#BCD9A2]/40 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#6D9E51]"><IconUpload /></div>
              <p className="font-semibold text-gray-600 text-sm">Seret file ke sini atau klik untuk pilih</p>
              <p className="text-gray-400 text-xs mt-1">Format PDF, maksimal 2MB</p>
            </div>
          )}
        </div>
        {errors.file && <p className="text-red-500 text-xs mt-1 ml-1">{errors.file}</p>}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          ⚠️ {errors.submit}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold py-5 rounded-2xl text-lg hover:shadow-[0_12px_40px_rgba(109,158,81,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:translate-y-0 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengirim...</>
        ) : (
          <><IconMail /> Kirim Surat Sekarang</>
        )}
      </button>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Budi Santoso", role: "Staf Kelurahan Tampan", text: "Pengiriman surat sekarang jadi sangat mudah. Tidak perlu datang ke kantor lagi, cukup unggah dari rumah.", stars: 5 },
  { name: "Sari Dewi", role: "Pegawai Swasta", text: "Tracking ID sangat membantu! Saya bisa pantau status surat kapan saja dan di mana saja.", stars: 5 },
  { name: "Ahmad Fauzi", role: "Mahasiswa UNRI", text: "Sistemnya mudah dipahami. Form pengisian juga tidak ribet dan hasilnya cepat diproses.", stars: 5 },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ activeSection }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["Beranda", "Tentang", "Cara Kerja", "Layanan", "Kirim Surat", "Lacak Surat"];
  const anchors = ["hero", "about", "howto", "services", "submit", "track"];

  const goToLogin = () => {
    window.location.href = "/login";
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-500",
      scrolled ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-[#6D9E51]/10 py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/logomts.png"
              alt="e-SuratMasuk Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" class="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
              }}
            />
          </div>
          <span className="font-black text-gray-900 text-xl tracking-tight">e-Surat<span className="text-[#6D9E51]">Masuk</span></span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l, i) => (
            <button
              key={l}
              onClick={() => { document.getElementById(anchors[i])?.scrollIntoView({ behavior: "smooth" }); }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                activeSection === anchors[i]
                  ? "bg-[#6D9E51] text-white shadow-md"
                  : "text-gray-600 hover:text-[#6D9E51] hover:bg-[#FEFFD3]"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Login Button with icon */}
        <button
          onClick={goToLogin}
          className="hidden md:flex items-center gap-2 bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          <IconLogin />
          Login
        </button>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#FEFFD3] transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <div className="w-5 h-4 flex flex-col justify-between">
            <span className="block h-0.5 bg-gray-700 rounded-full origin-center transition-all duration-300 ease-in-out"
              style={{ transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
            <span className="block h-0.5 bg-gray-700 rounded-full transition-all duration-200 ease-in-out"
              style={{ opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? "scaleX(0)" : "scaleX(1)" }} />
            <span className="block h-0.5 bg-gray-700 rounded-full origin-center transition-all duration-300 ease-in-out"
              style={{ transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
          </div>
        </button>
      </div>

      {/* Mobile Menu — always rendered, animated via max-height + opacity */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: mobileOpen ? "480px" : "0px",
          opacity:   mobileOpen ? 1 : 0,
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl px-4 pt-3 pb-4 space-y-1">
          {links.map((l, i) => (
            <button
              key={l}
              className="flex items-center w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-[#FEFFD3] hover:text-[#6D9E51] font-semibold transition-all duration-200 text-sm"
              style={{
                transitionDelay: mobileOpen ? `${i * 40}ms` : "0ms",
                transform: mobileOpen ? "translateX(0)" : "translateX(-8px)",
                opacity:   mobileOpen ? 1 : 0,
              }}
              onClick={() => {
                document.getElementById(anchors[i])?.scrollIntoView({ behavior: "smooth" });
                setMobileOpen(false);
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#6D9E51] mr-3 flex-shrink-0" />
              {l}
            </button>
          ))}
          <button
            className="flex items-center gap-2 w-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold text-sm transition-all duration-200 mt-1 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              transitionDelay: mobileOpen ? `${links.length * 40}ms` : "0ms",
              transform: mobileOpen ? "translateX(0)" : "translateX(-8px)",
              opacity:   mobileOpen ? 1 : 0,
            }}
            onClick={() => { goToLogin(); setMobileOpen(false); }}
          >
            <IconLogin />
            Login ke Sistem
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function PortalPublic() {
  const [ticket, setTicket] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  // FIX: increment to trigger form reset after ticket is closed
  const [formResetKey, setFormResetKey] = useState(0);

  useEffect(() => {
    const sections = ["hero", "about", "howto", "services", "submit", "track"];
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const handleCloseTicket = () => {
    setTicket(null);
    // Increment key → SubmitForm useEffect fires → fields cleared
    setFormResetKey(k => k + 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        h1, h2, h3 { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 0.5; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(60px) rotate(180deg); opacity: 0; }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(109,158,81,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 12px rgba(109,158,81,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(109,158,81,0); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .hero-title { font-size: clamp(2rem, 6vw, 5rem); line-height: 1.05; font-weight: 900; letter-spacing: -0.03em; }
        .gradient-text { background: linear-gradient(135deg, #6D9E51, #4a7a36, #BCD9A2); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: gradient-x 4s ease infinite; }
        .float-anim { animation: float 4s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite; }
        .shimmer { position: relative; overflow: hidden; }
        .shimmer::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 2s infinite; }
        section { scroll-margin-top: 80px; }
      `}</style>

      {ticket && <TicketPopup data={ticket} onClose={handleCloseTicket} />}
      <Navbar activeSection={activeSection} />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-[#FEFFD3]/30 to-[#BCD9A2]/20 pt-5">
        <Particles />
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#6D9E51]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#6D9E51]/10 border border-[#6D9E51]/20 rounded-full px-5 py-2 text-sm font-semibold text-[#4a7a36] mb-8">
              <span className="w-2 h-2 bg-[#6D9E51] rounded-full inline-block" style={{ animation: "pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite" }} />
              Portal Surat Masuk Digital
            </div>
            <h1 className="hero-title text-gray-900 mb-6">
              Kirim Surat<br />
              <span className="gradient-text">Resmi</span> Lebih<br />
              Mudah &amp; Cepat
            </h1>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
              Platform digital untuk pengiriman dan pelacakan surat masuk secara real-time.
              Tidak perlu antri, cukup upload dari mana saja kapan saja.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <button
                onClick={() => document.getElementById("submit")?.scrollIntoView({ behavior: "smooth" })}
                className="group flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_12px_40px_rgba(109,158,81,0.4)] transition-all hover:-translate-y-1"
              >
                Kirim Surat Sekarang <IconArrow />
              </button>
              <button
                onClick={() => document.getElementById("track")?.scrollIntoView({ behavior: "smooth" })}
                className="flex items-center justify-center gap-2.5 border-2 border-[#6D9E51] text-[#6D9E51] px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#FEFFD3] transition-all"
              >
                <IconSearch /> Lacak Surat
              </button>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative flex items-center justify-center mt-8 lg:mt-0">
            <div className="relative">
              <div className="float-anim absolute -top-8 -left-4 sm:-left-12 bg-white rounded-2xl p-4 shadow-xl border border-[#BCD9A2]/40 z-10">
                <p className="text-[#6D9E51] font-black text-2xl"><AnimatedCounter end={250} suffix="+" /></p>
                <p className="text-gray-500 text-xs font-medium">Surat Terkirim</p>
              </div>
              <div className="float-anim absolute -bottom-8 -right-4 sm:-right-12 bg-white rounded-2xl p-4 shadow-xl border border-[#BCD9A2]/40 z-10" style={{ animationDelay: "1s" }}>
                <p className="text-[#6D9E51] font-black text-2xl"><AnimatedCounter end={98} suffix="%" /></p>
                <p className="text-gray-500 text-xs font-medium">Tingkat Keberhasilan</p>
              </div>
              <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-[3rem] p-1 shadow-[0_30px_80px_rgba(109,158,81,0.3)] rotate-3 hover:rotate-0 transition-all duration-500 overflow-hidden">
                <div className="w-full h-full rounded-[2.8rem] overflow-hidden">
                  <img
                    src="/mts.jpg"
                    alt="Upload Surat"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.parentElement.innerHTML = `
                        <div style="width:100%;height:100%;background:white;border-radius:2.8rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;padding:2rem;">
                          <div style="width:6rem;height:6rem;background:linear-gradient(135deg,rgba(109,158,81,0.2),rgba(188,217,162,0.4));border-radius:1.5rem;display:flex;align-items:center;justify-content:center;">
                            <div style="width:3.5rem;height:3.5rem;background:linear-gradient(135deg,#6D9E51,#4a7a36);border-radius:1rem;display:flex;align-items:center;justify-content:center;">
                              <svg viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.5' width='32' height='32'><path d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'/><polyline points='14 2 14 8 20 8'/></svg>
                            </div>
                          </div>
                          <div style="text-align:center;">
                            <p style="font-weight:900;color:#1f2937;font-size:1.125rem;">Upload Surat</p>
                            <p style="color:#9ca3af;font-size:0.875rem;">Format PDF, mudah &amp; aman</p>
                          </div>
                          <div style="width:100%;background:#FEFFD3;border-radius:0.75rem;padding:0.625rem 1rem;display:flex;align-items:center;gap:0.5rem;">
                            <div style="width:0.5rem;height:0.5rem;background:#6D9E51;border-radius:50%;"></div>
                            <span style="color:#4a7a36;font-size:0.75rem;font-weight:600;">Sedang diproses...</span>
                          </div>
                        </div>`;
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[#BCD9A2]/30 bg-white/60 backdrop-blur py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-6 sm:gap-8 overflow-x-auto" />
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#FEFFD3] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative">
          <div>
            <span className="inline-block bg-[#FEFFD3] border border-[#BCD9A2] text-[#6D9E51] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Tentang Kami</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-6">
              Portal Surat Masuk<br />
              <span className="gradient-text">Pemerintah Digital</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-base sm:text-lg mb-8">
              Kami hadir sebagai solusi modern untuk pengiriman dan manajemen surat masuk instansi pemerintah.
              Dengan teknologi terkini, kami memastikan setiap surat terproses dengan tepat, cepat, dan dapat dilacak secara real-time.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {[
                { num: 40, suffix: "%", desc: "Peningkatan efisiensi proses surat" },
                { num: 2, suffix: "x", desc: "Lebih cepat dari proses manual" },
                { num: 100, suffix: "%", desc: "Digital & ramah lingkungan" },
                { num: 24, suffix: "/7", desc: "Sistem tersedia sepanjang waktu" },
              ].map((s, i) => (
                <div key={i} className="bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-2xl p-4 sm:p-5 text-white hover:shadow-[0_8px_30px_rgba(109,158,81,0.3)] transition-all hover:-translate-y-1">
                  <p className="text-2xl sm:text-3xl font-black mb-1"><AnimatedCounter end={s.num} suffix={s.suffix} /></p>
                  <p className="text-[#BCD9A2] text-xs sm:text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {[
                { bg: "from-[#6D9E51]/20 to-[#BCD9A2]/20", icon: "🗂️", title: "Arsip Digital", desc: "Semua surat tersimpan aman dan terstruktur" },
                { bg: "from-[#FEFFD3] to-[#BCD9A2]/30", icon: "🔍", title: "Lacak Real-time", desc: "Pantau status surat kapan saja" },
                { bg: "from-[#FEFFD3] to-[#BCD9A2]/30", icon: "⚡", title: "Proses Cepat", desc: "Respon lebih cepat dari sistem manual" },
                { bg: "from-[#6D9E51]/20 to-[#BCD9A2]/20", icon: "🔒", title: "Aman & Terpercaya", desc: "Data surat Anda dijaga kerahasiaannya" },
              ].map((c, i) => (
                <div key={i} className={cn("bg-gradient-to-br rounded-2xl p-4 sm:p-5 hover:shadow-lg transition-all hover:-translate-y-1", c.bg)}>
                  <div className="text-2xl sm:text-3xl mb-3">{c.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-1 text-sm sm:text-base">{c.title}</h4>
                  <p className="text-gray-500 text-xs sm:text-sm">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="howto" className="py-20 sm:py-32 bg-gradient-to-b from-[#FEFFD3]/40 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#6D9E51 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-block bg-[#FEFFD3] border border-[#BCD9A2] text-[#6D9E51] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Cara Kerja</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Cara kami memproses<br /><span className="gradient-text">surat Anda</span></h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">Hanya 4 langkah mudah untuk mengirim dan memantau surat Anda</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-[#BCD9A2] -translate-y-1/2 z-0" />
            {[
              { title: "Isi Formulir", desc: "Lengkapi data diri Anda: nama, email, WhatsApp, dan instansi dengan benar." },
              { title: "Unggah Surat", desc: "Upload file PDF surat Anda yang sudah disiapkan. Pastikan file jelas dan terbaca." },
              { title: "Konfirmasi", desc: "Dapatkan Tracking ID otomatis sebagai bukti pengiriman dan nomor antrian Anda." },
              { title: "Pantau Status", desc: "Gunakan Tracking ID untuk memantau proses review surat Anda secara real-time." },
            ].map((s, i) => (
              <StepCard key={i} num={i + 1} title={s.title} desc={s.desc} delay={i * 120} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 sm:py-32 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(#6D9E51 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#6D9E51]/20 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-12 sm:mb-16">
            <div>
              <span className="inline-block bg-[#6D9E51]/20 border border-[#6D9E51]/30 text-[#BCD9A2] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Layanan Kami</span>
              <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
                Kami kelola surat Anda<br />
                <span className="gradient-text">dengan profesional</span>
              </h2>
            </div>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
              Platform kami menyediakan berbagai fitur untuk memastikan surat masuk diproses dengan efisien dan transparan.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <IconMail />, title: "Penerimaan Surat Digital", desc: "Upload surat dalam format PDF dengan mudah dari mana saja tanpa perlu datang ke kantor." },
              { icon: <IconSearch />, title: "Pelacakan Real-time", desc: "Pantau status surat Anda secara langsung menggunakan Tracking ID unik yang diberikan sistem." },
              { icon: <IconFileText />, title: "Manajemen Dokumen", desc: "Semua dokumen tersimpan terorganisir dan aman dalam sistem arsip digital kami." },
              { icon: <IconClock />, title: "Notifikasi Status", desc: "Dapatkan informasi terkini mengenai perkembangan proses surat Anda secara transparan." },
              { icon: <IconBuilding />, title: "Multi-Instansi", desc: "Mendukung berbagai instansi dan organisasi dalam satu platform terintegrasi." },
              { icon: <IconCheck />, title: "Verifikasi & Validasi", desc: "Setiap surat diverifikasi oleh petugas terlatih untuk memastikan kelengkapan berkas." },
            ].map((s, i) => (
              <ServiceCard key={i} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBMIT FORM ─────────────────────────────────────────────────────── */}
      <section id="submit" className="py-20 sm:py-32 bg-gradient-to-br from-[#FEFFD3]/50 via-white to-[#BCD9A2]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#6D9E51]/10 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#BCD9A2]/20 rounded-full -translate-x-1/3 translate-y-1/3" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-[#FEFFD3] border border-[#BCD9A2] text-[#6D9E51] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Kirim Surat</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Kirim Surat Anda<br /><span className="gradient-text">Sekarang Juga</span></h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">Lengkapi formulir di bawah ini untuk mengirimkan surat kepada instansi terkait</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 max-w-6xl mx-auto">
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#BCD9A2]/30">
              <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-xl flex items-center justify-center text-white">
                  <IconMail />
                </div>
                Formulir Pengiriman
              </h3>
              <SubmitForm onSuccess={setTicket} resetKey={formResetKey} />
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-3xl p-6 sm:p-7 text-white">
                <h4 className="font-black text-xl mb-4">Informasi Penting</h4>
                <ul className="space-y-3">
                  {[
                    "File harus dalam format PDF",
                    "Ukuran maksimal file adalah 2MB",
                    "Pastikan data diri terisi dengan benar",
                    "Simpan Tracking ID untuk pelacakan",
                    "Surat diproses dalam 1-3 hari kerja",
                    "Surat balasan akan dikirim ke email Anda",
                  ].map((info, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#FEFFD3]">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-white">
                        <IconCheck />
                      </div>
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#BCD9A2]/30 shadow-lg">
                <h4 className="font-black text-gray-900 mb-4">Butuh Bantuan?</h4>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: <IconPhone />, label: "Telepon", val: "(0761) 38757" },
                    { icon: <IconMail />, label: "Email", val: "tatausaha.mtsn1pku@gmail.com" },
                    { icon: <IconMapPin />, label: "Alamat", val: "Jl. Amal Hamzah No.1, Cinta Raja, Kec. Sail, Kota Pekanbaru, Riau 28127" },
                    { icon: <IconClock />, label: "Jam Kerja", val: "Senin-Jumat, 07.00-17.00" },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="text-[#6D9E51]">{c.icon}</div>
                      <div>
                        <p className="text-gray-400 text-xs">{c.label}</p>
                        <p className="font-semibold text-gray-700">{c.val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRACKING ────────────────────────────────────────────────────────── */}
      <section id="track" className="py-20 sm:py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(#6D9E51 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-[#FEFFD3] border border-[#BCD9A2] text-[#6D9E51] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Pelacakan Surat</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Lacak Status<br /><span className="gradient-text">Surat Anda</span></h2>
            <p className="text-gray-500 text-base sm:text-lg max-w-xl mx-auto">Masukkan Tracking ID yang Anda terima saat pengiriman untuk memantau progres surat</p>
          </div>
          <TrackingWidget />

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Menunggu Validasi", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
              { label: "Tervalidasi",       color: "bg-blue-100 text-blue-700 border-blue-200" },
              { label: "Disetujui",         color: "bg-green-100 text-green-700 border-green-200" },
              { label: "Ditolak",           color: "bg-red-100 text-red-700 border-red-200" },
              { label: "Selesai",           color: "bg-[#FEFFD3] text-[#4a7a36] border-[#BCD9A2]" },
            ].map((s, i) => (
              <div key={i} className={cn("border rounded-xl px-3 py-2 text-xs font-semibold text-center", s.color)}>{s.label}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-[#FEFFD3]/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block bg-[#FEFFD3] border border-[#BCD9A2] text-[#6D9E51] text-sm font-bold px-4 py-1.5 rounded-full mb-6">Testimoni</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900">Apa kata pengguna<br /><span className="gradient-text">kami?</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 sm:p-7 shadow-lg border border-[#BCD9A2]/30 hover:shadow-[0_12px_40px_rgba(109,158,81,0.1)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex gap-1 mb-4">{[...Array(t.stars)].map((_, j) => <IconStar key={j} />)}</div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-full flex items-center justify-center text-white font-bold">{t.name[0]}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-24 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6D9E51]/30 to-transparent" />
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#6D9E51]/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Mulai kirim surat Anda<br /><span className="gradient-text">hari ini!</span></h2>
          <p className="text-gray-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">Bergabung dengan ratusan warga yang telah merasakan kemudahan layanan surat digital kami.</p>
          <button
            onClick={() => document.getElementById("submit")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl hover:shadow-[0_20px_60px_rgba(109,158,81,0.4)] transition-all hover:-translate-y-1 shimmer"
          >
            Kirim Surat Sekarang <IconArrow />
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 text-gray-400 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">

            {/* Brand col */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src="/logomts.png"
                    alt="Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" class="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`; }}
                  />
                </div>
                <span className="font-black text-white text-xl">e-SuratMasuk</span>
              </div>
              <p className="text-sm leading-relaxed">Portal digital pengiriman surat masuk digital MTsN 1 Kota Pekanbaru. Efisien, transparan, dan modern.</p>
            </div>

            {/* Navigasi col — scroll to section */}
            <div>
              <h5 className="text-white font-bold mb-4">Navigasi</h5>
              <ul className="space-y-2">
                {[
                  { label: "Beranda",     anchor: "hero"     },
                  { label: "Tentang Kami",anchor: "about"    },
                  { label: "Cara Kerja",  anchor: "howto"    },
                  { label: "Layanan",     anchor: "services" },
                ].map(({ label, anchor }) => (
                  <li key={anchor}>
                    <button
                      onClick={() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })}
                      className="text-sm hover:text-[#6D9E51] transition-colors text-left"
                    >
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Layanan col — scroll to section */}
            <div>
              <h5 className="text-white font-bold mb-4">Layanan</h5>
              <ul className="space-y-2">
                {[
                  { label: "Kirim Surat", anchor: "submit" },
                  { label: "Lacak Surat", anchor: "track"  },
                  { label: "Login Sistem", anchor: null, href: "/login" },
                ].map(({ label, anchor, href }) => (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="text-sm hover:text-[#6D9E51] transition-colors">{label}</a>
                    ) : (
                      <button
                        onClick={() => document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" })}
                        className="text-sm hover:text-[#6D9E51] transition-colors text-left"
                      >
                        {label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Kontak col — plain text, no scroll needed */}
            <div>
              <h5 className="text-white font-bold mb-4">Kontak</h5>
              <ul className="space-y-2.5">
                {[
                  { icon: <IconPhone />, val: "(0761) 38757" },
                  { icon: <IconMail />,  val: "tatausaha.mtsn1pku@gmail.com" },
                  { icon: <IconMapPin />,val: "Jl. Amal Hamzah No.1, Cinta Raja, Kec. Sail, Kota Pekanbaru, Riau 28127" },
                  { icon: <IconClock />, val: "Senin–Jumat, 07.00–17.00" },
                ].map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-[#6D9E51] flex-shrink-0 mt-0.5">{c.icon}</span>
                    <span className="leading-snug">{c.val}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-sm">© 2025 e-SuratMasuk · MTsN 1 Kota Pekanbaru</p>
          </div>
        </div>
      </footer>
    </>
  );
}