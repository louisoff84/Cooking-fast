import { allRecipes } from './recipes-data.js';

let itemsShown = 20;
const increment = 20;

function displayRecipes() {
    const grid = document.getElementById('recipeGrid');
    const fragment = document.createDocumentFragment();

    const currentBatch = allRecipes.slice(itemsShown - increment, itemsShown);

    currentBatch.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <div style="padding:15px">
                <h3>${recipe.title}</h3>
                <p>${recipe.description}</p>
            </div>
        `;
        fragment.appendChild(card);
    });

    grid.appendChild(fragment);
}

document.getElementById('loadMore').addEventListener('click', () => {
    itemsShown += increment;
    displayRecipes();
    if (itemsShown >= 2000) document.getElementById('loadMore').style.display = 'none';
});

// Initialisation
displayRecipes();
