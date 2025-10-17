import { StateCreator } from 'zustand'
import RecipeService from '../services/RecipeService'
import type { Categories, Recipe, Drinks, SearchRecipe, ActiveRecipe } from '../types'
import { FavoritesSlice } from './favoritesSlice'
import { NotificationSlice } from './notificationSlice'

export type RecipesSlice = {
  activeRecipe: ActiveRecipe,
  categories: Categories,
  drinks: Drinks,
  modal: boolean,
  fetchCategories: () => Promise<void>,
  searchRecipes: (searchFilters: SearchRecipe) => Promise<void>,
  selectRecipe: (id: Recipe['idDrink']) => Promise<void>,
  closeModal: () => void
}

export const createRecipesSlice : StateCreator<RecipesSlice & FavoritesSlice & NotificationSlice, [], [], RecipesSlice> = (set) => ({
  activeRecipe: {} as Recipe,
  categories: {
    drinks: []
  },
  modal: false,
  drinks: {
    drinks: []
  },
  fetchCategories: async () => {
    const categories = await RecipeService.getCategories()
    set(() => ({
      categories
    }))
  },
  searchRecipes: async(searchFilters ) => {
    const drinks = await RecipeService.searchRecipes(searchFilters)
    set(() => ({
      drinks
    }))
  },
  selectRecipe: async (id) => {
    const activeRecipe = await RecipeService.getRecipeById(id)
    set(() => ({
      activeRecipe,
      modal: true
    }))
  },
  closeModal: () => {
    set(() => ({
      modal: false
    }))
  }
})