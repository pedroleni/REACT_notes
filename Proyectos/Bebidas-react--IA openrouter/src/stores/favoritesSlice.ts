import { StateCreator } from 'zustand'
import { RecipesSlice, createRecipesSlice} from './recipeSlice'
import { NotificationSlice, createNotificationSlice } from './notificationSlice'
import { Drink } from '../types'

export type FavoritesSlice = {
  favorites: Drink[],
  handleClickFavorite: (drink: Drink) => void,
  addFavorite: (drink: Drink) => void,
  deleteFavorite: (id: string) => void,
  favoriteExists: (id: string) => boolean,
  loadFromStorage: () => void 
}

export const createFavoritesSlice : StateCreator<RecipesSlice & FavoritesSlice & NotificationSlice, [], [], FavoritesSlice> = (set, get, api) =>  ({
  favorites: [],
  handleClickFavorite: (drink: Drink) => {
      createRecipesSlice(set, get, api).closeModal()
      if(get().favoriteExists(drink.idDrink) ) {
        createNotificationSlice(set, get, api).showNotification({text: 'Se Eliminó de Favoritos', error: false})
        get().deleteFavorite(drink.idDrink)
      } else {
        createNotificationSlice(set, get, api).showNotification({text: 'Se Agregó a Favoritos', error: false})
        get().addFavorite(drink)
      }
  },
  favoriteExists: (id) => {
    return get().favorites.some(favorite => favorite.idDrink === id )
  },
  addFavorite: (drink) => {
    set((state) => ({
      favorites: [...state.favorites, drink],
    }));
    localStorage.setItem('favorites', JSON.stringify(get().favorites))
  },
  deleteFavorite: (id) => {
    set((state) => ({
      favorites: state.favorites.filter( favorite => favorite.idDrink !== id)
    }))
    localStorage.setItem('favorites', JSON.stringify(get().favorites))
  },
  loadFromStorage: () => {
    const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      }
  },
})