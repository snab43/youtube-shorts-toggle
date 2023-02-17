// Constants
const DESKTOP_SHORTS_CONTAINERS_TAG = "ytd-grid-video-renderer";
const DESKTOP_SHELF_TAG = "ytd-reel-shelf-renderer";
const DESKTOP_SHORTS_TAB_SELECTOR = "ytd-guide-entry-renderer>a:not([href])";
const DESKTOP_SHORTS_MINI_TAB_SELECTOR = "ytd-mini-guide-entry-renderer>a:not([href])";
const SHELF_TAG_REGEX = /yt[dm]-reel-shelf-renderer/gm
const SHELF_ITEM_TAG_REGEX = /yt[dm]-reel-item-renderer/gm

// Wait for element
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

function setup() {
	// Load settings
	let toggleOnlyMode, shortsVisible, videosVisible;

    browser.storage.local.get(null, function(result) {
		// Sets default expected values if null
        result.toggleOnlyMode == null ? toggleOnlyMode = false : toggleOnlyMode = result.toggleOnlyMode;
		result.shortsVisible == null ? shortsVisible = false : shortsVisible = result.shortsVisible;
		result.videosVisible == null ? videosVisible = true : videosVisible = result.videosVisible;

		// Failsafe for two broken modes:
		// 1. Shorts off, Videos off
		// 2. Shorts on, Videos on, Toggle Only Mode on
		if ((!shortsVisible && !videosVisible) || (shortsVisible && videosVisible && toggleOnlyMode)) {
			shortsVisible = false;
			videosVisible = true;
		}

		// Save values
		browser.storage.local.set({
			toggleOnlyMode: toggleOnlyMode,
			shortsVisible: shortsVisible,
			videosVisible: videosVisible
		});

		toggleItems('href="/shorts/', shortsVisible);
		toggleItems('href="/watch', videosVisible);

		setupUI(shortsVisible, videosVisible);
	});
}

function setupUI(shortsVisible, videosVisible) {
	// Create the container for both buttons
	let toggleContainer = document.createElement('div');
	toggleContainer.classList.add('style-scope', 'ytd-shelf-renderer');
	toggleContainer.setAttribute('id', 'toggleContainer');

	// Create the Shorts button
	let toggleShortsButton = document.createElement('div');
	if (shortsVisible) toggleShortsButton.classList.add('toggle-button-selected');
	toggleShortsButton.setAttribute('id', 'toggle-shorts-button');
	toggleShortsButton.innerText = "Shorts";

	// Create the Videos button
	let toggleVideosButton = document.createElement('div');
	if (videosVisible) toggleVideosButton.classList.add('toggle-button-selected');
	toggleVideosButton.setAttribute('id', 'toggle-videos-button');
	toggleVideosButton.innerText = "Videos";

	// Append the buttons to the button container
	toggleContainer.appendChild(toggleShortsButton);
	toggleContainer.appendChild(toggleVideosButton);

	// Append to the end of the #title-container
	let titleContainer = document.getElementById('title-container');
	titleContainer.appendChild(toggleContainer);

	// Add listeners
	waitForElement('#toggle-shorts-button').then(() => {
		let toggleShortsButton = document.getElementById('toggle-shorts-button');

		toggleShortsButton.onclick = (e) => {
			toggleShorts(e);
		}
	});
	
	waitForElement('#toggle-videos-button').then(() => {
		let toggleVideosButton = document.getElementById('toggle-videos-button');

		toggleVideosButton.onclick = (e) => {
			toggleVideos(e);
		}
	});
}

function toggleShorts(e) {
	e.target.classList.toggle('toggle-button-selected');

	browser.storage.local.get(null, function(result) {
		let shortsVisible = result.shortsVisible;
		let videosVisible = result.videosVisible;

		shortsVisible = !shortsVisible;
		toggleItems('href="/shorts/', shortsVisible);

		if ((!shortsVisible && !videosVisible) || (shortsVisible && videosVisible && result.toggleOnlyMode)) {
			let toggleVideosButton = document.getElementById('toggle-videos-button');
			toggleVideosButton.classList.toggle('toggle-button-selected');
			videosVisible = !videosVisible;
			toggleItems('href="/watch', videosVisible);
		}

		browser.storage.local.set({
			shortsVisible: shortsVisible,
			videosVisible: videosVisible
		});
	});
}

function toggleVideos(e) {
	e.target.classList.toggle('toggle-button-selected');

	browser.storage.local.get(null, function(result) {
		let shortsVisible = result.shortsVisible;
		let videosVisible = result.videosVisible;

		videosVisible = !videosVisible;
		toggleItems('href="/watch', videosVisible);

		if ((!shortsVisible && !videosVisible) || (shortsVisible && videosVisible && result.toggleOnlyMode)) {
			let toggleShortsButton = document.getElementById('toggle-shorts-button');
			toggleShortsButton.classList.toggle('toggle-button-selected');
			shortsVisible = !shortsVisible;
			toggleItems('href="/shorts/', shortsVisible);
		}

		browser.storage.local.set({
			shortsVisible: shortsVisible,
			videosVisible: videosVisible
		});
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