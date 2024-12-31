const rootElem = document.getElementById("root");
let allEpisodes = [];

// Function to fetch episodes data from the API
async function fetchEpisodes() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to load episodes');
    }

    // Parse the response as JSON
    allEpisodes = await response.json();

    // Call the functions to display data
    createSearchAndSelectInputs(allEpisodes);
    makePageForEpisodes(allEpisodes, allEpisodes.length);
  } catch (error) {
    showError(error.message);
  }
}

// Function to show an error message to the user
function showError(errorMessage) {
  const errorDiv = document.createElement('div');
  errorDiv.id = 'error-message';
  errorDiv.textContent = `Error: ${errorMessage}. Please try again later.`;
  rootElem.appendChild(errorDiv);
}

// Setup function that runs when the page loads
function setup() {
  fetchEpisodes(); // Fetch the episodes data when the page loads
}

function createSearchAndSelectInputs(allEpisodes) {
  const searchBlock = document.createElement("div");
  searchBlock.id = "search-block";

  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";

  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.addEventListener("input", () => handleSearch(allEpisodes));

  const searchResult = document.createElement("p");
  searchResult.id = "search-result";
  searchResult.textContent = `Showing ${allEpisodes.length} of ${allEpisodes.length} episode(s)`;

  const episodeSelector = document.createElement("select");
  episodeSelector.id = "episode-selector";
  episodeSelector.addEventListener("change", (event) => handleSelect(event, allEpisodes));

  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Show All Episodes";
  episodeSelector.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const option = document.createElement("option");
    option.value = `${episode.season}-${episode.number}`;
    option.textContent = `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")} - ${episode.name}`;
    episodeSelector.appendChild(option);
  });

  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(episodeSelector);
  searchContainer.appendChild(searchResult);
  searchBlock.appendChild(searchContainer);
  rootElem.parentNode.insertBefore(searchBlock, rootElem);
}

function handleSearch(allEpisodes) {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );

  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${filteredEpisodes.length} of ${allEpisodes.length} episode(s)`;

  makePageForEpisodes(filteredEpisodes);
}

function handleSelect(event, allEpisodes) {
  const selectedValue = event.target.value;

  let selectedEpisodes;
  if (selectedValue === "all") {
    selectedEpisodes = allEpisodes;
  } else {
    const [season, episode] = selectedValue.split("-");
    selectedEpisodes = allEpisodes.filter(
      (singleEpisode) => singleEpisode.season === parseInt(season) && singleEpisode.number === parseInt(episode)
    );
  }

  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${selectedEpisodes.length} of ${allEpisodes.length} episode(s)`;

  makePageForEpisodes(selectedEpisodes);
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