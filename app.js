// 🌙 Mode sombre
document.getElementById("themeToggle")?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Charger thème
if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark");


// 🔐 Interface utilisateur
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");

function updateUserUI() {
    const user = JSON.parse(localStorage.getItem("user"));
    const us = document.getElementById("userStatus");

    if (us) us.textContent = user ? "Connecté : " + user.username : "";
    if (loginBtn) loginBtn.style.display = user ? "none" : "inline-block";
    if (logoutBtn) logoutBtn.style.display = user ? "inline-block" : "none";
}

if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("user");
        window.location.href = "login.html";
    };
}

updateUserUI();


// ❤️ FAVORIS
function addFavorite(recipe) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return window.location.href = "login.html";

    let favs = JSON.parse(localStorage.getItem("favorites_" + user.username)) || [];
    favs.push(recipe);
    localStorage.setItem("favorites_" + user.username, JSON.stringify(favs));
}

function loadFavorites() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const favs = JSON.parse(localStorage.getItem("favorites_" + user.username)) || [];
    const container = document.getElementById("favoritesList");
    if (!container) return;

    container.innerHTML = favs.length === 0
        ? "<p>Aucun favori pour le moment.</p>"
        : favs.map(f => `
            <div class="recipe-card">
                <h3>${f.title}</h3>
                <p>${f.text.replace(/\n/g, "<br>")}</p>
            </div>
        `).join("");
}


// 📜 HISTORIQUE
function addHistory(recipe) {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    let hist = JSON.parse(localStorage.getItem("history_" + user.username)) || [];
    hist.unshift({
        date: new Date().toLocaleString(),
        ...recipe
    });

    localStorage.setItem("history_" + user.username, JSON.stringify(hist));
}

function loadHistory() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const hist = JSON.parse(localStorage.getItem("history_" + user.username)) || [];
    const container = document.getElementById("historyList");
    if (!container) return;

    container.innerHTML = hist.length === 0
        ? "<p>Aucun historique pour le moment.</p>"
        : hist.map(h => `
            <div class="recipe-card">
                <small>${h.date}</small>
                <h3>${h.title}</h3>
                <p>${h.text.replace(/\n/g, "<br>")}</p>
            </div>
        `).join("");
}


// 🤖 GROQ – Génération de recette
document.getElementById("generateBtn")?.addEventListener("click", async () => {
    const prompt = document.getElementById("mealPrompt").value;
    if (!prompt) return alert("Écris une idée de repas !");

    const resultDiv = document.getElementById("recipeResult");
    resultDiv.innerHTML = "⏳ Génération...";

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer YOUR_GROQ_API_KEY"
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    { role: "system", content: "Tu es un chef professionnel." },
                    { role: "user", content: `Génère une recette claire basée sur : ${prompt}.` }
                ]
            })
        });

        const data = await response.json();
        const text = data.choices[0].message.content;

        resultDiv.innerHTML = `
            <div class="recipe-card">
                <h3>Recette générée</h3>
                <p>${text.replace(/\n/g, "<br>")}</p>
                <button id="favBtn">❤️ Ajouter aux favoris</button>
            </div>
        `;

        document.getElementById("favBtn").onclick = () => {
            const recipe = { title: "Recette IA", text };
            addFavorite(recipe);
            addHistory(recipe);
        };

        addHistory({ title: "Recette IA", text });

    } catch (e) {
        resultDiv.innerHTML = "❌ Erreur de génération.";
        console.error(e);
    }
});