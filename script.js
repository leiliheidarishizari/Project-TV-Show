// Get the root element to render the content on the page
const rootElem = document.getElementById("root");

// Global variables to store shows, episodes, and cache for episodes
let allEpisodes = []; // Array to store all episodes
let allShows = []; // Array to store all shows
let showEpisodesCache = {}; // Cache to store episodes by show ID

// Fetch all shows from the TVMaze API
async function fetchShows() {
  try {
    // Fetch the list of shows
    const response = await fetch("https://api.tvmaze.com/shows");

    // Check if the response is not OK
    if (!response.ok) {
      throw new Error("Failed to load shows"); // Throw error if fetch fails
    }

    // Parse the response into JSON and store in `allShows`
    allShows = await response.json();

    // Sort shows alphabetically by their name (case-insensitive)
    allShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // Display the sorted show list and populate the dropdown selector
    displayShowList(allShows);
    createShowSelector(allShows);
  } catch (error) {
    // Display error message if fetching shows fails
    displayError(error.message);
  }
}

// Fetch episodes for a specific show by its ID
async function fetchEpisodes(showId) {
  // Check if episodes for the show are already cached
  if (showEpisodesCache[showId]) {
    return showEpisodesCache[showId]; // Return cached episodes if available
  }

  try {
    // Fetch episodes for the specific show
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);

    // Check if the response is not OK
    if (!response.ok) {
      throw new Error("Failed to load episodes"); // Throw error if fetch fails
    }

    // Parse the response into JSON and store it in the cache
    const episodes = await response.json();
    showEpisodesCache[showId] = episodes; // Cache the episodes
    return episodes; // Return the episodes
  } catch (error) {
    // Display error message if fetching episodes fails
    displayError(error.message);
    return []; // Return an empty array in case of an error
  }
}

// Display the list of shows on the homepage
function displayShowList(shows) {
  rootElem.innerHTML = ""; // Clear the root element

  shows.forEach((show) => {
    // Create a card for each show
    const showCard = document.createElement("div");

    // Add the show's image
    const showImage = document.createElement("img");
    showImage.src = show.image ? show.image.medium : "placeholder.jpg"; // Use a placeholder if no image is available
    showImage.alt = `${show.name} Thumbnail`;

    // Add the show's information (name, summary, genres, etc.)
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

    // Add a click event listener to load episodes when the show name is clicked
    showName.addEventListener("click", async () => {
      const episodes = await fetchEpisodes(show.id); // Fetch episodes for the show
      displayEpisodeList(episodes); // Display the episodes
    });

    // Append the show's details to the card
    showInfo.append(showName, showSummary, showGenres, showStatus, showRuntime, showRating);
    showCard.append(showImage, showInfo);
    rootElem.appendChild(showCard); // Add the card to the root element
  });
}

// Display the list of episodes for a selected show
function displayEpisodeList(episodes) {
  rootElem.innerHTML = ""; // Clear the root element

  episodes.forEach((episode) => {
    // Create a card for each episode
    const episodeCard = document.createElement("div");
    episodeCard.className = "episode-card";

    // Add the episode's image
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "placeholder.jpg"; // Use a placeholder if no image is available
    episodeImage.alt = `${episode.name} Thumbnail`;

    // Add the episode's information (title, summary)
    const episodeInfo = document.createElement("div");
    const episodeTitle = document.createElement("h3");
    episodeTitle.textContent = `${getEpisodeCode(episode)} - ${episode.name}`;

    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

    // Append the episode details to the card
    episodeInfo.append(episodeTitle, episodeSummary);
    episodeCard.append(episodeImage, episodeInfo);
    rootElem.appendChild(episodeCard); // Add the card to the root element
  });

  // Add a "Back to Shows" button to navigate back
  const backToShowList = document.createElement("button");
  backToShowList.textContent = "Back to Shows";
  backToShowList.addEventListener("click", () => displayShowList(allShows));
  rootElem.appendChild(backToShowList);
}

// Generate a formatted episode code (e.g., "S01E02")
function getEpisodeCode(episode) {
  return `S${String(episode.season).padStart(2, "0")}E${String(episode.number).padStart(2, "0")}`;
}

// Create a dropdown selector for shows and a search bar
function createShowSelector(shows) {
  const selectorBlock = document.getElementById("selector-block") || document.createElement("div");
  selectorBlock.id = "selector-block";
  selectorBlock.innerHTML = ""; // Clear existing content

  // Create the dropdown selector
  const showSelector = document.createElement("select");
  showSelector.id = "show-selector";

  // Add a default "Select a show" option
  const defaultOption = document.createElement("option");
  defaultOption.value = "all";
  defaultOption.textContent = "Select a show";
  showSelector.appendChild(defaultOption);

  // Populate the selector with shows
  shows.forEach((show) => {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });

  // Handle show selection changes
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (showId === "all") {
      displayShowList(allShows); // Show all shows if "all" is selected
    } else {
      const episodes = await fetchEpisodes(showId); // Fetch episodes for the selected show
      displayEpisodeList(episodes); // Display the episodes
    }
  });

  // Create a search bar for shows
  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search shows...";
  searchInput.addEventListener("input", handleSearch); // Add input event listener

  // Append the selector and search bar to the selector block
  selectorBlock.append(showSelector, searchInput);
  document.body.insertBefore(selectorBlock, rootElem); // Insert the block above the root element
}

// Handle search functionality for shows
function handleSearch() {
  const searchTerm = document.getElementById("search-input").value.toLowerCase(); // Get the search term
  const filteredShows = allShows.filter(
    (show) =>
      show.name.toLowerCase().includes(searchTerm) || // Match by name
      show.genres.some((genre) => genre.toLowerCase().includes(searchTerm)) || // Match by genres
      (show.summary && show.summary.toLowerCase().includes(searchTerm)) // Match by summary
  );
  displayShowList(filteredShows); // Display the filtered shows
}

// Display an error message on the page
function displayError(message) {
  const errorDiv = document.getElementById("error-message") || document.createElement("div");
  errorDiv.id = "error-message";
  errorDiv.className = "error"; // Add an error class for styling
  errorDiv.textContent = `Error: ${message}`; // Set the error message
  rootElem.appendChild(errorDiv); // Append the error message to the root element
}

// Initialize the app by fetching shows
function setup() {
  fetchShows(); // Fetch and display shows when the page loads
}

// Run the setup function when the page finishes loading
window.onload = setup;
