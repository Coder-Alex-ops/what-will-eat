import React, { useState, useEffect } from 'react';
import { translate } from '../i18n';
import { Language, Meal } from '../types';
import { getMeals, deleteMeal, updateMeal } from '../services/storage';
import { useAuth } from '../services/AuthContext';

interface MealsListProps {
  lang: Language;
  onEdit: (mealId: string) => void;
}

const MealsList: React.FC<MealsListProps> = ({ lang, onEdit }) => {
  const { user } = useAuth();
  const t = (key: string) => translate(key, lang);
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

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (confirm(t('confirmdelete'))) {
      await deleteMeal(user.uid, id);
      await loadMeals();
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    if (!user) return;
    await updateMeal(user.uid, id, { isActive: !current });
    await loadMeals();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">{t('meals')}</h2>
        <span className="text-[10px] font-black text-gray-400 mb-1">{meals.length} {t('meals').toUpperCase()}</span>
      </div>

      <div className="space-y-3">
        {meals.map((meal) => (
          <div key={meal.id} className={`bg-white p-5 rounded-2xl border transition-all ${meal.isActive ? 'border-gray-100 shadow-sm' : 'border-gray-200 opacity-60 bg-gray-50'}`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 mr-4">
                <h3 className="font-bold text-gray-900 text-lg leading-tight">{meal.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                   <Badge label={t(meal.category)} color="orange" />
                   <Badge label={t(meal.mealType)} color="blue" />
                   <span className="text-[10px] text-gray-400 font-bold flex items-center">
                     <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {meal.cookingTime} {t('min')}
                   </span>
                </div>
              </div>
              <button 
                onClick={() => toggleActive(meal.id, meal.isActive)}
                className={`px-2 py-1 text-[9px] font-black rounded-lg uppercase tracking-wider whitespace-nowrap ${meal.isActive ? 'bg-green-50 text-green-600' : 'bg-gray-200 text-gray-500'}`}
              >
                {meal.isActive ? t('active') : t('inactive')}
              </button>
            </div>

            <div className="flex justify-end space-x-6 pt-3 border-t border-gray-50 mt-4">
              <button 
                onClick={() => onEdit(meal.id)}
                className="text-xs font-black text-orange-500 uppercase tracking-widest hover:text-orange-600"
              >
                {t('edit')}
              </button>
              <button 
                onClick={() => handleDelete(meal.id)}
                className="text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-500"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        ))}

        {meals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <span className="text-gray-300 font-bold uppercase">{t('nomeals')}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Badge = ({ label, color }: { label: string, color: string }) => (
  <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${color === 'orange' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'}`}>
    {label}
  </span>
);

export default MealsList;
