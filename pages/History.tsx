import React, { useState, useEffect } from 'react';
import { translate } from '../i18n';
import { Language, HistoryEntry } from '../types';
import { getHistory } from '../services/storage';
import { useAuth } from '../services/AuthContext';

interface HistoryProps {
  lang: Language;
}

const History: React.FC<HistoryProps> = ({ lang }) => {
  const { user } = useAuth();
  const t = (key: string) => translate(key, lang);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<'All' | 'Cooked' | 'NotCooked'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;
    setLoading(true);
    const loadedHistory = await getHistory(user.uid);
    setHistory(loadedHistory);
    setLoading(false);
  };

  const filteredHistory = history.filter(h => {
    if (filter === 'Cooked') return h.cooked;
    if (filter === 'NotCooked') return !h.cooked;
    return true;
  });

  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{t('history')}</h2>

      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Cooked', 'NotCooked'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f as any)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${filter === f ? 'bg-orange-500 border-orange-500 text-white shadow-md' : 'bg-white border-gray-100 text-gray-400'}`}
          >
            {f === 'NotCooked' ? t('notcooked') : t(f)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredHistory.map((entry) => (
          <div key={entry.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-gray-800 text-base leading-tight">{entry.mealName}</h3>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                 <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${entry.cooked ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                   {entry.cooked ? t('cooked') : t('notcooked')}
                 </span>
                 <p className="text-[10px] text-gray-400 font-bold uppercase">{t(entry.mealType)} • {formatDate(entry.dateTime)}</p>
              </div>
            </div>
            <div className="ml-4">
              <div className={`w-2.5 h-2.5 rounded-full ${entry.cooked ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></div>
            </div>
          </div>
        ))}

        {filteredHistory.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-100">
            <p className="text-gray-300 font-bold text-sm uppercase">{t('norecords')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
