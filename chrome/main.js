chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('md-editor.html', {height: 600, width:1201});
});
