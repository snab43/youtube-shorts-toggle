window.onload = () => {
    // Loads settings
    browser.storage.local.get(null, function(result) {
        let toggleOnlyMode = document.querySelector('#toggleOnlyMode');
        toggleOnlyMode.checked = result.toggleOnlyMode;

        toggleOnlyMode.addEventListener("input", function(e) {
            browser.storage.local.set({
                toggleOnlyMode: e.target.checked
            })
        });
    });

    // Adds version
    let manifestData = browser.runtime.getManifest();
    document.getElementById('version').textContent = "Version " + manifestData.version;
}