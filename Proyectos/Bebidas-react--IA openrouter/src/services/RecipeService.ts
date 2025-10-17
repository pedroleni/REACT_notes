import api from "../lib/axios";
import { CategoriesAPIResponseSchema, RecipeSchema, DrinksAPIResponse } from "../utils/recipes-schema";
import { SearchRecipe } from "../types";


export default {
    async getCategories() {
        const url = '/list.php?c=list'
        const { data } = await api(url)
        // Validar con ZOD
        const result = CategoriesAPIResponseSchema.safeParse(data)
        if(result.success) {
            return result.data
        }
    },
    async searchRecipes(filters: SearchRecipe) {
        const url = `/filter.php?c=${filters.category}&i=${filters.ingredient}`
        const { data } = await api(url)
        const result = DrinksAPIResponse.safeParse(data)
        if(result.success) {
          return result.data
        }
    },
    async getRecipeById(id: SearchRecipe['ingredient']) {
        const url = `/lookup.php?i=${id}`
        const { data } = await api(url)
        // console.log(data.drinks[0])
        const result = RecipeSchema.safeParse(data.drinks[0])
        // console.log(result)
        if(result.success) {
          return result.data
        }
    } 
}