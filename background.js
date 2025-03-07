document.getElementById( "saveButton" ).addEventListener( 'click', () => {
    //Get user input from popup window
    const userInput = "*://" + document.getElementById( "urlInput" ).value.trim() + "/*";

    if(userInput){
        const storage = (typeof browser !== "undefined") ? browser.storage.local : chrome.storage.local;
        
        //Check browser type
        if (typeof browser !== "undefined"){
            //Get local list of URLs and add new input
            storage.get({ userUrls: [] })
                .then((result) => {
                    let userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
                    userUrls.push(userInput);

                    //Save updated list
                    storage.local.set({ userUrls })
                        .then(() => {
                            console.log( "URL Saved" );
                            updateSavedUrls(userUrls);
                        })
                        .catch((error) => {
                            console.error("Error saving data:", error);
                        });
                })
                .catch((error) => {
                    console.error('Error getting storage data:', error);
                });
        } else {
            //Chrome browser approach
            storage.get({ userUrls: [] }, (result) => {
                let userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
                userUrls.push(userInput);

                //Save updated list
                storage.set({ userUrls }, () => {
                    console.log("URL Saved");
                    updateSavedUrls(userUrls);
                });
            });
        }
    }
});

function updateSavedUrls( userUrls ) {
    const savedUrls = document.getElementById( "savedUrls" );
    if (Array.isArray(userUrls)) {
        savedUrls.innerHTML = '<h4>Saved URLs:</h4>' + userUrls.join('<br/>');
    } else {
        savedUrls.innerHTML = 'No URLs saved.';
    }
}


if (typeof browser !== "undefined"){
    browser.storage.local.get({ userUrls: []})
        .then((result) => {
            updateSavedUrls(result);
        })
        .catch((error) => {
            console.error("Error fetching storage data:", error);
        });
} else {
    chrome.storage.local.get({ userUrls: []}, ( result ) => {
        updateSavedUrls(result);
    });
}