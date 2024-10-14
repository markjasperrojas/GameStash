let games = JSON.parse(localStorage.getItem("games")) || [];
let gameId = games.length ? games[games.length - 1].id + 1 : 0;
let editingGame = null;

document.getElementById("addGameBtn").addEventListener("click", openGameForm);
document.querySelectorAll(".closeBtn").forEach(btn => btn.addEventListener("click", closeModal));
document.getElementById("newGameForm").addEventListener("submit", addOrUpdateGame);
document.getElementById("searchBar").addEventListener("input", filterGames);

function openGameForm() {
    document.getElementById("formTitle").innerText = "Add a New Game";
    document.getElementById("newGameForm").reset();
    editingGame = null;
    document.getElementById("gameForm").style.display = "flex";
}

function closeModal() {
    document.querySelectorAll(".modal").forEach(modal => modal.style.display = "none");
}

function addOrUpdateGame(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const releaseDate = document.getElementById("releaseDate").value;
    const image = document.getElementById("image").files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
        const gameData = {
            id: editingGame ? editingGame.id : gameId++,
            title,
            releaseDate,
            image: reader.result
        };

        if (editingGame) {
            games = games.map(game => game.id === editingGame.id ? gameData : game);
            editingGame = null;
        } else {
            games.push(gameData);
        }

        localStorage.setItem("games", JSON.stringify(games));
        displayGames(games);
        closeModal();
    };
    reader.readAsDataURL(image);
}

function displayGames(gameList) {
    const gameListDiv = document.getElementById("gameList");
    gameListDiv.innerHTML = "";
    gameList.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `
            <img src="${game.image}" alt="${game.title}">
            <h3>${game.title}</h3>
            <p>Release Date: ${game.releaseDate}</p>
            <button onclick="editGame(${game.id})">Update</button>
            <button onclick="viewGame(${game.id})">View</button>
            <button onclick="deleteGame(${game.id})">Delete</button>
        `;
        gameListDiv.appendChild(gameCard);
    });
}

function editGame(id) {
    const game = games.find(game => game.id === id);
    editingGame = game;
    document.getElementById("title").value = game.title;
    document.getElementById("releaseDate").value = game.releaseDate;
    document.getElementById("formTitle").innerText = "Update Game";
    document.getElementById("gameForm").style.display = "flex";
}

function viewGame(id) {
    const game = games.find(game => game.id === id);
    document.getElementById("gameTitle").innerText = game.title;
    document.getElementById("gameImage").src = game.image;
    document.getElementById("gameReleaseDate").innerText = `Release Date: ${game.releaseDate}`;
    document.getElementById("viewGameModal").style.display = "flex";
}

function deleteGame(id) {
    games = games.filter(game => game.id !== id);
    localStorage.setItem("games", JSON.stringify(games));
    displayGames(games);
}

function filterGames() {
    const searchQuery = document.getElementById("searchBar").value.toLowerCase();
    const filteredGames = games.filter(game => game.title.toLowerCase().includes(searchQuery));
    displayGames(filteredGames);
}

// Initial display of saved games
displayGames(games);
