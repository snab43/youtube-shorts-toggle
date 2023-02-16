window.onload = () => {
    // Adds version
    let manifestData = chrome.runtime.getManifest();
    document.getElementById("version").textContent = "Version " + manifestData.version;
}