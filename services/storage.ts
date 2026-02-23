import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  setDoc
} from 'firebase/firestore';
import { Meal, HistoryEntry } from '../types';

// Колекции в Firestore
const getMealsCollection = (userId: string) => collection(db, 'users', userId, 'meals');
const getHistoryCollection = (userId: string) => collection(db, 'users', userId, 'history');

// Начални ястия за нови потребители
const initialMeals: Omit<Meal, 'id'>[] = [
  { name: 'Пиле на грил със салата', category: 'Healthy', mealType: 'Both', cookingTime: 20, difficulty: 'Easy', priceLevel: 'Medium', proteinType: 'Chicken', cuisine: 'Българска', isActive: true },
  { name: 'Печена риба със зеленчуци', category: 'Healthy', mealType: 'Both', cookingTime: 30, difficulty: 'Medium', priceLevel: 'Expensive', proteinType: 'Fish', cuisine: 'Българска', isActive: true },
  { name: 'Пилешка супа', category: 'Healthy', mealType: 'Both', cookingTime: 45, difficulty: 'Medium', priceLevel: 'Cheap', proteinType: 'Chicken', cuisine: 'Българска', isActive: true },
  { name: 'Омлет със зеленчуци', category: 'Healthy', mealType: 'Both', cookingTime: 10, difficulty: 'Easy', priceLevel: 'Cheap', proteinType: 'Eggs', cuisine: 'Българска', isActive: true },
  { name: 'Салата с риба тон', category: 'Healthy', mealType: 'Both', cookingTime: 10, difficulty: 'Easy', priceLevel: 'Medium', proteinType: 'Fish', cuisine: 'Средиземноморска', isActive: true },
  { name: 'Леща чорба', category: 'Healthy', mealType: 'Both', cookingTime: 40, difficulty: 'Medium', priceLevel: 'Cheap', proteinType: 'Vegetarian', cuisine: 'Българска', isActive: true },
  { name: 'Мусака', category: 'Medium', mealType: 'Both', cookingTime: 90, difficulty: 'Hard', priceLevel: 'Medium', proteinType: 'Pork', cuisine: 'Българска', isActive: true },
  { name: 'Пълнени чушки', category: 'Medium', mealType: 'Both', cookingTime: 70, difficulty: 'Hard', priceLevel: 'Medium', proteinType: 'Pork', cuisine: 'Българска', isActive: true },
  { name: 'Пиле с ориз', category: 'Medium', mealType: 'Both', cookingTime: 50, difficulty: 'Medium', priceLevel: 'Medium', proteinType: 'Chicken', cuisine: 'Българска', isActive: true },
  { name: 'Спагети Болонезе', category: 'Medium', mealType: 'Both', cookingTime: 40, difficulty: 'Medium', priceLevel: 'Medium', proteinType: 'Beef', cuisine: 'Италианска', isActive: true },
  { name: 'Пица', category: 'Junk', mealType: 'Both', cookingTime: 30, difficulty: 'Medium', priceLevel: 'Medium', proteinType: 'Mixed', cuisine: 'Италианска', isActive: true },
  { name: 'Дюнер', category: 'Junk', mealType: 'Both', cookingTime: 15, difficulty: 'Easy', priceLevel: 'Cheap', proteinType: 'Chicken', cuisine: 'Турска', isActive: true },
  { name: 'Бургер', category: 'Junk', mealType: 'Both', cookingTime: 20, difficulty: 'Medium', priceLevel: 'Medium', proteinType: 'Beef', cuisine: 'Американска', isActive: true },
  { name: 'Баница с айрян', category: 'Junk', mealType: 'Both', cookingTime: 60, difficulty: 'Medium', priceLevel: 'Cheap', proteinType: 'Eggs', cuisine: 'Българска', isActive: true },
];

// Инициализиране на нов потребител с начални ястия
export const initializeUserMeals = async (userId: string) => {
  const mealsCol = getMealsCollection(userId);
  const snapshot = await getDocs(mealsCol);
  
  if (snapshot.empty) {
    // Добави начални ястия за нов потребител
    for (const meal of initialMeals) {
      await addDoc(mealsCol, meal);
    }
  }
};

// MEALS
export const getMeals = async (userId: string): Promise<Meal[]> => {
  const mealsCol = getMealsCollection(userId);
  const snapshot = await getDocs(mealsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Meal));
};

export const addMeal = async (userId: string, meal: Omit<Meal, 'id'>): Promise<Meal> => {
  const mealsCol = getMealsCollection(userId);
  const docRef = await addDoc(mealsCol, meal);
  return { id: docRef.id, ...meal };
};

export const updateMeal = async (userId: string, id: string, updates: Partial<Meal>) => {
  const mealDoc = doc(db, 'users', userId, 'meals', id);
  await updateDoc(mealDoc, updates);
};

export const deleteMeal = async (userId: string, id: string) => {
  const mealDoc = doc(db, 'users', userId, 'meals', id);
  await deleteDoc(mealDoc);
};

// HISTORY
export const getHistory = async (userId: string): Promise<HistoryEntry[]> => {
  const historyCol = getHistoryCollection(userId);
  const snapshot = await getDocs(historyCol);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as HistoryEntry))
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
};

export const addHistoryEntry = async (userId: string, entry: Omit<HistoryEntry, 'id' | 'dateTime' | 'cooked'>): Promise<HistoryEntry> => {
  const historyCol = getHistoryCollection(userId);
  const newEntry = {
    ...entry,
    dateTime: new Date().toISOString(),
    cooked: false
  };
  const docRef = await addDoc(historyCol, newEntry);
  return { id: docRef.id, ...newEntry };
};

export const markAsCooked = async (userId: string, historyId: string) => {
  const historyDoc = doc(db, 'users', userId, 'history', historyId);
  await updateDoc(historyDoc, { cooked: true });
};
