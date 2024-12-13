//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
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

    // Episode code
    const episodeCode = document.createElement("p");
    episodeCode.classList.add("episode-code");
    episodeCode.textContent = getEpisodeCode(episode);

    // Summary
    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

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
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

// Run setup when the page loads
window.onload = setup;

