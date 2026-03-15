import { useState, useEffect, useRef, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = "https://e-suratmasuk-production.up.railway.app";

const ROLES = ["ADMIN", "VALIDATOR_KHUSUS", "VALIDATOR_UMUM", "APPROVER", "KATU", "STAFF"];

// ─── Status Map (8 backend statuses) ─────────────────────────────────────────
const STATUS_MAP = {
  PENDING_VALIDATION:       { label: "Menunggu Validasi",                     color: "text-yellow-600",  bg: "bg-yellow-50",   border: "border-yellow-200",  dot: "#ca8a04" },
  REJECTED:                 { label: "Ditolak",                               color: "text-red-600",     bg: "bg-red-50",      border: "border-red-200",     dot: "#dc2626" },
  AWAITING_KATU_REVIEW:     { label: "Proses Review oleh Kepala Tata Usaha",  color: "text-blue-600",    bg: "bg-blue-50",     border: "border-blue-200",    dot: "#2563eb" },
  AWAITING_KAMAD_APPROVAL:  { label: "Proses Review oleh Kepala Madrasah",    color: "text-purple-600",  bg: "bg-purple-50",   border: "border-purple-200",  dot: "#9333ea" },
  DISPATCHED_TO_STAFF:      { label: "Sedang Diproses oleh Staff",            color: "text-orange-600",  bg: "bg-orange-50",   border: "border-orange-200",  dot: "#ea580c" },
  AWAITING_REPLY_UMUM:      { label: "Menunggu Balasan dari Staff",           color: "text-cyan-600",    bg: "bg-cyan-50",     border: "border-cyan-200",    dot: "#0891b2" },
  AWAITING_REPLY_KHUSUS:    { label: "Menunggu Balasan dari Kepala Madrasah", color: "text-indigo-600",  bg: "bg-indigo-50",   border: "border-indigo-200",  dot: "#4f46e5" },
  COMPLETED:                { label: "Selesai & Dibalas",                     color: "text-[#4a7a36]",   bg: "bg-[#FEFFD3]",  border: "border-[#BCD9A2]",   dot: "#6D9E51" },
};

// ─── Auth Helper ──────────────────────────────────────────────────────────────
const getHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
};

// ─── API calls ────────────────────────────────────────────────────────────────
const api = {
  getDashboardStats: () => fetch(`${API_BASE}/api/dashboard/stats`, { headers: getHeaders() }).then(r => r.json()),
  getCalendar: (date) => fetch(`${API_BASE}/api/dashboard/calendar?date=${date}`, { headers: getHeaders() }).then(r => r.json()),
  getUsers: () => fetch(`${API_BASE}/api/admin/users`, { headers: getHeaders() }).then(r => r.json()),
  createUser: (body) => fetch(`${API_BASE}/api/admin/users`, { method: "POST", headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  updateUser: (id, body) => fetch(`${API_BASE}/api/admin/users/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(body) }).then(r => r.json()),
  deleteUser: (id) => fetch(`${API_BASE}/api/admin/users/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),
  getSuratHistory: () => fetch(`${API_BASE}/api/surat/history`, { headers: getHeaders() }).then(r => r.json()),
  getSuratDetail: (id) => fetch(`${API_BASE}/api/surat/detail/${id}`, { headers: getHeaders() }).then(r => r.json()),
  deleteSurat: (id) => fetch(`${API_BASE}/api/surat/${id}`, { method: "DELETE", headers: getHeaders() }).then(r => r.json()),
};

// ─── Icons ────────────────────────────────────────────────────────────────────
const Ic = {
  Dashboard: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>,
  Users: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Mail: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Chart: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>,
  Logout: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  Edit: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  Eye: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  X: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  Bell: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  Menu: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4"><polyline points="20 6 9 17 4 12"/></svg>,
  ChevronRight: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="9 18 15 12 9 6"/></svg>,
  ChevronLeft: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="15 18 9 12 15 6"/></svg>,
  FileText: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8M16 13H8M16 17H8"/></svg>,
  Refresh: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
  Key: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>,
};

// ─── Animated Number ──────────────────────────────────────────────────────────
function AnimNum({ val, prefix = "" }) {
  const [cur, setCur] = useState(0);
  useEffect(() => {
    const n = parseInt(val) || 0;
    let frame;
    let start = 0;
    const step = () => {
      start += Math.ceil(n / 30);
      if (start >= n) { setCur(n); return; }
      setCur(start); frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [val]);
  return <>{prefix}{typeof val === "string" && val.includes("$") ? `$${cur.toLocaleString()}` : cur.toLocaleString()}</>;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ toasts, remove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`pointer-events-auto flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold text-white transition-all duration-300 ${t.type === "error" ? "bg-red-500" : "bg-[#6D9E51]"}`}
          style={{ animation: "slideInRight 0.3s ease-out" }}>
          {t.type === "error" ? "⚠️" : "✓"} {t.msg}
          <button className="ml-2 opacity-70 hover:opacity-100" onClick={() => remove(t.id)}><Ic.X /></button>
        </div>
      ))}
    </div>
  );
}

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

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxW = "max-w-lg" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxW} overflow-hidden`}
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
          <h3 className="text-lg font-black text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-xl hover:bg-gray-100"><Ic.X /></button>
        </div>
        <div className="px-7 py-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, onClose, onConfirm, title, msg, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxW="max-w-sm">
      <p className="text-gray-500 text-sm mb-6">{msg}</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all">Batal</button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
          Hapus
        </button>
      </div>
    </Modal>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || { label: status, color: "text-gray-600", bg: "bg-gray-100", border: "border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.border} ${s.color} whitespace-nowrap`}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.dot || "currentColor" }} />
      {s.label}
    </span>
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
// API response: { success, data: { tanggal, totalSuratDikerjakan, akumulasiStatus, detailSurat: [...] } }
function MiniCalendar() {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  // calInfo: stores the full data object for the selected date
  const [calInfo, setCalInfo] = useState(null);
  // activeDates: Set of day-numbers that have activity this month
  const [activeDates, setActiveDates] = useState(new Set());
  const [selectedDay, setSelectedDay] = useState(null);

  // Fetch calendar for a specific date (used when clicking a day or changing month)
  const fetchCalDay = useCallback(async (dateStr) => {
    try {
      const res = await api.getCalendar(dateStr);
      const payload = res?.data ?? null;
      setCalInfo(payload);
    } catch { setCalInfo(null); }
  }, []);

  // When month changes, fetch today/first-of-month to seed active dates from detailSurat
  useEffect(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    // Fetch first day of month to get some activity seed; calendar API is per-day
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    fetchCalDay(dateStr);
    setSelectedDay(null);
    setCalInfo(null);
  }, [viewDate, fetchCalDay]);

  const handleDayClick = (d) => {
    if (!d) return;
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    setSelectedDay(d);
    fetchCalDay(dateStr);
  };

  const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const MONTHS = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) => d && today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  const isSelected = (d) => d && d === selectedDay;

  // detailSurat is an array inside calInfo
  const detail = Array.isArray(calInfo?.detailSurat) ? calInfo.detailSurat : [];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col gap-4" style={{ animation: "fadeInUp 0.5s ease-out 400ms both" }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-black text-gray-800 text-sm">{MONTHS[month]} {year}</h4>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><Ic.ChevronLeft /></button>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500"><Ic.ChevronRight /></button>
        </div>
      </div>
      {/* Day labels */}
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>)}
      </div>
      {/* Date cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((d, i) => (
          <button key={i} onClick={() => handleDayClick(d)} disabled={!d}
            className={`aspect-square flex items-center justify-center rounded-lg text-xs font-semibold relative transition-all
              ${!d ? "pointer-events-none" :
                isToday(d) ? "bg-[#6D9E51] text-white shadow-md" :
                isSelected(d) ? "bg-[#4a7a36] text-white" :
                "hover:bg-[#FEFFD3] text-gray-700"}`}>
            {d}
          </button>
        ))}
      </div>
      {/* Selected day info */}
      {calInfo && selectedDay && (
        <div className="border-t border-gray-50 pt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-700">{selectedDay} {MONTHS[month]}</p>
            <span className="text-xs font-semibold text-[#4a7a36] bg-[#FEFFD3] px-2 py-0.5 rounded-full border border-[#BCD9A2]">
              {calInfo.totalSuratDikerjakan ?? 0} surat
            </span>
          </div>
          {detail.length > 0 ? (
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {detail.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: STATUS_MAP[s.status]?.dot || "#9ca3af" }} />
                  <span className="text-gray-600 truncate flex-1">{s.instansi}</span>
                  <span className="text-gray-400 font-mono">{s.trackingId}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Tidak ada aktivitas</p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────
function DashboardView() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboardStats().then(d => {
      // API: { success, data: { persentaseStatus: [{status, _count:{id}}], timelineSurat: [{id,status,createdAt}] } }
      setStats(d?.data ?? d ?? {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Build stat cards from persentaseStatus array
  const persentase = Array.isArray(stats?.persentaseStatus) ? stats.persentaseStatus : [];
  const timeline   = Array.isArray(stats?.timelineSurat)    ? stats.timelineSurat    : [];

  const getCount = (statusKey) => {
    const found = persentase.find(p => p.status === statusKey);
    return found?._count?.id ?? 0;
  };
  const totalSurat = persentase.reduce((acc, p) => acc + (p._count?.id ?? 0), 0);

  const statCards = [
    { label: "Total Surat Masuk",  value: totalSurat,                      sub: "Semua status", icon: <Ic.Mail />,     accent: "#6D9E51" },
    { label: "Menunggu Validasi",  value: getCount("PENDING_VALIDATION"),   sub: "Perlu diproses segera", icon: <Ic.FileText />, accent: "#ca8a04" },
    { label: "Selesai & Dibalas",  value: getCount("COMPLETED"),            sub: "Surat telah dibalas", icon: <Ic.Check />,    accent: "#4a7a36" },
    { label: "Ditolak",            value: getCount("REJECTED"),             sub: "Tidak lolos validasi", icon: <Ic.X />,       accent: "#dc2626" },
  ];

  // Build chart data from timelineSurat — group by month
  const monthNames = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const monthMap = {};
  timeline.forEach(item => {
    const d = new Date(item.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    if (!monthMap[key]) monthMap[key] = { month: monthNames[d.getMonth()], total: 0, completed: 0 };
    monthMap[key].total += 1;
    if (item.status === "COMPLETED") monthMap[key].completed += 1;
  });
  const chartData = Object.values(monthMap).slice(-8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div style={{ animation: "fadeInUp 0.4s ease-out both" }}>
        <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
        <p className="text-gray-400 text-sm mt-0.5">Selamat datang kembali, Admin 👋</p>
      </div>

      {/* Stat Cards */}
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm" style={{ animation: "fadeInUp 0.5s ease-out 300ms both" }}>
          <div className="flex items-center justify-between mb-5">
            <h4 className="font-black text-gray-800">Statistik Surat</h4>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#6D9E51] inline-block" />Masuk</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#FEFFD3] border border-[#BCD9A2] inline-block" />Selesai</span>
            </div>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", fontSize: 12 }} cursor={{ fill: "rgba(109,158,81,0.05)" }} />
                <Bar dataKey="total" fill="#6D9E51" radius={[6,6,0,0]} name="Surat Masuk" />
                <Bar dataKey="completed" fill="#BCD9A2" radius={[6,6,0,0]} name="Selesai" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-2">📊</div>
                <p className="text-gray-400 text-sm">Data statistik belum tersedia</p>
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <MiniCalendar />
      </div>

      {/* Status Legend */}
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

// ─── Users View ───────────────────────────────────────────────────────────────
function UsersView({ toast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", role: "STAFF", jabatan: "", waNumber: "" });
  const [formLoading, setFormLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.getUsers().then(d => { const u = d?.data ?? d ?? []; setUsers(Array.isArray(u) ? u : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    setFormLoading(true);
    try {
      const res = await api.createUser(form);
      if (res.success === false) throw new Error(res.message || "Gagal membuat user");
      toast.add("User berhasil dibuat!"); setShowCreate(false);
      setForm({ username: "", password: "", role: "STAFF", jabatan: "", waNumber: "" }); load();
    } catch (e) { toast.add(e.message, "error"); } finally { setFormLoading(false); }
  };

  const handleEdit = async () => {
    setFormLoading(true);
    try {
      const res = await api.updateUser(editUser._id || editUser.id, { username: form.username, role: form.role });
      if (res.success === false) throw new Error(res.message || "Gagal mengubah user");
      toast.add("User berhasil diperbarui!"); setEditUser(null); load();
    } catch (e) { toast.add(e.message, "error"); } finally { setFormLoading(false); }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.deleteUser(deleteId);
      toast.add("User berhasil dihapus!"); setDeleteId(null); load();
    } catch (e) { toast.add(e.message, "error"); } finally { setDelLoading(false); }
  };

  const ROLE_COLORS = {
    ADMIN: "bg-[#6D9E51]/15 text-[#4a7a36] border-[#BCD9A2]",
    VALIDATOR_KHUSUS: "bg-purple-50 text-purple-700 border-purple-200",
    VALIDATOR_UMUM: "bg-blue-50 text-blue-700 border-blue-200",
    APPROVER: "bg-orange-50 text-orange-700 border-orange-200",
    KATU: "bg-cyan-50 text-cyan-700 border-cyan-200",
    STAFF: "bg-gray-50 text-gray-600 border-gray-200",
  };

  const filtered = (Array.isArray(users) ? users : []).filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.role?.toLowerCase().includes(search.toLowerCase()) ||
    u.jabatan?.toLowerCase().includes(search.toLowerCase())
  );

  const FormFields = ({ isEdit }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
        <input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
          placeholder="Masukkan username" className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
      </div>
      {!isEdit && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
          <input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            placeholder="Masukkan password" className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
        </div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
        <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
          className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors bg-white">
          {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      {!isEdit && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jabatan</label>
            <input value={form.jabatan} onChange={e => setForm(p => ({ ...p, jabatan: e.target.value }))}
              placeholder="Contoh: Staf Administrasi" className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nomor WhatsApp</label>
            <input value={form.waNumber} onChange={e => setForm(p => ({ ...p, waNumber: e.target.value }))}
              placeholder="08xxxxxxxxxx" className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
          </div>
        </>
      )}
      <button onClick={isEdit ? handleEdit : handleCreate} disabled={formLoading}
        className="w-full bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2">
        {formLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
        {isEdit ? "Simpan Perubahan" : "Buat User"}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ animation: "fadeInUp 0.4s ease-out both" }}>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manajemen User</h2>
          <p className="text-gray-400 text-sm mt-0.5">Kelola akun pengguna sistem</p>
        </div>
        <button onClick={() => { setForm({ username: "", password: "", role: "STAFF", jabatan: "", waNumber: "" }); setShowCreate(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-[#6D9E51] to-[#4a7a36] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
          <Ic.Plus /> Tambah User
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animation: "fadeInUp 0.5s ease-out 100ms both" }}>
        <div className="p-4 sm:p-5 border-b border-gray-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><Ic.Search /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari username, role..."
              className="w-full border-2 border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
          </div>
          <button onClick={load} className="p-2.5 border-2 border-gray-100 rounded-xl hover:border-[#6D9E51] text-gray-400 hover:text-[#6D9E51] transition-all"><Ic.Refresh /></button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-50 rounded-xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Tidak ada user ditemukan</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Username</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Role</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Jabatan</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">WhatsApp</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Aksi</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((u, i) => (
                    <tr key={u._id || u.id || i} className="hover:bg-[#FEFFD3]/30 transition-colors group"
                      style={{ animation: `fadeInUp 0.3s ease-out ${i * 40}ms both` }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {(u.username || "?")[0].toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-800 text-sm">{u.username}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${ROLE_COLORS[u.role] || "bg-gray-50 text-gray-600 border-gray-200"}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{u.jabatan || "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{u.waNumber || u.wa || "—"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setForm({ username: u.username, password: "", role: u.role, jabatan: u.jabatan || "", waNumber: u.waNumber || "" }); setEditUser(u); }}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"><Ic.Edit /></button>
                          <button onClick={() => setDeleteId(u._id || u.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Ic.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((u, i) => (
                <div key={u._id || u.id || i} className="p-4 flex items-center gap-3"
                  style={{ animation: `fadeInUp 0.3s ease-out ${i * 40}ms both` }}>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {(u.username || "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{u.username}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${ROLE_COLORS[u.role] || "bg-gray-50 text-gray-600 border-gray-200"}`}>{u.role}</span>
                      {u.jabatan && <span className="text-xs text-gray-400 truncate">{u.jabatan}</span>}
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setForm({ username: u.username, password: "", role: u.role, jabatan: u.jabatan || "", waNumber: u.waNumber || "" }); setEditUser(u); }}
                      className="p-2 rounded-lg bg-blue-50 text-blue-500"><Ic.Edit /></button>
                    <button onClick={() => setDeleteId(u._id || u.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-400"><Ic.Trash /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Tambah User Baru">
        <FormFields isEdit={false} />
      </Modal>
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <FormFields isEdit={true} />
      </Modal>
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        loading={delLoading} title="Hapus User" msg="User ini akan dihapus secara permanen. Apakah Anda yakin?" />
    </div>
  );
}

// ─── Surat View ───────────────────────────────────────────────────────────────
function SuratView({ toast }) {
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [delLoading, setDelLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.getSuratHistory().then(d => { const s = d?.data ?? d ?? []; setSurat(Array.isArray(s) ? s : []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await api.getSuratDetail(id);
      setDetail(res.data || res);
    } catch { toast.add("Gagal memuat detail surat", "error"); }
    setDetailLoading(false);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await api.deleteSurat(deleteId);
      toast.add("Surat berhasil dihapus!"); setDeleteId(null); load();
    } catch (e) { toast.add(e.message, "error"); } finally { setDelLoading(false); }
  };

  const statusOptions = ["ALL", ...Object.keys(STATUS_MAP)];

  const filtered = (Array.isArray(surat) ? surat : []).filter(s => {
    const matchSearch = !search || s.namaPengirim?.toLowerCase().includes(search.toLowerCase()) || s.trackingId?.toLowerCase().includes(search.toLowerCase()) || s.instansi?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4" style={{ animation: "fadeInUp 0.4s ease-out both" }}>
        <div>
          <h2 className="text-2xl font-black text-gray-900">Manajemen Surat</h2>
          <p className="text-gray-400 text-sm mt-0.5">Riwayat dan pengelolaan surat masuk</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ animation: "fadeInUp 0.5s ease-out 100ms both" }}>
        <div className="p-4 sm:p-5 border-b border-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"><Ic.Search /></div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengirim, tracking ID..."
              className="w-full border-2 border-gray-100 rounded-xl py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#6D9E51] transition-colors" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border-2 border-gray-100 rounded-xl py-2.5 px-4 text-sm outline-none focus:border-[#6D9E51] transition-colors bg-white text-gray-700">
            <option value="ALL">Semua Status</option>
            {Object.entries(STATUS_MAP).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <button onClick={load} className="p-2.5 border-2 border-gray-100 rounded-xl hover:border-[#6D9E51] text-gray-400 hover:text-[#6D9E51] transition-all"><Ic.Refresh /></button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">{[...Array(6)].map((_, i) => <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">Tidak ada surat ditemukan</div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Tracking ID</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Pengirim</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Instansi</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Tanggal</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Aksi</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((s, i) => (
                    <tr key={s._id || s.id || i} className="hover:bg-[#FEFFD3]/30 transition-colors group"
                      style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-bold text-[#4a7a36] bg-[#FEFFD3] px-2 py-1 rounded-lg">{s.trackingId}</span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-800">{s.namaPengirim}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{s.instansi}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={s.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {s.createdAt ? new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDetail(s._id || s.id)} disabled={detailLoading}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all"><Ic.Eye /></button>
                          <button onClick={() => setDeleteId(s._id || s.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"><Ic.Trash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-50">
              {filtered.map((s, i) => (
                <div key={s._id || s.id || i} className="p-4 space-y-2"
                  style={{ animation: `fadeInUp 0.3s ease-out ${i * 30}ms both` }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#4a7a36] bg-[#FEFFD3] px-2 py-0.5 rounded-lg">{s.trackingId}</span>
                      <p className="font-bold text-gray-800 text-sm mt-1">{s.namaPengirim}</p>
                      <p className="text-xs text-gray-400">{s.instansi}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => handleDetail(s._id || s.id)} disabled={detailLoading}
                        className="p-2 rounded-lg bg-blue-50 text-blue-500"><Ic.Eye /></button>
                      <button onClick={() => setDeleteId(s._id || s.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-400"><Ic.Trash /></button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={s.status} />
                    <span className="text-xs text-gray-400">
                      {s.createdAt ? new Date(s.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title="Detail Surat" maxW="max-w-xl">
        {detail && (
          <div className="space-y-4">
            <div className="bg-[#FEFFD3]/60 border border-[#BCD9A2] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs text-gray-400 mb-1">Tracking ID</p>
                <p className="font-black text-[#4a7a36] text-lg">{detail.trackingId}</p>
              </div>
              <StatusBadge status={detail.status} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Nama Pengirim", detail.namaPengirim],
                ["Email", detail.emailPengirim],
                ["WhatsApp", detail.waPengirim],
                ["Instansi", detail.instansi],
                ["Nomor Surat", detail.nomorSurat],
                ["Tanggal Kirim", detail.createdAt ? new Date(detail.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" }) : "—"],
              ].map(([label, val], i) => (
                <div key={i} className={i === 1 || i === 3 ? "col-span-2 sm:col-span-1" : ""}>
                  <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{val || "—"}</p>
                </div>
              ))}
            </div>
            {detail.fileUrl && (
              <a href={detail.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 bg-[#6D9E51]/10 border border-[#BCD9A2] rounded-xl px-4 py-3 text-sm font-semibold text-[#4a7a36] hover:bg-[#6D9E51]/20 transition-all">
                <Ic.FileText /> Lihat File Surat
              </a>
            )}
            {detail.catatan && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Catatan</p>
                <p className="text-sm text-gray-700">{detail.catatan}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        loading={delLoading} title="Hapus Surat" msg="Surat dan file terlampir akan dihapus permanen dari sistem dan Cloudinary. Tindakan ini tidak dapat dibatalkan." />
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
            <button onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-2xl hover:bg-gray-50 transition-all text-sm">
              Batal
            </button>
            <button onClick={onConfirm}
              className="flex-1 bg-red-500 text-white font-bold py-3 rounded-2xl hover:bg-red-600 transition-all text-sm">
              Ya, Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: <Ic.Dashboard /> },
  { id: "users",     label: "Pengguna",  icon: <Ic.Users /> },
  { id: "surat",     label: "Surat",     icon: <Ic.Mail /> },
];

function Sidebar({ active, setActive, collapsed, setCollapsed, mobileOpen, setMobileOpen, onLogout }) {
  // Shared nav content renderer
  const renderNav = (isDrawer) => (
    <>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 ${!isDrawer && collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/logomts.png" alt="Logo" className="w-full h-full object-cover"
            onError={e => { e.target.style.display = "none"; e.target.parentElement.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" class="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`; }} />
        </div>
        {(isDrawer || !collapsed) && <span className="text-white font-black text-base tracking-tight">e-SuratMasuk</span>}
        {isDrawer && (
          <button onClick={() => setMobileOpen(false)} className="ml-auto text-white/60 hover:text-white p-1"><Ic.X /></button>
        )}
      </div>

      {(isDrawer || !collapsed) && <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest px-5 pt-5 pb-2">Menu Utama</p>}

      <nav className="flex-1 px-2 py-2 space-y-1">
        {NAV.map((item) => (
          <button key={item.id}
            onClick={() => { setActive(item.id); if (isDrawer) setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${active === item.id ? "bg-white text-[#4a7a36] shadow-lg shadow-black/10 font-bold" : "text-white/70 hover:text-white hover:bg-white/10"}
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
      {/* ── Desktop sidebar (md and up) ── */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-full z-30 flex-col transition-all duration-300 ease-in-out ${collapsed ? "w-16" : "w-60"}`}
        style={{ background: "linear-gradient(160deg, #6D9E51 0%, #4a7a36 50%, #3a6228 100%)" }}>
        {renderNav(false)}
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          {/* Drawer panel */}
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
function Topbar({ active, collapsed, onMenuClick }) {
  const titles = { dashboard: "Dashboard", users: "Manajemen User", surat: "Manajemen Surat" };
  return (
    <header className={`fixed top-0 right-0 z-20 h-16 bg-white/90 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 transition-all duration-300
      md:left-${collapsed ? "16" : "60"} left-0`}
      style={{ left: 0 }}
      // Use inline style for md+ so Tailwind JIT doesn't purge dynamic classes
    >
      {/* We apply the md offset via a sibling div trick — see main layout */}
      <div className="flex items-center gap-3">
        {/* Hamburger — only on mobile */}
        <button onClick={onMenuClick}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-600 transition-all flex-shrink-0">
          <Ic.Menu />
        </button>
        <h1 className="font-black text-gray-900 text-base sm:text-lg">{titles[active]}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition-all">
          <Ic.Bell />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#6D9E51] rounded-full" style={{ animation: "pulse-ring 2s infinite" }} />
        </button>
        <div className="flex items-center gap-2 bg-[#FEFFD3]/60 border border-[#BCD9A2] rounded-xl px-2.5 py-1.5">
          <div className="w-7 h-7 bg-gradient-to-br from-[#6D9E51] to-[#4a7a36] rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0">A</div>
          <span className="text-sm font-bold text-gray-800 hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const toast = useToast();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(109,158,81,0.5); }
          70%  { box-shadow: 0 0 0 6px rgba(109,158,81,0); }
          100% { box-shadow: 0 0 0 0 rgba(109,158,81,0); }
        }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #BCD9A2; border-radius: 99px; }
        ::-webkit-scrollbar-thumb:hover { background: #6D9E51; }
      `}</style>

      <div className="min-h-screen bg-gray-50/80">
        <Sidebar
          active={active} setActive={setActive}
          collapsed={collapsed} setCollapsed={setCollapsed}
          mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
          onLogout={() => setShowLogout(true)}
        />

        {/* Topbar: full-width on mobile, offset on md+ */}
        <div className={`fixed top-0 right-0 left-0 z-20 transition-all duration-300 md:left-${collapsed ? "16" : "60"}`}
          style={{ marginLeft: 0 }}>
          {/* Inline style override for md+ because Tailwind dynamic classes can be purged */}
          <style>{`@media(min-width:768px){.topbar-inner{margin-left:${collapsed ? "64px" : "240px"}}}`}</style>
          <div className="topbar-inner">
            <Topbar active={active} collapsed={collapsed} onMenuClick={() => setMobileOpen(true)} />
          </div>
        </div>

        {/* Main content: no left margin on mobile, offset on md+ */}
        <main className="pt-16 min-h-screen transition-all duration-300"
          style={{ marginLeft: 0 }}>
          <style>{`@media(min-width:768px){.main-inner{margin-left:${collapsed ? "64px" : "240px"}}}`}</style>
          <div className="main-inner">
            <div className="p-4 sm:p-6 max-w-7xl mx-auto">
              {active === "dashboard" && <DashboardView />}
              {active === "users" && <UsersView toast={toast} />}
              {active === "surat" && <SuratView toast={toast} />}
            </div>
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