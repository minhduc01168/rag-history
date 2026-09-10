import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../config/api';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocumentInfo {
  filename: string;
  chunk_count: number;
  status?: 'ready' | 'processing' | 'failed';
}

interface ChunkData {
  id?: string;
  text: string;
  metadata: Record<string, unknown>;
}

const API = `${API_BASE_URL}/admin/rag`;

function fileIcon(name: string) {
  if (name.endsWith('.pdf'))  return '📄';
  if (name.endsWith('.md'))   return '📋';
  if (/\.docx?$/.test(name)) return '📝';
  if (name.endsWith('.txt'))  return '📃';
  return '📁';
}

function fileExt(name: string) {
  return name.split('.').pop()?.toUpperCase() ?? 'FILE';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Spinner() {
  const { t } = useLanguage();
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-600 font-bold">
      <div className="w-6 h-6 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">{t('admin.loading')}</span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-3xl border-2 border-amber-200/80 p-8 shadow-sm">
      <div className="text-6xl mb-3 animate-bounce">🗂️</div>
      <p className="text-base font-bold text-slate-700">{message}</p>
    </div>
  );
}

// ─── Chunk Detail Slide-over Panel ───────────────────────────────────────────

interface ChunkPanelProps {
  filename: string;
  chunks: ChunkData[];
  loading: boolean;
  onClose: () => void;
}

function ChunkPanel({ filename, chunks, loading, onClose }: ChunkPanelProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setExpanded(prev => {
      const s = new Set(prev);
      if (s.has(i)) { s.delete(i); } else { s.add(i); }
      return s;
    });

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="
          fixed right-0 top-0 bottom-0 z-50
          w-full sm:w-[560px] lg:w-[640px]
          bg-[#FFFDF7] border-l-2 border-amber-300
          flex flex-col shadow-2xl
          animate-in slide-in-from-right duration-250
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-amber-200/80 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1 bg-white rounded-xl border border-amber-200 shadow-xs">{fileIcon(filename)}</span>
              <div className="min-w-0">
                <p className="font-black text-slate-900 text-base truncate">{filename}</p>
                <p className="text-xs font-bold text-amber-900 mt-0.5">
                  {loading ? 'Đang tải chunks...' : `Đã bóc tách thành ${chunks.length} phân đoạn`}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-amber-100 transition-all shrink-0 font-black text-base"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20">
          {loading ? (
            <Spinner />
          ) : chunks.length === 0 ? (
            <EmptyState message="Không có phân đoạn nào." />
          ) : (
            <div className="space-y-3">
              {chunks.map((chunk, i) => {
                const isOpen = expanded.has(i);
                const charCount = chunk.text.length;
                const tokenEst = Math.round(charCount / 4);
                return (
                  <div
                    key={chunk.id ?? i}
                    className="bg-white border-2 border-amber-200/80 rounded-2xl overflow-hidden hover:border-amber-400 transition-all shadow-xs"
                  >
                    {/* Chunk header */}
                    <button
                      onClick={() => toggle(i)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left group bg-amber-50/40 hover:bg-amber-100/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 flex items-center justify-center rounded-xl bg-amber-400 text-slate-950 text-xs font-black shadow-xs shrink-0">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm text-slate-900 font-bold line-clamp-1">
                            {chunk.text.slice(0, 80)}{chunk.text.length > 80 ? '…' : ''}
                          </p>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            ~{tokenEst} tokens · {charCount} ký tự
                            {Boolean(chunk.metadata?.['Header 1']) && (
                              <span className="ml-2 text-amber-900 font-bold">§ {String(chunk.metadata['Header 1'])}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className={`text-amber-900 font-bold transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>

                    {/* Chunk content */}
                    {isOpen && (
                      <div className="border-t-2 border-amber-100 p-4 bg-white">
                        <pre className="text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed font-semibold max-h-72 overflow-y-auto bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                          {chunk.text}
                        </pre>
                        {Object.keys(chunk.metadata).length > 0 && (
                          <div className="mt-3 pt-3 border-t border-amber-100 flex flex-wrap gap-1.5">
                            {Object.entries(chunk.metadata)
                              .filter(([k]) => k !== 'source_file')
                              .map(([k, v]) => (
                                <span key={k} className="text-[10px] bg-amber-100/90 text-amber-950 px-2.5 py-0.5 rounded-md font-bold border border-amber-200">
                                  <span className="text-slate-500">{k}:</span> {String(v)}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function KBDocumentsPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [docs, setDocs] = useState<DocumentInfo[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [error, setError] = useState('');

  // Slide-over state
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [chunks, setChunks] = useState<ChunkData[]>([]);
  const [loadingChunks, setLoadingChunks] = useState(false);

  // Delete state
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ── Fetch document list ──
  const fetchDocs = useCallback(async () => {
    setLoadingDocs(true);
    setError('');
    try {
      const res = await fetch(`${API}/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDocs(await res.json());
    } catch (e) {
      setError((e as Error).message ?? 'Không thể tải danh sách tài liệu.');
    } finally {
      setLoadingDocs(false);
    }
  }, [token]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  // ── Open chunk panel ──
  const openChunks = async (filename: string) => {
    setSelectedFile(filename);
    setChunks([]);
    setLoadingChunks(true);
    try {
      const res = await fetch(
        `${API}/documents/${encodeURIComponent(filename)}/chunks`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setChunks(await res.json());
    } catch {
      setChunks([]);
    } finally {
      setLoadingChunks(false);
    }
  };

  // ── Delete document ──
  const handleDelete = async (filename: string) => {
    setDeleting(filename);
    try {
      const res = await fetch(
        `${API}/documents/${encodeURIComponent(filename)}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDocs(prev => prev.filter(d => d.filename !== filename));
      if (selectedFile === filename) setSelectedFile(null);
      setConfirmDelete(null);
    } catch (e) {
      setError((e as Error).message ?? 'Xóa thất bại.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-amber-200/80 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🗂️</span>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {t('admin.docsTitle')}
            </h1>
          </div>
          <p className="text-slate-600 font-semibold mt-1 text-sm">
            {t('admin.docsSubtitle')}
          </p>
        </div>
        <button
          onClick={fetchDocs}
          disabled={loadingDocs}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 border-2 border-amber-300 rounded-2xl text-sm font-black text-slate-950 transition-all disabled:opacity-50 shadow-md hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <span className={loadingDocs ? 'animate-spin' : ''}>🔄</span>
          <span>{t('admin.refresh')}</span>
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-2xl text-sm font-bold shadow-xs flex items-center gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Stats bar */}
      {!loadingDocs && docs.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t('admin.totalDocs'), value: docs.length, icon: '📁', color: 'from-amber-400 to-yellow-500' },
            { label: t('admin.totalChunks'), value: docs.reduce((a, d) => a + d.chunk_count, 0), icon: '🧩', color: 'from-emerald-400 to-teal-500' },
            { label: t('admin.avgChunks'), value: Math.round(docs.reduce((a,d)=>a+d.chunk_count,0)/docs.length), icon: '📊', color: 'from-blue-400 to-indigo-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-white border-2 border-amber-200/80 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-sm text-white shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Document list */}
      {loadingDocs ? (
        <Spinner />
      ) : docs.length === 0 ? (
        <EmptyState message={t('admin.emptyDocs')} />
      ) : (
        <div className="flex flex-col gap-3">
          {docs.map(doc => {
            const isSelected = selectedFile === doc.filename;

            return (
              <div
                key={doc.filename}
                className={`
                  group relative bg-white border-2 rounded-3xl p-4 sm:px-6 sm:py-5
                  transition-all duration-200 shadow-sm
                  flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4
                  ${isSelected
                    ? 'border-amber-500 shadow-lg shadow-amber-500/15 bg-amber-50/50'
                    : 'border-amber-200/80 hover:border-amber-400 hover:shadow-md'}
                `}
              >
                {/* Row body — clickable */}
                <button
                  onClick={() => openChunks(doc.filename)}
                  className="flex-1 w-full sm:w-auto text-left flex flex-col md:flex-row md:items-center justify-between gap-4 min-w-0"
                >
                  {/* Left: Icon + Filename + Badges */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <span className="text-3xl shrink-0 p-2.5 bg-amber-50 rounded-2xl border-2 border-amber-200">
                      {fileIcon(doc.filename)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900 text-sm sm:text-base leading-snug truncate group-hover:text-amber-900 transition-colors">
                        {doc.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-black bg-amber-100 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {fileExt(doc.filename)}
                        </span>
                        <span className="text-[10px] font-black bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-300">
                          🧩 {doc.chunk_count} {t('admin.chunks')}
                        </span>
                        <span 
                          className={`inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            (!doc.status || doc.status === 'ready')
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : doc.status === 'processing'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                          title={(!doc.status || doc.status === 'ready') ? t('admin.statusReadyDesc') : t('admin.statusProcessingDesc')}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${(!doc.status || doc.status === 'ready') ? 'bg-emerald-600' : doc.status === 'processing' ? 'bg-amber-600 animate-ping' : 'bg-rose-600'}`} />
                          {(!doc.status || doc.status === 'ready') ? t('admin.statusReady') : doc.status === 'processing' ? t('admin.statusProcessing') : t('admin.statusFailed')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle/Right: Trạng thái nạp và chỉ mục */}
                  <div className="w-full md:w-56 shrink-0 flex flex-col justify-center">
                    <div className="flex items-center justify-between text-[11px] text-slate-700 mb-1.5 font-bold">
                      <span>{isSelected ? '📖 Đang xem chunks' : '🔍 Nhấn xem chunks'}</span>
                      <span className="text-emerald-700 font-black">
                        {(!doc.status || doc.status === 'ready') ? '100% Đã nạp' : doc.status === 'processing' ? 'Đang xử lý...' : 'Lỗi'}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-emerald-100 rounded-full overflow-hidden border border-emerald-200">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          (!doc.status || doc.status === 'ready')
                            ? 'w-full bg-gradient-to-r from-emerald-500 to-teal-500'
                            : doc.status === 'processing'
                            ? 'w-3/4 bg-amber-500 animate-pulse'
                            : 'w-full bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {/* Right: Actions */}
                <div className="shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto border-amber-100 flex justify-end">
                  {confirmDelete === doc.filename ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-rose-600 font-black mr-1">{t('admin.confirmDelete')}</span>
                      <button
                        onClick={() => handleDelete(doc.filename)}
                        disabled={deleting === doc.filename}
                        className="text-xs px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition-all disabled:opacity-50 shadow-sm hover:scale-105"
                      >
                        {deleting === doc.filename ? '...' : t('admin.delete')}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl transition-all shadow-sm"
                      >
                        {t('admin.cancel')}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => { e.stopPropagation(); setConfirmDelete(doc.filename); }}
                      className="
                        w-9 h-9 flex items-center justify-center
                        rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50
                        transition-all border border-slate-200 hover:border-rose-300 shadow-xs
                      "
                      title={t('admin.delete')}
                    >
                      🗑
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chunk slide-over panel */}
      {selectedFile && (
        <ChunkPanel
          filename={selectedFile}
          chunks={chunks}
          loading={loadingChunks}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </div>
  );
}
