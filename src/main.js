// Constants
const SHORTS_ICON = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g height="24" viewBox="0 0 24 24" width="24" class="style-scope yt-icon"><path d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z" class="style-scope yt-icon"></path></g></svg>';
const VIDEOS_ICON = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M21.58,7.19a2.51,2.51,0,0,0-1.77-1.77C18.25,5,12,5,12,5s-6.25,0-7.81.42A2.51,2.51,0,0,0,2.42,7.19,25.87,25.87,0,0,0,2,12a25.87,25.87,0,0,0,.42,4.81,2.51,2.51,0,0,0,1.77,1.77C5.75,19,12,19,12,19s6.25,0,7.81-.42a2.51,2.51,0,0,0,1.77-1.77A25.87,25.87,0,0,0,22,12,25.87,25.87,0,0,0,21.58,7.19ZM10,14.65V9.35L15,12Z" class="style-scope yt-icon"></path></g></svg>';

// Wait for element function
// Taken from: https://stackoverflow.com/a/61511955 (Thank you)
function waitForElement(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const OBSERVER = new MutationObserver(mutations => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				OBSERVER.disconnect();
			}
		});

		OBSERVER.observe(document.body, {
			childList: true,
			subtree: true
		});
	});
}

// Setup the UI
function setup() {
	let titleContainer = document.getElementById("title-container");

	let toggleContainer = document.createElement('div');
	toggleContainer.classList.add("style-scope", "ytd-shelf-renderer");
	toggleContainer.innerHTML = `\
		<div class="style-scope ytd-shelf-renderer" condensed="" has-items="2">\
			<div id="toggle-shorts-buttons-computed" class="top-level-buttons">\
				<div id="toggle-shorts-button" class="style-scope ytd-menu-renderer toggle-button-selected" button-rendereer="">${SHORTS_ICON}</div>\
				<div id="toggle-videos-button" class="style-scope ytd-menu-renderer toggle-button-selected" button-rendereer="">${VIDEOS_ICON}</div>\
			</div>\
		</div>\
	`;
	titleContainer.appendChild(toggleContainer);

	addListeners();
}

function addListeners() {
	waitForElement('#toggle-shorts-button').then((element) => {
		let toggleShortsButton = document.getElementById("toggle-shorts-button");

		toggleShortsButton.onclick = () => {
			toggleShortsButton.classList.toggle("toggle-button-selected");
		}
	});
	
	waitForElement('#toggle-videos-button').then((element) => {
		let toggleVideosButton = document.getElementById("toggle-videos-button");

		toggleVideosButton.onclick = () => {
			toggleVideosButton.classList.toggle("toggle-button-selected");
		}
	});
}

waitForElement('#title-container').then((element) => {
	setup();
});