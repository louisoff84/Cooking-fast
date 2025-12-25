// Simule une base de données massive
export const allRecipes = Array.from({ length: 2000 }, (_, i) => ({
    id: i + 1,
    title: `Recette Incroyable #${i + 1}`,
    ingredients: ["Ingrédient A", "Ingrédient B", "Secret du Chef"],
    description: "Une étape simple pour un goût unique.",
    image: `https://picsum.photos/seed/${i}/300/200`
}));
