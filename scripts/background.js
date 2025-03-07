const password = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679";

document.getElementById("saveButton").addEventListener('click', () => {
    //Get user input from popup window
    const userInput = "*://" + document.getElementById("urlInput").value.trim() + "/*";

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
                            console.log("URL Saved");
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

//Function to delete specific URL
function deleteUrl(urlToDelete){
    //Prompt user to enter string
    const modal = createCustomModal();

    modal.querySelector('button').addEventListener('click', () => {
        const inputString = modal.querySelector('input').value;

        if (inputString === password){
            if (typeof browser !== "undefined"){
                browser.storage.local.get({ userUrls: [] })
                    .then((result) => {
                        let userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
                        userUrls = userUrls.filter(url => url !== urlToDelete);

                        browser.storage.local.set({ userUrls })
                            .then(() => {
                                console.log('URL deleted');
                                updateSavedUrls(userUrls);
                            })
                            .catch((error) => {
                                console.error('Error saving data:'), error;
                            });
                    })
                    .catch((error) => {
                        console.error('Error saving data:', error);
                    });
            } else {
                chrome.storage.local.get({ userUrls: [] }, (result) => {
                    let userUrls = Array.isArray(result.userUrls) ? result.userUrls : [];
                    userUrls = userUrls.filter(url => url !== urlToDelete);

                    chrome.storage.local.set({ userUrls }, () => {
                        console.log('URL deleted');
                        updateSavedUrls(userUrls);
                    });
                });
            }
        } else {
            alert("Incorrect entry. Aborting URL deletion");
        }

        document.body.removeChild(modal);
    });
};

function createCustomModal() {
    // Create the modal elements
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';

    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.padding = '20px';
    modalContent.style.borderRadius = '5px';
    modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    const inputLabel = document.createElement('label');
    inputLabel.textContent = "Enter the string to confirm deletion:";
    
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.width = '200px';
    inputField.style.marginBottom = '10px';
    
    // Prevent paste event on input field
    inputField.addEventListener('paste', (e) => {
        e.preventDefault();  // Prevent pasting
        alert("Pasting is disabled. Please type the string manually.");
    });
    
    const submitButton = document.createElement('button');
    submitButton.textContent = "Confirm";
    
    modalContent.appendChild(inputLabel);
    modalContent.appendChild(inputField);
    modalContent.appendChild(submitButton);
    modal.appendChild(modalContent);

    // Append modal to the body
    document.body.appendChild(modal);
    
    return modal;
}

//Function to update list of URLs
function updateSavedUrls( userUrls ) {
    const savedUrls = document.getElementById("savedUrls");

    if (Array.isArray(userUrls)) {
        savedUrls.innerHTML = '<h4>Saved URLs:</h4>';

        //Set each URL to individual row
        userUrls.forEach(url => {
            savedUrls.innerHTML +=` 
                <div class="url-item">
                    <span>${url}</span>
                    <img src="delete_icon.png" alt="" class="deleteButton" data-url="${url}" style="cursor:pointer"/>
                </div>
            `;
        });

        const deleteButtons = document.querySelectorAll('.deleteButton');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const urlToDelete = event.target.getAttribute('data-url');
                deleteUrl(urlToDelete);
            });
        });
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