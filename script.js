const rootElem = document.getElementById("root");

function setup() {
  const allEpisodes = getAllEpisodes();

  // Add search and select inputs
  createSearchAndSelectInputs(allEpisodes);
  makePageForEpisodes(allEpisodes, allEpisodes.length);
}

function createSearchAndSelectInputs(allEpisodes) {

  // Create search block container
  const searchBlock = document.createElement("div");
  searchBlock.id = "search-block";

  // Create container for search (search input and episode selector)
  const searchContainer = document.createElement("div");
  searchContainer.id = "search-container";

  // Create search input
  const searchInput = document.createElement("input");
  searchInput.id = "search-input";
  searchInput.type = "text";
  searchInput.placeholder = "Search episodes...";
  searchInput.addEventListener("input", () => handleSearch(allEpisodes));

  // Create search result display
  const searchResult = document.createElement("p");
  searchResult.id = "search-result";
  searchResult.textContent = `Showing ${allEpisodes.length} of ${allEpisodes.length} episode(s)`;

  // Create episode selector
  const episodeSelector = document.createElement("select");
  episodeSelector.id = "episode-selector";
  episodeSelector.addEventListener("change", (event) => handleSelect(event, allEpisodes));

  // Populate selector options
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

  // Append elements to search container
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(episodeSelector);
  searchContainer.appendChild(searchResult);

  // Add search container to search block
  searchBlock.appendChild(searchContainer);

  // Add search block before root element
  rootElem.parentNode.insertBefore(searchBlock, rootElem);
}

function handleSearch(allEpisodes) {
  const searchTerm = document.getElementById("search-input").value.toLowerCase();
  const filteredEpisodes = allEpisodes.filter(
    (episode) =>
      episode.name.toLowerCase().includes(searchTerm) ||
      episode.summary.toLowerCase().includes(searchTerm)
  );

  // Update the Showing episode(s) text
  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${filteredEpisodes.length} of ${allEpisodes.length} episode(s)`;

  // Display the filtered episodes
  makePageForEpisodes(filteredEpisodes, allEpisodes.length);
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

  // Update the Showing episode(s) text
  const searchResult = document.getElementById("search-result");
  searchResult.textContent = `Showing ${selectedEpisodes.length} of ${allEpisodes.length} episode(s)`;

  // Display the selected episodes
  makePageForEpisodes(selectedEpisodes, allEpisodes.length);
}

function makePageForEpisodes(episodeList) {
  rootElem.innerHTML = ""; // Clear any existing content

  episodeList.forEach((episode) => {
    // Create a card for each episode
    const episodeCard = document.createElement("div");
    episodeCard.classList.add("episode-card");

    // Image
    const episodeImage = document.createElement("img");
    episodeImage.src = episode.image ? episode.image.medium : "placeholder.jpg";
    episodeImage.alt = `${episode.name} Thumbnail`;

    // Content container
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("content");

    // Episode title
    const episodeTitle = document.createElement("h3");
    episodeTitle.textContent = episode.name;

    // Episode code (using <span> instead of <p>)
    const episodeCode = document.createElement("span");
    // Nadika's comment - I prefer to put this details in a <span> tag. We usually use it for styling small details.

    episodeCode.classList.add("episode-code");
    episodeCode.textContent = getEpisodeCode(episode);

    // Summary
    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;
    // Nadika's comment - It's good practice to add a class to style an element in the future.

    // Nadika's comment - If we open the webpage code in the browser, we can see that Summary will be surrounded by two <p> tags.
    // To remove the <p> tags from the original array or remove any existing <p> tags from the summary content:
    // const summaryContent = episode.summary.replace(/<\/?p>/g, '');
    // episodeSummary.innerHTML = summaryContent;

    //  Nadika's comment - It's good practice to add a class to style an element in the future.

    // Nadika's comment - If we open the webpage code in the browser, we can see that Summary will be surrounded by two <p> tags. To remove the <p> tags from the original array or remove any existing <p> tags from the summary content.
    // const summaryContent = episode.summary.replace(/<\/?p>/g, '');
    // episodeSummary.innerHTML = summaryContent;

    // Append content to card
    contentDiv.appendChild(episodeTitle);
    contentDiv.appendChild(episodeCode);
    contentDiv.appendChild(episodeSummary);
    episodeCard.appendChild(episodeImage);
    episodeCard.appendChild(contentDiv);

    // Add card to root
    rootElem.appendChild(episodeCard);
  });
}

function getEpisodeCode(episode) {
  const seasonNum = String(episode.season).padStart(2, "0");
  // Nadika's comment - I think this variable is better called 'seasonNum' to be consistent with the name of the variable below.
  const episodeNum = String(episode.number).padStart(2, "0");
  // Nadika's comment - I think this variable is better called 'episodeNum' to make it clear what the number represents.
  return `S${seasonNum}E${episodeNum}`;
}

// Run setup when the page loads
window.onload = setup;
