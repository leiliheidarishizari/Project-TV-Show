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
    const episodeCode = document.createElement("p"); // Nadika's comment - I prefer to put this details in a <span> tag. We usually use it for styling small details. 
    episodeCode.classList.add("episode-code");
    episodeCode.textContent = getEpisodeCode(episode);

    // Summary
    const episodeSummary = document.createElement("p");
    episodeSummary.innerHTML = episode.summary;

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
  const season = String(episode.season).padStart(2, "0"); // Nadika's comment - I think this variable is better called 'seasonNum' to be consistent with the name of the variable below.
  const number = String(episode.number).padStart(2, "0"); // Nadika's comment - I think this variable is better called 'episodeNum' to make it clear what the number represents.
  return `S${season}E${number}`;
}

// Run setup when the page loads
window.onload = setup;

