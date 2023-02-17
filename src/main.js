// Constants
const DESKTOP_SHORTS_CONTAINERS_TAG = "ytd-grid-video-renderer";
const DESKTOP_SHELF_TAG = "ytd-reel-shelf-renderer";
const DESKTOP_SHORTS_TAB_SELECTOR = "ytd-guide-entry-renderer>a:not([href])";
const DESKTOP_SHORTS_MINI_TAB_SELECTOR = "ytd-mini-guide-entry-renderer>a:not([href])";
const SHELF_TAG_REGEX = /yt[dm]-reel-shelf-renderer/gm
const SHELF_ITEM_TAG_REGEX = /yt[dm]-reel-item-renderer/gm

// Global variables
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
	toggleShortsButton.innerText = "Shorts";

	// Create the Videos button
	let toggleVideosButton = document.createElement('div');
	toggleVideosButton.classList.add('toggle-button-selected');
	toggleVideosButton.setAttribute('id', 'toggle-videos-button');
	toggleVideosButton.innerText = "Videos";

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
			toggleItems('href="/shorts/', shortsVisible);
		}
	});
	
	waitForElement('#toggle-videos-button').then((element) => {
		let toggleVideosButton = document.getElementById('toggle-videos-button');

		toggleVideosButton.onclick = () => {
			toggleVideosButton.classList.toggle('toggle-button-selected');
			videosVisible = !videosVisible;
			toggleItems('href="/watch', videosVisible);
		}
	});
}

function toggleItems(href, visibility) {
	let selectorString = DESKTOP_SHORTS_CONTAINERS_TAG + "," + DESKTOP_SHELF_TAG;

	elements = document.querySelectorAll(selectorString);
	elements.forEach(element => {
    if ((element.tagName.toLowerCase().match(SHELF_TAG_REGEX) 
      && element.innerHTML.search(SHELF_ITEM_TAG_REGEX) != -1) 
      || element.innerHTML.search(href) != -1)
    {
      if (!visibility) {
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