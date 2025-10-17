import { create } from "zustand"
import { devtools } from 'zustand/middleware'
import { RecipesSlice, createRecipesSlice } from "./recipeSlice"
import { NotificationSlice, createNotificationSlice } from "./notificationSlice"
import { FavoritesSlice, createFavoritesSlice } from './favoritesSlice'
import { AISlice, createAISlice } from "./aiSlice"

export const useAppStore = create<RecipesSlice & NotificationSlice & FavoritesSlice & AISlice>()(devtools( (...a) => ({
  ...createRecipesSlice(...a),
  ...createNotificationSlice(...a),
  ...createFavoritesSlice(...a),
  ...createAISlice(...a),
})))