import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Cell } from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "https://e-suratmasuk-production.up.railway.app";

// ─── Status Map ───────────────────────────────────────────────────────────────
const STATUS_MAP = {
  PENDING_VALIDATION:      { label: "Menunggu Validasi",                     color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-200", dot: "#ca8a04" },
  REJECTED:                { label: "Ditolak",                               color: "text-red-600",    bg: "bg-red-50",     border: "border-red-200",    dot: "#dc2626" },
  AWAITING_KATU_REVIEW:    { label: "Proses Review oleh Kepala Tata Usaha",  color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-200",   dot: "#2563eb" },
  AWAITING_KAMAD_APPROVAL: { label: "Proses Review oleh Kepala Madrasah",    color: "text-purple-600", bg: "bg-purple-50",  border: "border-purple-200", dot: "#9333ea" },
  DISPATCHED_TO_STAFF:     { label: "Sedang Diproses oleh Staff",            color: "text-orange-600", bg: "bg-orange-50",  border: "border-orange-200", dot: "#ea580c" },
  AWAITING_REPLY_UMUM:     { label: "Menunggu Balasan dari Staff",           color: "text-cyan-600",   bg: "bg-cyan-50",    border: "border-cyan-200",   dot: "#0891b2" },
  AWAITING_REPLY_KHUSUS:   { label: "Menunggu Balasan dari Kepala Madrasah", color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-200", dot: "#4f46e5" },
  COMPLETED:               { label: "Selesai & Dibalas",                     color: "text-[#4a7a36]",  bg: "bg-[#FEFFD3]", border: "border-[#BCD9A2]",  dot: "#6D9E51" },
};

// ─── Chart palette ────────────────────────────────────────────────────────────
const STATUS_CHART_COLORS = {
  PENDING_VALIDATION:      "#FAC775",
  REJECTED:                "#F09595",
  AWAITING_KATU_REVIEW:    "#85B7EB",
  AWAITING_KAMAD_APPROVAL: "#AFA9EC",
  DISPATCHED_TO_STAFF:     "#F0997B",
  AWAITING_REPLY_UMUM:     "#5DCAA5",
  AWAITING_REPLY_KHUSUS:   "#97C459",
  COMPLETED:               "#639922",
  ARCHIVED:                "#B4B2A9",
};

const STATUS_CHART_LABELS = {
  PENDING_VALIDATION:      "Menunggu Validasi",
  REJECTED:                "Ditolak",
  AWAITING_KATU_REVIEW:    "Proses KATU",
  AWAITING_KAMAD_APPROVAL: "Proses Kamad",
  DISPATCHED_TO_STAFF:     "Diproses Staff",
  AWAITING_REPLY_UMUM:     "Menunggu Balas (Umum)",
  AWAITING_REPLY_KHUSUS:   "Menunggu Balas (Khusus)",
  COMPLETED:               "Selesai",
  ARCHIVED:                "Diarsipkan",
};

const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

// ─── Auth ─────────────────────────────────────────────────────────────────────
const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};
const getHeadersNoContentType = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ─── User Info ────────────────────────────────────────────────────────────────
const getUserInfo = () => {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return { jabatan: "Staff", username: "", initial: "S" };
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      jabatan:  payload.jabatan  || payload.position || "Staff",
      username: payload.username || payload.name     || "",
      initial:  (payload.username || payload.name || "S")[0].toUpperCase(),
    };
  } catch {
    return { jabatan: "Staff", username: "", initial: "S" };
  }
};

// ─── API ──────────────────────────────────────────────────────────────────────
const api = {
  getDashboardStats: ()       => fetch(`${API_BASE}/api/dashboard/stats`,                 { headers: getHeaders() }).then(r => r.json()),
  getCalendar:       (date)   => fetch(`${API_BASE}/api/dashboard/calendar?date=${date}`, { headers: getHeaders() }).then(r => r.json()),
  getSuratHistory:   ()       => fetch(`${API_BASE}/api/surat/history`,                   { headers: getHeaders() }).then(r => r.json()),
  getSuratDetail:    (id)     => fetch(`${API_BASE}/api/surat/detail/${id}`,              { headers: getHeaders() }).then(r => r.json()),
  staffReview:       (id, fd) => fetch(`${API_BASE}/api/surat/staff-review/${id}`,        { method: "PATCH", headers: getHeadersNoContentType(), body: fd }).then(r => r.json()),
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Dashboard:    () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
  Mail:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  FileText:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg>,
  Logout:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Check:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  X:            () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye:          () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  Search:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Bell:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Menu:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  ChevronLeft:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  Refresh:      () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Download:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload:       () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Dispatch:     () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>,
  ClipboardCheck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="m9 12 2 2 4-4"/></svg>,
  Stamp:        () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M5 22h14"/><path d="M5 11h14"/><path d="M17 11V7a5 5 0 0 0-10 0v4"/><rect x="3" y="11" width="18" height="4" rx="1"/></svg>,
  ShieldCheck:  () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>,
  Info:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Send:         () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
};

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimNum({ val }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const n = parseInt(val) || 0;
    let frame, start = 0;
    const step = () => {
      start += Math.ceil(n / 30);
      if (start >= n) { setCur(n); return; }
      setCur(start); frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [val]);
  return <>{cur.toLocaleString()}</>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  const remove = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white ${t.type === "error" ? "bg-red-500" : "bg-[#6D9E51]"}`}
          style={{ animation: "slideInRight 0.3s ease-out" }}>
          {t.type === "error" ? "⚠️" : "✓"} {t.msg}
          <button className="ml-2 opacity-70 hover:opacity-100" onClick={() => remove(t.id)}><Ic.X /></button>
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200", dot: "#9ca3af" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.border} ${s.color} whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxW = "max-w-lg" }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxW} overflow-hidden my-auto`}
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 p-1 rounded-xl hover:bg-gray-100"><Ic.X /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutConfirmModal({ open, onClose, onConfirm }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth={2} className="w-7 h-7">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <h3 className="text-lg font-black text-gray-900 mb-1">Keluar dari Sistem?</h3>
          <p className="text-sm text-gray-400 mb-6">Sesi Anda akan diakhiri. Pastikan semua pekerjaan sudah tersimpan.</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all text-sm">Batal</button>
            <button onClick={onConfirm} className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-all text-sm">Ya, Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, accent, delay }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
      style={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-gray-400 text-xs font-medium mb-1">{label}</p>
          <p className="text-2xl font-black text-gray-900"><AnimNum val={value} /></p>
        </div>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${accent}20` }}>
          <span style={{ color: accent }}>{icon}</span>
        </div>
      </div>
      {sub && <p className="text-gray-400 text-xs">{sub}</p>}
    </div>
  );
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [calInfo, setCalInfo] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const fetchCalDay = useCallback(async (dateStr) => {
    try {
      const res = await api.getCalendar(dateStr);
      setCalInfo(res?.data ?? null);
    } catch { setCalInfo(null); }
  }, []);

  useEffect(() => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    fetchCalDay(`${y}-${String(m + 1).padStart(2, "0")}-01`);
    setSelectedDay(null); setCalInfo(null);
  }, [viewDate, fetchCalDay]);

  const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  const isToday = (d) => d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  const detailCal = Array.isArray(calInfo?.detailSurat) ? calInfo.detailSurat : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4" style={{ animation: "fadeInUp 0.5s ease-out 400ms both" }}>
      <div className="flex items-center justify-between">
        <h4 className="font-black text-gray-800 text-sm">{MONTHS[month]} {year}</h4>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><Ic.ChevronLeft /></button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><Ic.ChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => (
          <button key={i} onClick={() => {
            if (!d) return;
            setSelectedDay(d);
            fetchCalDay(`${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
          }} disabled={!d}
            className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold transition-all
              ${!d ? "pointer-events-none" : isToday(d) ? "bg-[#6D9E51] text-white shadow-md" : d === selectedDay ? "bg-[#4a7a36] text-white" : "hover:bg-[#FEFFD3] text-gray-700"}`}>
            {d}
          </button>
        ))}
      </div>
      {calInfo && selectedDay && (
        <div className="border-t border-gray-50 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-700">{selectedDay} {MONTHS[month]}</p>
            <span className="text-xs font-semibold text-[#4a7a36] bg-[#FEFFD3] px-2 py-0.5 rounded-full border border-[#BCD9A2]">{calInfo.totalSuratDikerjakan ?? 0} surat</span>
          </div>
          {detailCal.length > 0 ? (
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {detailCal.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_MAP[s.status]?.dot || "#9ca3af" }} />
                  <span className="text-gray-600 truncate flex-1">{s.instansi}</span>
                  <span className="text-gray-400 font-mono">{s.trackingId}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-gray-400">Tidak ada aktivitas</p>}
        </div>
      )}
    </div>
  );
}

// ─── Chart Helpers ────────────────────────────────────────────────────────────
function buildMonthlyMap(items = []) {
  const map = {};
  items.forEach(item => {
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!map[key]) map[key] = { month: MONTHS_ID[d.getMonth()], total: 0, completed: 0, _y: d.getFullYear(), _m: d.getMonth() };
    map[key].total += 1;
    if (item.status === "COMPLETED") map[key].completed += 1;
  });
  return Object.values(map)
    .sort((a, b) => a._y !== b._y ? a._y - b._y : a._m - b._m)
    .slice(-8);
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-lg px-4 py-3 text-xs min-w-[130px]">
      <p className="font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mb-1 last:mb-0">
          <span className="flex items-center gap-1.5 text-gray-500">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function ChartCard({ title, subtitle, legend, children, delay = 0 }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animation: `fadeInUp 0.5s ease-out ${delay}ms both` }}>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <p className="font-black text-gray-800 text-sm">{title}</p>
          {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
        </div>
        {legend && (
          <div className="flex items-center gap-3 flex-wrap">
            {legend.map((l, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const user = getUserInfo();

  useEffect(() => {
    api.getDashboardStats().then(d => { setStats(d?.data ?? {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const persentaseStatus = Array.isArray(stats?.persentaseStatus) ? stats.persentaseStatus : [];
  const timelineMasuk    = Array.isArray(stats?.timelineSurat?.masuk)  ? stats.timelineSurat.masuk  : [];
  const timelineKeluar   = Array.isArray(stats?.timelineSurat?.keluar) ? stats.timelineSurat.keluar : [];
  const statsAgenda      = stats?.statsAgenda ?? {};

  const getCount   = (key) => persentaseStatus.find(p => p.status === key)?._count?.id ?? 0;
  const totalSurat = persentaseStatus.reduce((a, p) => a + (p._count?.id ?? 0), 0);

  const statusChartData = persentaseStatus
    .filter(p => (p._count?.id ?? 0) > 0)
    .map(p => ({
      name: STATUS_CHART_LABELS[p.status] || p.status,
      Jumlah: p._count?.id ?? 0,
      fill: STATUS_CHART_COLORS[p.status] || "#B4B2A9",
    }));

  const masukChartData  = buildMonthlyMap(timelineMasuk);
  const keluarChartData = buildMonthlyMap(timelineKeluar);

  const statCards = [
    { label: "Total Surat Masuk",      value: totalSurat,                       sub: "Semua status",           icon: <Ic.Mail />,          accent: "#6D9E51" },
    { label: "Disposisi ke Saya",      value: getCount("DISPATCHED_TO_STAFF"),  sub: "Perlu segera ditangani", icon: <Ic.Dispatch />,       accent: "#ea580c" },
    { label: "Menunggu Balasan",       value: getCount("AWAITING_REPLY_UMUM"),  sub: "Sudah dieksekusi",       icon: <Ic.ClipboardCheck />, accent: "#0891b2" },
    { label: "Selesai & Dibalas",      value: getCount("COMPLETED"),            sub: "Surat telah selesai",    icon: <Ic.ShieldCheck />,    accent: "#4a7a36" },
  ];

  const skeletonChart   = <div className="h-52 bg-gray-50 rounded-xl animate-pulse" />;
  const skeletonChartSm = <div className="h-48 bg-gray-50 rounded-xl animate-pulse" />;

  return (
    <div className="space-y-6">
      <div style={{ animation: "fadeInUp 0.4s ease-out both" }}>
        <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-0.5">Selamat datang, <span className="font-semibold text-gray-600">{user.jabatan}</span> 👋</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 h-28 animate-pulse">
              <div className="h-3 bg-gray-100 rounded w-2/3 mb-3" /><div className="h-7 bg-gray-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((c, i) => <StatCard key={i} {...c} delay={i * 80} />)}
        </div>
      )}

      {/* Row 1: Distribusi Status + Kalender */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Distribusi Status Surat" subtitle="Jumlah surat per status saat ini" delay={200}>
            {loading ? skeletonChart : statusChartData.length === 0 ? (
              <div className="h-52 flex flex-col items-center justify-center gap-2 text-gray-400">
                <span className="text-3xl">📊</span>
                <p className="text-xs font-medium">Data belum tersedia</p>
              </div>
            ) : (
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={statusChartData} barSize={26} margin={{ top: 4, right: 8, left: -16, bottom: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} interval={0} angle={-30} textAnchor="end" height={56} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(109,158,81,0.05)", radius: 6 }} />
                    <Bar dataKey="Jumlah" radius={[6, 6, 0, 0]}>
                      {statusChartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>
        <MiniCalendar />
      </div>

      {/* Row 2: Tren Masuk + Tren Keluar */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Tren Surat Masuk"
          subtitle="Volume surat masuk & penyelesaian (8 bulan terakhir)"
          legend={[{ color: "#378ADD", label: "Surat masuk" }, { color: "#1D9E75", label: "Selesai" }]}
          delay={300}
        >
          {loading ? skeletonChartSm : masukChartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className="text-3xl">📨</span><p className="text-xs font-medium">Belum ada data surat masuk</p>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={masukChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gStaffMasuk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#378ADD" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#378ADD" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gStaffSelesai" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#1D9E75" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1D9E75" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="total" name="Surat Masuk" stroke="#378ADD" strokeWidth={2} fill="url(#gStaffMasuk)" dot={{ r: 4, fill: "#378ADD", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#378ADD", strokeWidth: 2, stroke: "#fff" }} />
                  <Area type="monotone" dataKey="completed" name="Selesai" stroke="#1D9E75" strokeWidth={2} fill="url(#gStaffSelesai)" dot={{ r: 4, fill: "#1D9E75", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#1D9E75", strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Tren Surat Keluar"
          subtitle="Volume balasan & surat keluar (8 bulan terakhir)"
          legend={[{ color: "#BA7517", label: "Surat keluar" }]}
          delay={380}
        >
          {loading ? skeletonChartSm : keluarChartData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className="text-3xl">📤</span><p className="text-xs font-medium">Belum ada data surat keluar</p>
            </div>
          ) : (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={keluarChartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gStaffKeluar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#BA7517" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#BA7517" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="total" name="Surat Keluar" stroke="#BA7517" strokeWidth={2} fill="url(#gStaffKeluar)" dot={{ r: 4, fill: "#BA7517", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#BA7517", strokeWidth: 2, stroke: "#fff" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Agenda summary bar */}
      {!loading && (statsAgenda.masuk !== undefined || statsAgenda.keluar !== undefined) && (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-6 flex-wrap"
          style={{ animation: "fadeInUp 0.5s ease-out 450ms both" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600"><Ic.Mail /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Agenda Masuk</p>
              <p className="text-xl font-black text-gray-900"><AnimNum val={statsAgenda.masuk ?? 0} /></p>
            </div>
          </div>
          <div className="w-px h-10 bg-gray-100 flex-shrink-0" />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600"><Ic.Send /></div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Agenda Keluar</p>
              <p className="text-xl font-black text-gray-900"><AnimNum val={statsAgenda.keluar ?? 0} /></p>
            </div>
          </div>
        </div>
      )}

      {/* Legenda status */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animation: "fadeInUp 0.5s ease-out 500ms both" }}>
        <h4 className="font-black text-gray-800 mb-4">Legenda Status Surat</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(STATUS_MAP).map(([k, v]) => (
            <div key={k} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${v.bg} ${v.border}`}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: v.dot }} />
              <span className={`text-xs font-semibold ${v.color} leading-tight`}>{v.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Inline PDF Viewer ────────────────────────────────────────────────────────
function PDFViewer({ url, fileName }) {
  const [viewState, setViewState] = useState("loading");
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (!url) { setViewState("error"); return; }
    let objectUrl = null;
    setViewState("loading"); setBlobUrl(null);
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(url, { headers })
      .then(res => { if (!res.ok) throw new Error(res.status); return res.blob(); })
      .then(blob => {
        objectUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
        setBlobUrl(objectUrl); setViewState("blob");
      })
      .catch(() => setViewState("google"));
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [url]);

  const googleUrl = url ? `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(url)}` : null;
  if (!url) return <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3"><Ic.FileText /><p className="text-sm">Tidak ada file terlampir</p></div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100 flex-shrink-0 gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 truncate max-w-[180px]">{fileName || "Dokumen Surat"}</span>
        <div className="flex items-center gap-2 flex-shrink-0">
          {viewState === "blob" && <button onClick={() => setViewState("google")} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6D9E51] hover:text-[#6D9E51] transition-all font-medium">Viewer Alternatif</button>}
          {viewState === "google" && blobUrl && <button onClick={() => setViewState("blob")} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-[#6D9E51] hover:text-[#6D9E51] transition-all font-medium">Viewer Asli</button>}
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#6D9E51]/10 border border-[#BCD9A2] text-[#4a7a36] hover:bg-[#6D9E51]/20 transition-all font-semibold"><Ic.Download /> Unduh</a>
        </div>
      </div>
      <div className="flex-1 min-h-0 relative bg-gray-100" style={{ minHeight: "500px" }}>
        {viewState === "loading" && <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gray-50"><div className="w-8 h-8 border-[3px] border-[#6D9E51] border-t-transparent rounded-full animate-spin" /><p className="text-xs text-gray-400 font-medium">Memuat dokumen...</p></div>}
        {viewState === "blob"   && blobUrl    && <iframe src={blobUrl}    className="w-full h-full border-0" style={{ minHeight: "500px" }} title={fileName || "Dokumen PDF"} />}
        {viewState === "google" && googleUrl  && <iframe src={googleUrl}  className="w-full h-full border-0" style={{ minHeight: "500px" }} title={fileName || "Dokumen PDF"} sandbox="allow-scripts allow-same-origin allow-popups" />}
        {viewState === "error"  && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-gray-50 p-6 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-400"><Ic.FileText /></div>
            <div><p className="text-sm font-semibold text-gray-700 mb-1">Gagal memuat dokumen</p><p className="text-xs text-gray-400">File tidak dapat ditampilkan</p></div>
            <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#6D9E51] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-[#4a7a36] transition-all"><Ic.Download /> Buka / Unduh File</a>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mobile PDF Section ───────────────────────────────────────────────────────
function MobilePDFSection({ url, fileName }) {
  const [open, setOpen] = useState(false);
  const [viewState, setViewState] = useState("idle");
  const [blobUrl, setBlobUrl] = useState(null);

  const load = useCallback(() => {
    if (viewState === "blob" || viewState === "loading") return;
    setViewState("loading");
    const token = localStorage.getItem("authToken");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let objectUrl = null;
    fetch(url, { headers })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(blob => { objectUrl = URL.createObjectURL(new Blob([blob], { type: "application/pdf" })); setBlobUrl(objectUrl); setViewState("blob"); })
      .catch(() => setViewState("google"));
  }, [url, viewState]);

  useEffect(() => { return () => { if (blobUrl) URL.revokeObjectURL(blobUrl); }; }, [blobUrl]);
  const googleUrl = url ? `https://docs.google.com/gviewer?embedded=true&url=${encodeURIComponent(url)}` : null;

  return (
    <div className="lg:hidden border-t border-gray-100 bg-white flex-shrink-0">
      <button onClick={() => { if (!open) load(); setOpen(v => !v); }}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#4a7a36]"><Ic.FileText /><span>Lihat Dokumen Surat</span></div>
        <div className="flex items-center gap-2">
          <a href={url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-xs px-2.5 py-1 rounded-lg bg-[#6D9E51]/10 border border-[#BCD9A2] text-[#4a7a36] font-semibold">Unduh</a>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </button>
      {open && (
        <div className="border-t border-gray-100" style={{ height: "60vh" }}>
          {viewState === "loading" && <div className="h-full flex flex-col items-center justify-center gap-3 bg-gray-50"><div className="w-8 h-8 border-[3px] border-[#6D9E51] border-t-transparent rounded-full animate-spin" /><p className="text-xs text-gray-400 font-medium">Memuat dokumen...</p></div>}
          {viewState === "blob"   && blobUrl   && <iframe src={blobUrl}   className="w-full h-full border-0" title={fileName || "PDF"} />}
          {viewState === "google" && googleUrl && <iframe src={googleUrl} className="w-full h-full border-0" title={fileName || "PDF"} sandbox="allow-scripts allow-same-origin allow-popups" />}
          {(viewState === "error" || viewState === "idle") && (
            <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center bg-gray-50">
              <p className="text-sm text-gray-500">Tidak dapat menampilkan dokumen.</p>
              <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-[#6D9E51] text-white text-sm font-bold px-4 py-2.5 rounded-xl">Buka di Tab Baru</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Surat Action Panel (Staff) ───────────────────────────────────────────────
function SuratActionPanel({ suratId, onClose, onActionDone, toast }) {
  const [detail, setDetail]     = useState(null);
  const [loading, setLoading]   = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [catatanStaff, setCatatanStaff] = useState("");
  const [ttdFile, setTtdFile]   = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const ttdRef = useRef();

  useEffect(() => {
    setLoading(true);
    api.getSuratDetail(suratId).then(d => {
      setDetail(d?.data ?? d);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [suratId]);

  const isActionable = detail?.status === "DISPATCHED_TO_STAFF";

  const handleReview = async () => {
    setActionLoading(true);
    try {
      const fd = new FormData();
      fd.append("catatanStaff", catatanStaff);
      if (ttdFile) fd.append("file", ttdFile);
      const res = await api.staffReview(suratId, fd);
      if (res.success === false) throw new Error(res.message || "Gagal mengeksekusi disposisi");
      toast.add("Disposisi berhasil dieksekusi!");
      setShowReview(false); onActionDone(); onClose();
    } catch (e) { toast.add(e.message, "error"); }
    setActionLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease-out" }}>
      <div className="absolute inset-3 sm:inset-5 bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white flex-shrink-0 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0"><Ic.ClipboardCheck /></div>
            <div className="min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Detail Surat — Staff</p>
              <p className="font-black text-gray-900 text-sm leading-tight truncate">{detail?.trackingId || (loading ? "Memuat..." : "—")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {detail && <StatusBadge status={detail.status} />}
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500"><Ic.X /></button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 p-8 space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : !detail ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Gagal memuat detail surat</div>
        ) : (
          <div className="flex-1 flex overflow-hidden min-h-0">
            <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 flex flex-col border-r border-gray-100 overflow-y-auto">
              <div className="p-4 space-y-2.5 flex-1">
                {detail.instruksi && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-3 mb-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-orange-500"><Ic.Info /></span>
                      <p className="text-[10px] text-orange-600 uppercase tracking-wider font-bold">Instruksi dari Kepala Madrasah</p>
                    </div>
                    <p className="text-sm text-orange-800 font-medium leading-relaxed">{detail.instruksi}</p>
                  </div>
                )}
                {[
                  ["Tracking ID",    detail.trackingId,    true],
                  ["Nomor Surat",    detail.nomorSurat,    false],
                  ["Nama Pengirim",  detail.namaPengirim,  false],
                  ["Email",          detail.emailPengirim, false],
                  ["WhatsApp",       detail.waPengirim,    false],
                  ["Instansi",       detail.instansi,      false],
                  ["Tanggal Masuk",  detail.createdAt ? new Date(detail.createdAt).toLocaleDateString("id-ID", { dateStyle: "medium" }) : "—", false],
                ].map(([label, val, mono], i) => (
                  <div key={i} className="bg-gray-50 rounded-xl px-3.5 py-2.5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-0.5">{label}</p>
                    <p className={`text-sm font-semibold text-gray-800 break-all leading-snug ${mono ? "font-mono text-[#4a7a36]" : ""}`}>{val || "—"}</p>
                  </div>
                ))}
                {detail.catatanKATU && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-3.5 py-2.5">
                    <p className="text-[10px] text-blue-600 uppercase tracking-wider font-bold mb-0.5">Catatan KATU</p>
                    <p className="text-xs text-blue-800 leading-relaxed">{detail.catatanKATU}</p>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 p-4 space-y-2 bg-gray-50/40 flex-shrink-0">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Tindakan Staff</p>
                {isActionable ? (
                  <button onClick={() => setShowReview(true)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                    <Ic.Stamp /> Eksekusi Disposisi
                  </button>
                ) : (
                  <div className="bg-gray-100 rounded-xl px-3.5 py-2.5">
                    <p className="text-xs text-gray-400 leading-relaxed">Tidak ada tindakan yang tersedia untuk status ini.</p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:flex flex-1 flex-col overflow-hidden bg-gray-100">
              {detail.fileUrl ? <PDFViewer url={detail.fileUrl} fileName={detail.fileName || detail.trackingId} /> : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-gray-400"><Ic.FileText /><p className="text-sm font-medium">Tidak ada file terlampir</p></div>
              )}
            </div>
          </div>
        )}
        {!loading && detail?.fileUrl && <MobilePDFSection url={detail.fileUrl} fileName={detail.fileName || detail.trackingId} />}
      </div>

      <Modal open={showReview} onClose={() => setShowReview(false)} title="Eksekusi Disposisi" maxW="max-w-md">
        <div className="space-y-4">
          <div className="bg-[#6D9E51]/10 border border-[#BCD9A2] rounded-xl p-3.5 flex items-start gap-2.5">
            <span className="text-[#6D9E51] flex-shrink-0 mt-0.5"><Ic.Stamp /></span>
            <p className="text-xs text-[#4a7a36] leading-relaxed">Tandatangani dan berikan catatan untuk mengeksekusi disposisi dari Kepala Madrasah. File TTD bersifat opsional.</p>
          </div>
          {detail?.instruksi && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-3.5 py-2.5">
              <p className="text-[10px] text-orange-600 uppercase tracking-wider font-bold mb-0.5">Instruksi yang harus dieksekusi</p>
              <p className="text-xs text-orange-800 leading-relaxed">{detail.instruksi}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">File Tanda Tangan <span className="text-gray-400 font-normal text-xs">(opsional)</span></label>
            <div onClick={() => ttdRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${ttdFile ? "border-[#6D9E51] bg-[#FEFFD3]/40" : "border-gray-200 hover:border-[#BCD9A2] hover:bg-gray-50"}`}>
              <input ref={ttdRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setTtdFile(f); }} />
              {ttdFile ? (
                <div className="flex items-center justify-center gap-2.5">
                  <span className="text-[#6D9E51]"><Ic.FileText /></span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-[#4a7a36]">{ttdFile.name}</p>
                    <p className="text-xs text-gray-400">{(ttdFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setTtdFile(null); }} className="text-gray-400 hover:text-red-400 ml-2"><Ic.X /></button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-center text-gray-300 mb-1.5"><Ic.Upload /></div>
                  <p className="text-sm font-semibold text-gray-500">Klik untuk pilih file TTD</p>
                  <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Catatan Staff</label>
            <textarea value={catatanStaff} onChange={e => setCatatanStaff(e.target.value)} rows={3}
              placeholder="Tambahkan catatan tindak lanjut (opsional)..."
              className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors resize-none" />
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={() => setShowReview(false)} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all">Batal</button>
            <button onClick={handleReview} disabled={actionLoading}
              className="flex-1 bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {actionLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Ic.Stamp />}
              Eksekusi Sekarang
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Surat View ───────────────────────────────────────────────────────────────
function SuratView({ toast }) {
  const [surat, setSurat]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("ALL");
  const [openId, setOpenId]       = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api.getSuratHistory().then(d => {
      const s = d?.data ?? d ?? [];
      setSurat(Array.isArray(s) ? s : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = surat.filter(s => {
    const matchSearch = !search || [s.namaPengirim, s.trackingId, s.instansi].some(v => v?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const dispatchCount = surat.filter(s => s.status === "DISPATCHED_TO_STAFF").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ animation: "fadeInUp 0.4s ease-out both" }}>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Antrian Surat</h2>
          <p className="text-gray-400 text-sm mt-0.5">Eksekusi disposisi dari Kepala Madrasah</p>
        </div>
        {dispatchCount > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-orange-700">{dispatchCount} surat perlu dieksekusi</span>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animation: "fadeInUp 0.5s ease-out 100ms both" }}>
        <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><Ic.Search /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengirim, tracking ID, instansi..."
              className="w-full border-2 border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
          </div>
          <select value={filterStatus} onChange={e => setFilter(e.target.value)}
            className="border-2 border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#6D9E51] bg-white text-gray-700 flex-shrink-0">
            <option value="ALL">Semua Status</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={load} className="p-2.5 border-2 border-gray-100 rounded-xl hover:border-[#6D9E51] text-gray-400 hover:text-[#6D9E51] flex-shrink-0 flex items-center justify-center"><Ic.Refresh /></button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16"><div className="text-4xl mb-3">📭</div><p className="text-gray-400 text-sm font-medium">Tidak ada surat ditemukan</p></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  {["Tracking ID","Pengirim","Instansi","Status","Tanggal",""].map((h, i) => (
                    <th key={i} className={`text-xs font-semibold text-gray-400 px-5 py-3 ${i === 5 ? "text-right" : "text-left"}`}>{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s, i) => (
                    <tr key={s._id || s.id || i}
                      className={`transition-colors cursor-pointer group ${s.status === "DISPATCHED_TO_STAFF" ? "hover:bg-orange-50/50" : "hover:bg-[#FEFFD3]/30"}`}
                      onClick={() => setOpenId(s._id || s.id)}
                      style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {s.status === "DISPATCHED_TO_STAFF" && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 animate-pulse" />}
                          <span className="font-mono text-xs font-bold text-[#4a7a36] bg-[#FEFFD3] px-2 py-1 rounded-lg">{s.trackingId}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{s.namaPengirim}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.instansi}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">{s.createdAt ? new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6D9E51] opacity-0 group-hover:opacity-100 transition-opacity">Buka <Ic.ChevronRight /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((s, i) => (
                <button key={s._id || s.id || i} className="w-full text-left p-4 space-y-2 hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenId(s._id || s.id)} style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        {s.status === "DISPATCHED_TO_STAFF" && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 animate-pulse" />}
                        <span className="font-mono text-xs font-bold text-[#4a7a36] bg-[#FEFFD3] px-2 py-0.5 rounded-lg">{s.trackingId}</span>
                      </div>
                      <p className="font-bold text-gray-800 text-sm truncate">{s.namaPengirim}</p>
                      <p className="text-xs text-gray-400 truncate">{s.instansi}</p>
                    </div>
                    <Ic.ChevronRight />
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-gray-400">{s.createdAt ? new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "—"}</span>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {openId && <SuratActionPanel suratId={openId} onClose={() => setOpenId(null)} onActionDone={load} toast={toast} />}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard",     icon: <Ic.Dashboard /> },
  { id: "surat",     label: "Antrian Surat", icon: <Ic.Mail /> },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }) {
  const renderNav = (isDrawer) => (
    <>
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${!isDrawer && collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/logomts.png" alt="Logo" className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" class="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`; }} />
        </div>
        {(isDrawer || !collapsed) && <span className="text-white font-black text-base tracking-tight">e-SuratMasuk</span>}
        {isDrawer && <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/60 hover:text-white p-1"><Ic.X /></button>}
      </div>
      {(isDrawer || !collapsed) && (
        <div className="px-5 pt-4 pb-1">
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <p className="text-[#FEFFD3] text-xs font-bold">{getUserInfo().jabatan}</p>
            <p className="text-white/50 text-[10px]">{getUserInfo().username || "e-SuratMasuk"}</p>
          </div>
        </div>
      )}
      {(isDrawer || !collapsed) && <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-5 pt-4 pb-2">Menu</p>}
      <nav className="flex-1 px-2 py-2 space-y-1">
        {NAV.map(item => (
          <button key={item.id} onClick={() => { setActive(item.id); if (isDrawer) setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${active === item.id ? "bg-white text-[#4a7a36] shadow-lg font-bold" : "text-white/70 hover:text-white hover:bg-white/10"}
              ${!isDrawer && collapsed ? "justify-center" : ""}`}
            title={!isDrawer && collapsed ? item.label : ""}>
            <span className={`flex-shrink-0 transition-transform ${active === item.id ? "scale-110" : "group-hover:scale-110"}`}>{item.icon}</span>
            {(isDrawer || !collapsed) && <span className="text-sm">{item.label}</span>}
          </button>
        ))}
      </nav>
      <div className="px-2 pb-3 border-t border-white/10 pt-3 space-y-1">
        {!isDrawer && (
          <button onClick={() => setCollapsed(v => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
            style={{ justifyContent: collapsed ? "center" : "flex-start" }}>
            <span style={{ transform: collapsed ? "rotate(180deg)" : "", transition: "transform 0.3s" }}><Ic.ChevronLeft /></span>
            {!collapsed && <span className="text-sm">Sembunyikan</span>}
          </button>
        )}
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
          style={{ justifyContent: !isDrawer && collapsed ? "center" : "flex-start" }}>
          <Ic.Logout />
          {(isDrawer || !collapsed) && <span className="text-sm">Keluar</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className={`hidden md:flex fixed left-0 top-0 h-full z-30 flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-60"}`}
        style={{ background: "linear-gradient(160deg, #6D9E51 0%, #4a7a36 50%, #3a6228 100%)" }}>
        {renderNav(false)}
      </aside>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 max-w-[85vw] h-full flex flex-col z-10"
            style={{ background: "linear-gradient(160deg, #6D9E51 0%, #4a7a36 50%, #3a6228 100%)", animation: "slideInFromLeft 0.25s ease-out" }}>
            {renderNav(true)}
          </aside>
        </div>
      )}
    </>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ active, onMenuClick }) {
  const titles = { dashboard: "Dashboard", surat: "Antrian Surat" };
  const user = getUserInfo();
  return (
    <header className="fixed top-0 right-0 left-0 z-20 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600"><Ic.Menu /></button>
        <h1 className="font-black text-gray-900 text-base sm:text-lg">{titles[active]}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500">
          <Ic.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D9E51] rounded-full" style={{ animation: "pulse-ring 2s infinite" }} />
        </button>
        <div className="flex items-center gap-2 bg-[#FEFFD3]/60 border border-[#BCD9A2] rounded-xl px-2.5 py-1.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">{user.initial}</div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-gray-800 leading-tight">{user.jabatan}</p>
            {user.username && <p className="text-[10px] text-gray-400 leading-tight">{user.username}</p>}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function StaffDashboard() {
  const [active, setActive]         = useState("dashboard");
  const [collapsed, setCollapsed]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const toast = useToast();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes fadeInUp  { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(0.93) } to { opacity:1; transform:scale(1) } }
        @keyframes slideInRight { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideInFromLeft { from { transform:translateX(-100%) } to { transform:translateX(0) } }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(109,158,81,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(109,158,81,0); }
          100% { box-shadow: 0 0 0 0 rgba(109,158,81,0); }
        }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#BCD9A2; border-radius:99px; }
        ::-webkit-scrollbar-thumb:hover { background:#6D9E51; }
      `}</style>

      <div className="min-h-screen bg-gray-50/80">
        <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed}
          mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onLogout={() => setShowLogout(true)} />

        <style>{`@media(min-width:768px){.staff-topbar,.staff-main{margin-left:${collapsed ? "64px" : "240px"}}}`}</style>

        <div className="staff-topbar fixed top-0 right-0 left-0 z-20 transition-all duration-300">
          <Topbar active={active} onMenuClick={() => setMobileOpen(true)} />
        </div>

        <main className="staff-main pt-16 min-h-screen transition-all duration-300">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {active === "dashboard" && <DashboardView />}
            {active === "surat"     && <SuratView toast={toast} />}
          </div>
        </main>
      </div>

      <Toast toasts={toast.toasts} remove={toast.remove} />
      <LogoutConfirmModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => { localStorage.removeItem("authToken"); window.location.href = "/"; }}
      />
    </>
  );
}