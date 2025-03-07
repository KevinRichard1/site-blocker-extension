document.getElementById( "saveButton" ).addEventListener( 'click', () => {
    //Get user input from popup window
    const userInput = "*://" + document.getElementById( "urlInput" ).value.trim() + "/*";

    if(userInput){
        //Get local list of URLs and add new input
        chrome.storage.local.get({ userUrls: [] }, ( result ) => {
            let userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
            userUrls.push(userInput);

            //Save updated list
            chrome.storage.local.set({ userUrls }, () => {
                console.log( "URL Saved" );

                updateSavedUrls(userUrls);
            });
        });
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

chrome.storage.local.get({ userUrls: []}, ( result ) => {
    updateSavedUrls( result );
});