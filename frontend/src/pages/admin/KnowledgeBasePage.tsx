import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { API_BASE_URL } from '../../config/api';

interface ChunkData {
  text: string;
  metadata: Record<string, unknown>;
}

export function KnowledgeBasePage() {
  const { t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chunks, setChunks] = useState<ChunkData[] | null>(null);
  const [committing, setCommitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [expandedChunks, setExpandedChunks] = useState<Record<number, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setChunks(null);
      setError('');
      setSuccess('');
    }
  };

  const handleDryRun = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/rag/dry-run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Lỗi khi phân tích tài liệu SGK');
      }

      const data = await response.json();
      setChunks(data);
    } catch (err) {
      setError((err as Error).message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleCommit = async () => {
    if (!chunks) return;
    setCommitting(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/rag/commit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ chunks })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || 'Lỗi khi lưu dữ liệu SGK vào CSDL Vector');
      }

      const count = chunks.length;
      setSuccess(`Đã lưu thành công ${count} phân đoạn SGK vào hệ thống Cụ Rùa AI.`);
      setChunks(null);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setError((err as Error).message || 'Đã có lỗi xảy ra');
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-amber-200/80 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📚</span>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {t('admin.kbTitle')}
            </h1>
          </div>
          <p className="text-slate-600 font-semibold mt-1 text-sm">
            {t('admin.kbSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-950 border border-amber-300 rounded-full shadow-xs">
            ✨ SGK Lịch Sử Lớp 4 & 5
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 p-4 rounded-2xl font-bold text-sm shadow-xs flex items-center gap-3 animate-in fade-in">
          <span className="text-2xl">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-900 p-5 rounded-3xl font-bold text-sm shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <p className="font-black text-emerald-950 text-base">{success}</p>
              <p className="text-xs text-emerald-800 font-semibold mt-0.5">Dữ liệu đã sẵn sàng để Cụ Rùa AI tra cứu và trả lời câu hỏi cho các cháu.</p>
            </div>
          </div>
          <Link
            to="/admin/kb-docs"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-xs transition-all shadow-md hover:scale-105 active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            👉 Xem danh sách tài liệu
          </Link>
        </div>
      )}

      {(loading || committing) && (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 p-4 rounded-2xl flex items-center gap-3 animate-pulse shadow-md">
          <div className="w-6 h-6 border-3 border-amber-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <div>
            <p className="font-black text-sm flex items-center gap-2 flex-wrap">
              <span>{t('admin.statusLabel')}:</span>
              <span className="bg-amber-200/90 text-amber-950 px-2.5 py-0.5 rounded-full text-xs uppercase font-black tracking-wider">
                {t('admin.statusProcessing')}
              </span>
              <span>— {loading ? t('admin.analyzing') : t('admin.committing')}</span>
            </p>
            <p className="text-xs font-semibold text-amber-800/80 mt-0.5">
              {t('admin.statusProcessingDesc')}
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Upload & Dry Run */}
      <div className="bg-white border-2 border-amber-200/80 p-6 sm:p-8 rounded-3xl shadow-xl shadow-amber-500/5">
        <h2 className="text-xl font-black text-amber-950 mb-4 flex items-center gap-2">
          <span>📤</span> {t('admin.step1')}
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.txt,.md"
            className="block w-full text-sm text-slate-600 font-semibold
              file:mr-4 file:py-2.5 file:px-5
              file:rounded-2xl file:border-2 file:border-amber-300
              file:text-sm file:font-black
              file:bg-amber-50 file:text-amber-950
              hover:file:bg-amber-100 transition-all cursor-pointer bg-slate-50 p-2 rounded-2xl border border-slate-200"
          />
          <button 
            onClick={handleDryRun}
            disabled={!file || loading}
            className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 px-6 py-3 rounded-2xl whitespace-nowrap shadow-md shadow-amber-500/20 font-black transition-all hover:scale-105 active:scale-95 border-2 border-amber-300"
          >
            {loading ? t('admin.analyzing') : t('admin.dryRun')}
          </button>
        </div>
        <p className="text-xs font-bold text-slate-500 mt-3 flex items-center gap-1.5">
          <span>💡</span> {t('admin.step1Note')}
        </p>
      </div>

      {/* Step 2: Review & Ingest */}
      {chunks && (
        <div className="bg-white border-2 border-amber-300 p-6 sm:p-8 rounded-3xl shadow-xl shadow-amber-500/10 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 border-b-2 border-amber-100 pb-4">
            <div>
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                <span>🔍</span> {t('admin.step2')}
              </h2>
              <p className="text-xs font-bold text-slate-500 mt-0.5">
                Kiểm tra các phân đoạn tài liệu trước khi chính thức lưu vào Cụ Rùa AI
              </p>
            </div>
            <button 
              onClick={handleCommit}
              disabled={committing}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/20 font-black transition-all hover:scale-105 active:scale-95 whitespace-nowrap border-2 border-emerald-400"
            >
              {committing ? t('admin.committing') : `${t('admin.commit')} (${chunks.length} ${t('admin.chunks')})`}
            </button>
          </div>

          <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2">
            {chunks.map((chunk, idx) => {
              const isExpanded = expandedChunks[idx] || false;
              return (
                <div key={idx} className="bg-amber-50/60 border-2 border-amber-200/90 rounded-2xl p-4 flex flex-col group hover:border-amber-400 transition-all shadow-xs">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-xs font-black bg-amber-200/80 text-amber-950 px-3 py-1 rounded-full border border-amber-300">
                      📄 Phân đoạn #{idx + 1}
                    </span>
                    <span className="text-xs text-slate-500 font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                      ~{Math.round(chunk.text.length / 4)} tokens
                    </span>
                  </div>
                  <div className={`text-sm text-slate-800 whitespace-pre-wrap font-sans bg-white p-4 rounded-xl border border-amber-100 leading-relaxed font-semibold transition-all duration-300 ${!isExpanded ? 'line-clamp-3 overflow-hidden' : ''}`}>
                    {chunk.text}
                  </div>
                  <button 
                    onClick={() => setExpandedChunks(prev => ({ ...prev, [idx]: !isExpanded }))}
                    className="mt-2.5 text-xs font-black text-amber-900 hover:text-amber-700 self-start flex items-center gap-1 transition-colors"
                  >
                    {isExpanded ? '🔼 Thu gọn' : '🔽 Xem toàn bộ phân đoạn'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
