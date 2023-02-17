// Constants
const SHORTS_ICON = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g height="24" viewBox="0 0 24 24" width="24" class="style-scope yt-icon"><path d="M17.77 10.32c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zM10 14.65v-5.3L15 12l-5 2.65z" class="style-scope yt-icon"></path></g></svg>';
const VIDEOS_ICON = '<svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;" class="style-scope yt-icon"><g class="style-scope yt-icon"><path d="M21.58,7.19a2.51,2.51,0,0,0-1.77-1.77C18.25,5,12,5,12,5s-6.25,0-7.81.42A2.51,2.51,0,0,0,2.42,7.19,25.87,25.87,0,0,0,2,12a25.87,25.87,0,0,0,.42,4.81,2.51,2.51,0,0,0,1.77,1.77C5.75,19,12,19,12,19s6.25,0,7.81-.42a2.51,2.51,0,0,0,1.77-1.77A25.87,25.87,0,0,0,22,12,25.87,25.87,0,0,0,21.58,7.19ZM10,14.65V9.35L15,12Z" class="style-scope yt-icon"></path></g></svg>';


// Desktop tags
const DESKTOP_SHORTS_CONTAINERS_TAG = "ytd-grid-video-renderer";
const DESKTOP_SHELF_TAG = "ytd-reel-shelf-renderer";
const DESKTOP_SHORTS_TAB_SELECTOR = "ytd-guide-entry-renderer>a:not([href])";
const DESKTOP_SHORTS_MINI_TAB_SELECTOR = "ytd-mini-guide-entry-renderer>a:not([href])";

// Mobile tags
let isMobile = location.hostname == "m.youtube.com";
const MOBILE_SHORTS_CONTAINERS_TAG = "div[tab-identifier='FEsubscriptions']>ytm-section-list-renderer>lazy-list>ytm-item-section-renderer";
const MOBILE_SHELF_TAG = "ytm-reel-shelf-renderer";
const MOBILE_SHORTS_TAB_SELECTOR = "ytm-pivot-bar-item-renderer>div[class='pivot-bar-item-tab pivot-shorts']";

// Desktop and mobile
const SHELF_TAG_REGEX = /yt[dm]-reel-shelf-renderer/gm
const SHELF_ITEM_TAG_REGEX = /yt[dm]-reel-item-renderer/gm

// Variables
let shortsVisible = true;
let videosVisible = true;

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
	let titleContainer = document.getElementById('title-container');

	// Create the container for both buttons
	let toggleContainer = document.createElement('div');
	toggleContainer.classList.add('style-scope', 'ytd-shelf-renderer');
	toggleContainer.setAttribute('id', 'toggleContainer');

	// Create the Shorts button
	let toggleShortsButton = document.createElement('div');
	toggleShortsButton.classList.add('toggle-button-selected');
	toggleShortsButton.setAttribute('id', 'toggle-shorts-button');
	toggleShortsButton.appendChild(SHORTS_ICON);

	// Create the Videos button
	let toggleVideosButton = document.createElement('div');
	toggleVideosButton.classList.add('toggle-button-selected');
	toggleVideosButton.setAttribute('id', 'toggle-videos-button');
	toggleVideosButton.appendChild(VIDEOS_ICON);

	// Append the buttons to the button container
	toggleContainer.appendChild(toggleShortsButton);
	toggleContainer.appendChild(toggleVideosButton);

	// Append to the end of the #title-container
	titleContainer.appendChild(toggleContainer);

	addListeners();
}

function addListeners() {
	waitForElement('#toggle-shorts-button').then((element) => {
		let toggleShortsButton = document.getElementById('toggle-shorts-button');

		toggleShortsButton.onclick = () => {
			toggleShortsButton.classList.toggle('toggle-button-selected');
			shortsVisible = !shortsVisible;
			toggleShorts(shortsVisible);
		}
	});
	
	waitForElement('#toggle-videos-button').then((element) => {
		let toggleVideosButton = document.getElementById('toggle-videos-button');

		toggleVideosButton.onclick = () => {
			toggleVideosButton.classList.toggle('toggle-button-selected');
			videosVisible = !videosVisible;
			toggleVideos(videosVisible);
		}
	});
}

function toggleShorts(shortsVisible) {
	let selectorString = isMobile ? 
    MOBILE_SHORTS_CONTAINERS_TAG + "," + MOBILE_SHELF_TAG 
    : DESKTOP_SHORTS_CONTAINERS_TAG + "," + DESKTOP_SHELF_TAG;

	elements = document.querySelectorAll(selectorString);
	elements.forEach(element => {
    if ((element.tagName.toLowerCase().match(SHELF_TAG_REGEX) 
      && element.innerHTML.search(SHELF_ITEM_TAG_REGEX) != -1) 
      || element.innerHTML.search('href="/shorts/') != -1)
    {
      if (!shortsVisible) {
        element.setAttribute('hidden', true);
      }
      else if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden');
      }
    }
  });
}

function toggleVideos(videosVisible) {
	let selectorString = isMobile ? 
    MOBILE_SHORTS_CONTAINERS_TAG + "," + MOBILE_SHELF_TAG 
    : DESKTOP_SHORTS_CONTAINERS_TAG + "," + DESKTOP_SHELF_TAG;

	elements = document.querySelectorAll(selectorString);
	elements.forEach(element => {
    if ((element.tagName.toLowerCase().match(SHELF_TAG_REGEX) 
      && element.innerHTML.search(SHELF_ITEM_TAG_REGEX) != -1) 
      || element.innerHTML.search('href="/watch') != -1)
    {
      if (!videosVisible) {
        element.setAttribute('hidden', true);
      }
      else if (element.hasAttribute('hidden')) {
        element.removeAttribute('hidden');
      }
    }
  });
}

waitForElement('#title-container').then((element) => {
	setup();
});