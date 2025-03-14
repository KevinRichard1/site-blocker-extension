<h1>Site Blocker</h1>
A browser extension to improve productivity

<h3>Usage</h3>

* Click on the extension icon to update the list of blocked URLs
* Deleting a URL requires a password, set to the first 100 digits of π by default

<h3>Customization</h3>

* To customize the overlay message, modify the contents of the h1 tag in warning.js
>```overlay.innerHTML = '<h1 style="margin: auto;">This site is blocked</h1>';```
* To set a custom password, modify the password variable in background.js
>```const password = "3.1415926";```
