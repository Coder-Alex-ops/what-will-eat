import { Language } from './types';

export const translations = {
  // Navigation
  home: { en: 'Home', bg: 'Начало' },
  addmeal: { en: 'Add Meal', bg: 'Добави ястие' },
  meals: { en: 'Meals', bg: 'Ястия' },
  history: { en: 'History', bg: 'История' },
  
  // Home Screen
  lunch: { en: 'Lunch', bg: 'Обяд' },
  dinner: { en: 'Dinner', bg: 'Вечеря' },
  spin: { en: 'Spin', bg: 'Завърти' },
  spinagain: { en: 'Spin Again', bg: 'Завърти отново' },
  cooked: { en: 'Cooked!', bg: 'Сготвено!' },
  winner: { en: 'Winner', bg: 'Победител' },
  alternatives: { en: 'Alternatives', bg: 'Алтернативи' },
  whatsfor: { en: "What's for", bg: 'Какво ще ядем за' },
  choosecategory: { en: 'Choose Category', bg: 'Избери категория' },
  all: { en: 'All', bg: 'Всички' },
  healthy: { en: 'Healthy', bg: 'Здравословно' },
  medium: { en: 'Medium', bg: 'Средно' },
  junk: { en: 'Junk', bg: 'Вредно' },
  nomeals: { en: 'No meals found with these filters.', bg: 'Няма намерени ястия с тези филтри.' },
  apptitle: { en: '🍴 WE EATING?', bg: '🍴 КАКВО ЩЕ ЯДЕМ?' },
  bonappetit: { en: 'Bon appétit!', bg: 'Приятен апетит!' },
  
  // Forms & Labels
  name: { en: 'Name', bg: 'Име' },
  category: { en: 'Category', bg: 'Категория' },
  mealtype: { en: 'Meal Type', bg: 'Тип хранене' },
  cookingtime: { en: 'Cooking Time (min)', bg: 'Време за готвене (мин)' },
  difficulty: { en: 'Difficulty', bg: 'Трудност' },
  pricelevel: { en: 'Price Level', bg: 'Цена' },
  proteintype: { en: 'Protein Type', bg: 'Протеин' },
  cuisine: { en: 'Cuisine', bg: 'Кухня' },
  notes: { en: 'Notes', bg: 'Бележки' },
  save: { en: 'Save Meal', bg: 'Запази ястие' },
  update: { en: 'Update Meal', bg: 'Обнови ястие' },
  cancel: { en: 'Cancel', bg: 'Отказ' },
  both: { en: 'Both', bg: 'И двете' },
  min: { en: 'MIN', bg: 'МИН' },
  
  // Status & Actions
  edit: { en: 'Edit', bg: 'Редактирай' },
  delete: { en: 'Delete', bg: 'Изтрий' },
  active: { en: 'Active', bg: 'Активно' },
  inactive: { en: 'Inactive', bg: 'Неактивно' },
  status: { en: 'Status', bg: 'Статус' },
  notcooked: { en: 'Not Cooked', bg: 'Не е сготвено' },
  confirmdelete: { en: 'Are you sure?', bg: 'Сигурни ли сте?' },
  norecords: { en: 'NO RECORDS', bg: 'НЯМА ЗАПИСИ' },
  
  // Enums
  easy: { en: 'Easy', bg: 'Лесно' },
  hard: { en: 'Hard', bg: 'Трудно' },
  cheap: { en: 'Cheap', bg: 'Евтино' },
  expensive: { en: 'Expensive', bg: 'Скъпо' },
  chicken: { en: 'Chicken', bg: 'Пилешко' },
  pork: { en: 'Pork', bg: 'Свинско' },
  beef: { en: 'Beef', bg: 'Телешко' },
  fish: { en: 'Fish', bg: 'Риба' },
  vegetarian: { en: 'Vegetarian', bg: 'Вегетарианско' },
  eggs: { en: 'Eggs', bg: 'Яйца' },
  mixed: { en: 'Mixed', bg: 'Смесено' },

  // Auth
  signinwithgoogle: { en: 'Sign in with Google', bg: 'Вход с Google' },
  logout: { en: 'Logout', bg: 'Изход' },
  loginsubtitle: { en: 'Plan your meals together', bg: 'Планирайте храненето заедно' },
  loginprivacy: { en: 'Your data is private and secure', bg: 'Данните ви са защитени' }
};

export const translate = (key: string, lang: Language) => {
  const k = key.toLowerCase() as keyof typeof translations;
  const translation = translations[k];
  return translation ? translation[lang] : key;
};
