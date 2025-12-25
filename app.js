// app.js - Gestionnaire de Recettes et API Groq

// 1. Configuration (Mets ta clé ici ou utilise un prompt)
const GROQ_API_KEY = "TA_CLE_GROQ_ICI"; 

// 2. Simulation de la base de données de 2000 recettes
const generateDatabase = () => {
    const categories = ["Italien", "Français", "Asie", "Vegan", "Dessert", "Street Food"];
    return Array.from({ length: 2000 }, (_, i) => ({
        id: i + 1,
        title: `Plat Signature #${i + 1}`, // Dans un vrai projet, remplace par des noms réels
        category: categories[Math.floor(Math.random() * categories.length)],
        img: `https://picsum.photos/seed/${i + 100}/400/300`
    }));
};

const allRecipes = generateDatabase();
let currentIndex = 0;
const step = 12; // Nombre de recettes affichées par clic

// 3. Fonction d'affichage des cartes
function displayBatch() {
    const grid = document.getElementById('recipeGrid');
    const nextBatch = allRecipes.slice(currentIndex, currentIndex + step);

    nextBatch.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${recipe.img}')">
                <span class="category-tag">${recipe.category}</span>
            </div>
            <div class="card-body">
                <h3>${recipe.title}</h3>
                <button class="btn-open">Voir la recette IA</button>
            </div>
        `;
        
        // Evenement au clic
        card.addEventListener('click', () => fetchAiRecipe(recipe.title));
        grid.appendChild(card);
    });

    currentIndex += step;

    // Cacher le bouton si on arrive au bout des 2000
    if (currentIndex >= allRecipes.length) {
        document.getElementById('loadMore').style.display = 'none';
    }
}

// 4. Appel à l'IA Groq
async function fetchAiRecipe(recipeTitle) {
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalBody');
    
    modal.style.display = 'block';
    modalBody.innerHTML = `
        <div class="loader-container">
            <div class="spinner"></div>
            <p>Le Chef IA Groq rédige votre recette de <strong>${recipeTitle}</strong>...</p>
        </div>
    `;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "Tu es un chef étoilé. Rédige une recette structurée en HTML (utilise <h2> pour les titres, <ul> pour les ingrédients et <ol> pour les étapes). Sois précis et gourmet." 
                    },
                    { 
                        role: "user", 
                        content: `Donne-moi la recette complète pour : ${recipeTitle}` 
                    }
                ],
                temperature: 0.6
            })
        });

        const data = await response.json();
        const htmlContent = data.choices[0].message.content;
        
        // Affichage de la recette
        modalBody.innerHTML = `
            <h1 style="color: #ff4757;">${recipeTitle}</h1>
            <hr>
            ${htmlContent}
        `;

    } catch (error) {
        modalBody.innerHTML = `<p style="color:red">Erreur : Impossible de joindre le chef IA. Vérifiez votre clé API Groq.</p>`;
    }
}

// 5. Initialisation et Event Listeners
document.getElementById('loadMore').addEventListener('click', displayBatch);

// Fermeture de la modale
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('recipeModal').style.display = 'none';
};

window.onclick = (event) => {
    const modal = document.getElementById('recipeModal');
    if (event.target == modal) modal.style.display = 'none';
};

// Charger les premières recettes au démarrage
displayBatch();

// Bonus: Vérifier si l'utilisateur est connecté (Discord)
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
    document.getElementById('userZone').innerHTML = `
        <div class="user-profile">
            <img src="${user.avatar}" alt="Avatar">
            <span>${user.username}</span>
            <button onclick="localStorage.clear(); location.reload();" class="btn-logout">Quitter</button>
        </div>
    `;
}
