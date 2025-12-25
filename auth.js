const DISCORD_CLIENT_ID = 'TON_CLIENT_ID';
const REDIRECT_URI = encodeURIComponent('http://localhost:5500/callback');

document.getElementById('discordLogin').href = 
    `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=identify`;

// Gestion simple Login/Register
const loginForm = document.getElementById('loginForm');
loginForm.onsubmit = (e) => {
    e.preventDefault();
    alert("Connecté avec succès !");
    document.querySelector('.auth-overlay').style.display = 'none';
};
