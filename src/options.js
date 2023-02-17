window.onload = () => {
    // Adds version
    let manifestData = browser.runtime.getManifest();
    document.getElementById("version").textContent = "Version " + manifestData.version;
}