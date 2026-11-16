
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} from "./recipes.api";
import type { SavedRecipe } from "./recipes.types";

const KEY = ["recipes"] as const;

export function useSavedRecipes() {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: KEY });

  const query = useQuery({
    queryKey: KEY,
    queryFn: getRecipes,
  });

  const remove = useMutation({
    mutationFn: deleteRecipe,
    onSuccess: invalidate,
  });

  // TODO 8 — Create
  const create = useMutation({
    mutationFn: createRecipe,
    onSuccess: invalidate,
  });

  // TODO 11 — Update
  const update = useMutation({
    mutationFn: updateRecipe,
    onSuccess: invalidate,
  });

  // TODO 12 — Optimistic favorite toggle
  const favorite = useMutation({
    mutationFn: updateRecipe,

    onMutate: async ({ id, favorite }) => {
      await queryClient.cancelQueries({ queryKey: KEY });

      const previous = queryClient.getQueryData<SavedRecipe[]>(KEY);

      queryClient.setQueryData<SavedRecipe[]>(KEY, (old = []) =>
  old.map((recipe) =>
    recipe.id === id
      ? { ...recipe, favorite: Boolean(favorite) }
      : recipe
  )
);

      return { previous };
    },

    onError: (_error, _variables, context) => {
      queryClient.setQueryData(KEY, context?.previous);
    },

    onSettled: invalidate,
  });

  const saved = query.data ?? [];

  return {
    query,
    saved,
    savedMealIds: new Set(saved.map((r) => r.mealId)),
    favoriteCount: saved.filter((r) => r.favorite).length,
    create,
    update,
    remove,

    // TODO 12b — Toggle favorite
    toggleFavorite: (recipe: SavedRecipe) =>
      favorite.mutate({
        id: recipe.id,
        favorite: !recipe.favorite,
      }),
  };
}
