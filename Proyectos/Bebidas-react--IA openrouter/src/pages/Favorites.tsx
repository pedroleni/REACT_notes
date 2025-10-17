import { useMemo } from "react";
import { useAppStore } from "../stores/useAppStore";
import RecipeCard from "../components/DrinkCard";

const FavoritesPage = () => {
  const favorites = useAppStore((state) => state.favorites);

  const hasFavorites = useMemo(() => favorites.length > 0, [favorites]);
  return (
    <>
      <h1 className="text-6xl font-extrabold">Favoritos</h1>

      {hasFavorites ? (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 my-10 gap-10 ">
          {favorites.map((recipe) => (
            <RecipeCard key={recipe.idDrink} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="my-10 text-center text-2xl">
          Los favoritos se irán mostrando aquí
        </p>
      )}
    </>
  );
};
export default FavoritesPage;
