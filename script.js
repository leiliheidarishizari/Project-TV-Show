const rootElem = document.getElementById("root");
let allEpisodes = [];
let allShows = [];
let showEpisodesCache = {};

// Fetch all shows
async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    if (!response.ok) {
      throw new Error("Failed to load shows");
    }
    allShows = await response.json();
    allShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    displayShowList(allShows);
    createShowSelector(allShows);
  } catch (error) {
    displayError(error.message);
  }
}

// Fetch episodes for a specific show
async function fetchEpisodes(showId) {
  if (showEpisodesCache[showId]) {
    return showEpisodesCache[showId];
  }
  try {
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    if (!response.ok) {
      throw new Error("Failed to load episodes");
    }
    const episodes = await response.json();
    showEpisodesCache[showId] = episodes;
    return episodes;
  } catch (error) {
    displayError(error.message);
    return [];
  }
}

// Display all shows on the homepage
function displayShowList(shows) {
  rootElem.innerHTML = "";
  shows.forEach((show) => {
    const showCard = document.createElement("div");
    showCard.className = "show-card";

    const showImage = document.createElement("img");
    showImage.src = show.image ? show.image.medium : "placeholder.jpg";
    showImage.alt = `${show.name} Thumbnail`;

    const showInfo = document.createElement("div");
    const showName = document.createElement("h2");
    showName.textContent = show.name;

    const showSummary = document.createElement("p");
    showSummary.innerHTML = show.summary;

    const showGenres = document.createElement("p");
    showGenres.textContent = `Genres: ${show.genres.join(", ")}`;

    const showStatus = document.createElement("p");
    showStatus.textContent = `Status: ${show.status}`;

    const showRuntime = document.createElement("p");
    showRuntime.textContent = `Runtime: ${show.runtime} mins`;

    const showRating = document.createElement("p");
    showRating.textContent = `Rating: ${show.rating.average || "N/A"}`;

    showName.addEventListener("click", async () => {
      const episodes = await fetchEpisodes(show.id);
      displayEpisodeList(episodes);
    });

    showInfo.append(showName, showSummary, showGenres, showStatus, showRuntime, showRating);
    showCard.append(showImage, showInfo);
    rootElem.appendChild(showCard);
  });
}

// Display all episodes for a specific show
function displayEpisodeList(episodes) {
  rootElem.innerHTML = "";
  episodes.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "placeholder.jpg";
    episodeImage.alt = `${episode.name} Thumbnail`;

    const episodeInfo = document.createElement("div");
    const episodeTitle = document.createElement("h3");
    episodeTitle.textContent = `${getEpisodeCode(episode)} - ${episode.name}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

    episodeInfo.append(episodeTitle, episodeSummary);
    episodeCard.append(episodeImage, episodeInfo);
    rootElem.appendChild(episodeCard);
  });

  const backToShowList = document.createElement("button");
  backToShowList.textContent = "Back to Shows";
  backToShowList.addEventListener("click", () => displayShowList(allShows));
  rootElem.appendChild(backToShowList);
}

// Get formatted episode code
function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

// Create show selector dropdown
function createShowSelector(shows) {
  const selectorBlock = document.getElementById("selector-block") || document.createElement("div");
  selectorBlock.id = "selector-block";
  selectorBlock.innerHTML = "";

  const showSelector = document.createElement("select");
  showSelector.id = "show-selector";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select a show";
  showSelector.appendChild(defaultOption);

  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });

  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (showId === "all") {
      displayShowList(allShows);
    } else {
      const episodes = await fetchEpisodes(showId);
      displayEpisodeList(episodes);
    }
  });

  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search shows...";
  searchInput.addEventListener("input", handleSearch);

  selectorBlock.append(showSelector, searchInput);
  document.body.insertBefore(selectorBlock, rootElem);
}

// Handle search functionality
function handleSearch() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredShows = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(searchTerm) ||
      show.genres.some((genre) => genre.toLowerCase().includes(searchTerm)) ||
      (show.summary && show.summary.toLowerCase().includes(searchTerm))
  );
  displayShowList(filteredShows);
}

// Display error message
function displayError(message) {
  const errorDiv = document.getElementById("error-message") || document.createElement("div");
  errorDiv.id = "error-message";
  errorDiv.className = "error";
  errorDiv.textContent = `Error: ${message}`;
  rootElem.appendChild(errorDiv);
}

// Setup function
function setup() {
  fetchShows();
}

// Initialize on page load
window.onload = setup;
