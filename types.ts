export type Category = "Healthy" | "Medium" | "Junk";
export type MealType = "Lunch" | "Dinner" | "Both";
export type Difficulty = "Easy" | "Medium" | "Hard";
export type PriceLevel = "Cheap" | "Medium" | "Expensive";
export type ProteinType = "Chicken" | "Pork" | "Beef" | "Fish" | "Vegetarian" | "Eggs" | "Mixed";

export interface Meal {
  id: string;
  name: string;
  category: Category;
  mealType: MealType;
  cookingTime: number;
  difficulty: Difficulty;
  priceLevel: PriceLevel;
  proteinType: ProteinType;
  cuisine: string;
  notes?: string;
  isActive: boolean;
}

export interface HistoryEntry {
  id: string;
  mealId: string;
  mealName: string;
  mealType: "Lunch" | "Dinner";
  dateTime: string;
  cooked: boolean;
}

export type Language = 'en' | 'bg';
