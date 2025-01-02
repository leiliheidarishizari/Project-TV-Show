const rootElem = document.getElementById("root");
let allEpisodes = [];
let allShows = [];
let showEpisodesCache = {};

// Function to fetch shows data from the API
async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to load shows");
    }
    // Parse the response as JSON
    allShows = await response.json();
    allShows.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    // Call the functions to display data
    createShowSelector(allShows);
  } catch (error) {
    showError(error.message);
  }
}

// Fetch episodes for a specific show
async function fetchEpisodesForShow(showId) {
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
    showError(error.message);
    return [];
  }
}

// Function to create the show selector dropdown
function createShowSelector(shows) {
  const showSelector = document.createElement("select");
  showSelector.id = "show-selector";
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;

    if (showId === "all") {
      rootElem.innerHTML = "";
      return;
    }

    allEpisodes = await fetchEpisodesForShow(showId);
    updateEpisodeSelector(allEpisodes);
    createSearchAndSelectInputs(allEpisodes);
    makePageForEpisodes(allEpisodes);
  });

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

  const selectorBlock = document.createElement("div");
  selectorBlock.id = "selector-block";
  selectorBlock.appendChild(showSelector);

  const episodeSelector = document.createElement("select");
  episodeSelector.id = "episode-selector";
  
  const defaultEpisodeOption = document.createElement("option");
  defaultEpisodeOption.value = "all";
  defaultEpisodeOption.textContent = "Select an episode";
  episodeSelector.appendChild(defaultEpisodeOption);
  episodeSelector.addEventListener("change", (event) => handleEpisodeSelect(event, allEpisodes));
  selectorBlock.appendChild(episodeSelector);
  document.body.insertBefore(selectorBlock, document.body.firstChild);
}

function updateEpisodeSelector(episodes) {
  const episodeSelector = document.getElementById("episode-selector");
  episodeSelector.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Show All Episodes";
  episodeSelector.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });
}

// Function to handle episode selector
function handleEpisodeSelect(event, episodes) {
  const selectedValue = event.target.value;
  let selectedEpisodes;
  if (selectedValue === "all") {
    selectedEpisodes = episodes;
  } else {
    const [season, episode] = selectedValue.split("-");
    selectedEpisodes = episodes.filter(
      (singleEpisode) =>
        singleEpisode.season === parseInt(season) &&
        singleEpisode.number === parseInt(episode)
    );
  }

  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${selectedEpisodes.length} of ${episodes.length} episode(s)`;

  makePageForEpisodes(selectedEpisodes);
}

// Function to show an error message to the user
function showError(errorMessage) {
  const errorDiv = document.getElementById("error-message") || document.createElement("div");
  errorDiv.id = "error-message";
  errorDiv.textContent = `Error: ${errorMessage}. Please try again later.`;
  rootElem.appendChild(errorDiv);
}

// Setup function that runs when the page loads
function setup() {
  createSearchAndSelectInputs([]);
  fetchShows(); // Fetch the episodes data when the page loads
}

function createSearchAndSelectInputs(episodes) {
  let searchBlock = document.getElementById("search-block");
  if (searchBlock) {
    searchBlock.remove();
  }

  searchBlock = document.createElement("div");
  searchBlock.id = "search-block";

  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.addEventListener("input", () => handleSearch(episodes));

  const searchResult = document.createElement("p");
  searchResult.id = "search-result";
  searchResult.textContent = `Showing ${episodes.length} of ${episodes.length} episode(s)`;

  searchBlock.appendChild(searchInput);
  searchBlock.appendChild(searchResult);
  rootElem.parentNode.insertBefore(searchBlock, rootElem);
}

function handleSearch(episodes) {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredEpisodes = episodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      (episode.summary && episode.summary.toLowerCase().includes(searchTerm))
  );

  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${filteredEpisodes.length} of ${episodes.length} episode(s)`;

  makePageForEpisodes(filteredEpisodes);
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; // Clear any existing content

  episodeList.forEach((episode) => {
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "placeholder.jpg";
    episodeImage.alt = `${episode.name} Thumbnail`;

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    const episodeTitle = document.createElement("h3");
    episodeTitle.textContent = episode.name;

    const episodeCode = document.createElement("span");
    episodeCode.classList.add("episode-code");
    episodeCode.textContent = getEpisodeCode(episode);

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

    contentDiv.appendChild(episodeTitle);
    contentDiv.appendChild(episodeCode);
    contentDiv.appendChild(episodeSummary);
    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(contentDiv);

    rootElem.appendChild(episodeCard);
  });
}

function getEpisodeCode(episode) {
  const seasonNum = String(episode.season).padStart(2, "0");
  const episodeNum = String(episode.number).padStart(2, "0");
  return `S${seasonNum}E${episodeNum}`;
}

// Run setup when the page loads
window.onload = setup;
