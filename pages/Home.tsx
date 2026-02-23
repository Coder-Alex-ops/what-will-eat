import React, { useState, useEffect } from 'react';
import { translate } from '../i18n';
import { Language, Meal, Category } from '../types';
import { getMeals, addHistoryEntry, markAsCooked } from '../services/storage';
import { useAuth } from '../services/AuthContext';

interface HomeProps {
  lang: Language;
}

const Home: React.FC<HomeProps> = ({ lang }) => {
  const { user } = useAuth();
  const t = (key: string) => translate(key, lang);
  const [mealType, setMealType] = useState<"Lunch" | "Dinner">('Lunch');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Meal | null>(null);
  const [alternatives, setAlternatives] = useState<Meal[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadMeals();
    }
  }, [user]);

  const loadMeals = async () => {
    if (!user) return;
    setLoading(true);
    const loadedMeals = await getMeals(user.uid);
    setMeals(loadedMeals);
    setLoading(false);
  };

  const handleSpin = async () => {
    if (!user) return;
    
    setIsSpinning(true);
    setWinner(null);
    setAlternatives([]);
    setCurrentHistoryId(null);

    setTimeout(async () => {
      const filtered = meals.filter(m => 
        m.isActive && 
        (m.mealType === 'Both' || m.mealType === mealType) &&
        (category === 'All' || m.category === category)
      );

      if (filtered.length === 0) {
        setIsSpinning(false);
        return;
      }

      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const selectedWinner = shuffled[0];
      const selectedAlts = shuffled.slice(1, 3);

      setWinner(selectedWinner);
      setAlternatives(selectedAlts);
      setIsSpinning(false);

      const entry = await addHistoryEntry(user.uid, {
        mealId: selectedWinner.id,
        mealName: selectedWinner.name,
        mealType: mealType
      });
      setCurrentHistoryId(entry.id);
    }, 1200);
  };

  const handleCooked = async () => {
    if (currentHistoryId && user) {
      await markAsCooked(user.uid, currentHistoryId);
      alert(t('bonappetit'));
      setWinner(null);
      setAlternatives([]);
    }
  };

  const filteredMealsCount = meals.filter(m => 
    m.isActive && 
    (m.mealType === 'Both' || m.mealType === mealType) &&
    (category === 'All' || m.category === category)
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">{t('whatsfor')} {t(mealType)}?</h2>
        
        <div className="flex bg-gray-100 p-1.5 rounded-xl mb-6">
          <button 
            onClick={() => setMealType('Lunch')}
            className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${mealType === 'Lunch' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('lunch')}
          </button>
          <button 
            onClick={() => setMealType('Dinner')}
            className={`flex-1 py-2.5 text-xs font-black rounded-lg transition-all ${mealType === 'Dinner' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('dinner')}
          </button>
        </div>

        <div className="mb-8">
          <label className="block text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">{t('choosecategory')}</label>
          <div className="grid grid-cols-2 gap-2">
            {['All', 'Healthy', 'Medium', 'Junk'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setCategory(cat as any)}
                className={`py-3 px-3 text-xs font-bold rounded-xl border transition-all ${category === cat ? 'bg-orange-50 border-orange-200 text-orange-600' : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'}`}
              >
                {t(cat)}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleSpin}
          disabled={isSpinning || filteredMealsCount === 0}
          className={`w-full py-5 rounded-2xl text-xl font-black shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-3 ${isSpinning || filteredMealsCount === 0 ? 'bg-gray-200 text-gray-400' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
        >
          {isSpinning ? (
            <svg className="animate-spin h-6 w-6 text-orange-400" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <span>{t('spin')}</span>
          )}
        </button>
      </div>

      {winner && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">{t('winner')}</span>
              <span className="text-orange-400 text-xs font-bold uppercase">{t(winner.category)}</span>
            </div>
            <h3 className="text-2xl font-black text-orange-900 leading-tight mb-6">{winner.name}</h3>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleCooked}
                className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl transition-all shadow-md active:scale-95"
              >
                {t('cooked')}
              </button>
              <button 
                onClick={handleSpin}
                className="flex-1 bg-white border border-orange-200 text-orange-500 font-bold py-4 rounded-2xl transition-all active:scale-95"
              >
                {t('spinagain')}
              </button>
            </div>
          </div>

          {alternatives.length > 0 && (
            <div className="px-1">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center">
                <span className="mr-2">{t('alternatives')}</span>
                <div className="h-px bg-gray-200 flex-1"></div>
              </h4>
              <div className="space-y-2">
                {alternatives.map((alt) => (
                  <div key={alt.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center group">
                    <span className="font-bold text-gray-700">{alt.name}</span>
                    <span className="text-[10px] text-gray-300 font-bold uppercase">{t(alt.category)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!winner && !isSpinning && filteredMealsCount === 0 && (
         <div className="text-center py-12 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-sm">{t('nomeals')}</p>
         </div>
      )}
    </div>
  );
};

export default Home;
