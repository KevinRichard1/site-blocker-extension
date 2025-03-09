let userUrls = [];
let overlayEnabled = false;

//Disable right click on overlay
document.addEventListener('contextmenu', function(e) {
    if (overlayEnabled){
        e.preventDefault();
    }
}, false);

//Get list of saved URLs
if (typeof browser !== "undefined"){
    browser.storage.local.get({ userUrls: []})
        .then((result) => {
            userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
            urlCheck(userUrls);
        })
        .catch((error) => {
            console.error("Error fetching storage data:", error);
        });
} else {
    chrome.storage.local.get({ userUrls: [] }, (result) => {
        userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
        urlCheck(userUrls);
    });
}

//Function to check and block url
function urlCheck(userUrls){
    //Get current URL
    const currentTab = "*://" + window.location.hostname + "/*"

    //Check if current URL is in the list
    if (userUrls.includes(currentTab)){
        //Create an overlay for the page
        const overlay = document.createElement('div');

        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.position = 'absolute';
        overlay.style.zIndex = '99999';
        overlay.style.backgroundColor = '#FFFFFF';
        overlay.style.color = '#000000';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';

        overlay.innerHTML = '<h1 style="margin:auto; color:#000000;">This site is blocked</h1>';
        

        //Add overlay to page
        document.body.prepend(overlay);
        console.log("Site blocked");
        overlayEnabled = true;

        //Re-add overlay if it has been deleted
        function reprepend(){
            if(!document.body.contains(overlay)){
                document.body.prepend(overlay);
                console.log("Re-added overlay");
            }
        }

        setInterval(reprepend, 100);
    }
}