import React, { useState, useEffect } from 'react';
import { translate } from '../i18n';
import { Language, Meal } from '../types';
import { addMeal, updateMeal, getMeals } from '../services/storage';
import { useAuth } from '../services/AuthContext';

interface AddMealProps {
  lang: Language;
  onSuccess: () => void;
  onCancel: () => void;
  editId?: string;
}

const AddMeal: React.FC<AddMealProps> = ({ lang, onSuccess, onCancel, editId }) => {
  const { user } = useAuth();
  const t = (key: string) => translate(key, lang);
  const [loading, setLoading] = useState(false);
  const [existingMeal, setExistingMeal] = useState<Meal | null>(null);

  const [formData, setFormData] = useState<Omit<Meal, 'id'>>({
    name: '',
    category: 'Medium',
    mealType: 'Both',
    cookingTime: 30,
    difficulty: 'Medium',
    priceLevel: 'Medium',
    proteinType: 'Mixed',
    cuisine: lang === 'bg' ? 'Българска' : 'Bulgarian',
    notes: '',
    isActive: true
  });

  useEffect(() => {
    if (editId && user) {
      loadMealForEdit();
    }
  }, [editId, user]);

  const loadMealForEdit = async () => {
    if (!user || !editId) return;
    const meals = await getMeals(user.uid);
    const meal = meals.find(m => m.id === editId);
    if (meal) {
      setExistingMeal(meal);
      setFormData({
        name: meal.name,
        category: meal.category,
        mealType: meal.mealType,
        cookingTime: meal.cookingTime,
        difficulty: meal.difficulty,
        priceLevel: meal.priceLevel,
        proteinType: meal.proteinType,
        cuisine: meal.cuisine,
        notes: meal.notes || '',
        isActive: meal.isActive
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !user) return;

    setLoading(true);
    try {
      if (editId) {
        await updateMeal(user.uid, editId, formData);
      } else {
        await addMeal(user.uid, formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving meal:', error);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 animate-in slide-in-from-right-10 duration-300">
      <h2 className="text-2xl font-black mb-8 text-gray-900 tracking-tighter">{editId ? t('update') : t('addMeal')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('name')}</label>
          <input 
            required
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            autoComplete="off"
            className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-500 outline-none transition-all font-bold text-gray-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('category')}</label>
            <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700">
              <option value="Healthy">{t('healthy')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="Junk">{t('junk')}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('mealType')}</label>
            <select name="mealType" value={formData.mealType} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700">
              <option value="Both">{t('both')}</option>
              <option value="Lunch">{t('lunch')}</option>
              <option value="Dinner">{t('dinner')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('cookingTime')}</label>
            <input 
              type="number" 
              name="cookingTime"
              value={formData.cookingTime}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700"
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('difficulty')}</label>
            <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700">
              <option value="Easy">{t('easy')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="Hard">{t('hard')}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('priceLevel')}</label>
            <select name="priceLevel" value={formData.priceLevel} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700">
              <option value="Cheap">{t('cheap')}</option>
              <option value="Medium">{t('medium')}</option>
              <option value="Expensive">{t('expensive')}</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('proteinType')}</label>
            <select name="proteinType" value={formData.proteinType} onChange={handleChange} className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-gray-700">
              {['Chicken', 'Pork', 'Beef', 'Fish', 'Vegetarian', 'Eggs', 'Mixed'].map(p => (
                <option key={p} value={p}>{t(p)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('notes')}</label>
          <textarea 
            name="notes"
            rows={2}
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none resize-none font-medium text-gray-700"
          />
        </div>

        <div className="flex space-x-3 pt-6">
          <button 
            type="button"
            onClick={onCancel}
            className="flex-1 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-95"
          >
            {t('cancel')}
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs active:scale-95 disabled:opacity-50"
          >
            {loading ? '...' : (editId ? t('update') : t('save'))}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMeal;
