function checkStorage(key) {
	const storedElements = JSON.parse(localStorage.getItem(document.URL));					//Check local storage for current site

	if (storedElements != null) {
		for (let x = 0; x < storedElements.length; x++) {
			var shelfArray = storedElements[x];
			var possibleMatches = document.getElementsByTagName(shelfArray[0]);			//Grab page elements w/ matching HTML tag name
		
			for (let y = 0; y < possibleMatches.length; y++) {
				if (possibleMatches[y].innerHTML == shelfArray[1]) {				//Iterate them, checking for an innerHTML match
					possibleMatches[y].style.display = "none";				//Hide matches
				}
			}
		}
	} 
}

checkStorage(document.URL);

function checkIfNew(site) {											//Checks if a site is in local storage already
	if (site === null) {
		return true;
	} else {
		return false;
	}
}

function saveChanges(newSite, aim, blockedElements) {
	if (newSite) { 												//Remember if new
		var newBlockedElements = new Array(); 								//Create list for a new site
		var newShelfArray = new Array();
		newShelfArray.push(aim.tagName, aim.innerHTML);
		newBlockedElements.push(newShelfArray);
		localStorage.setItem(document.URL, JSON.stringify(newBlockedElements));	 			//Add new list to local storage
	} else { 												//Add to existing list if old
		if (!blockedElements.includes(aim.innerHTML)) { 						//Prevent duplicates
			var newShelfArray2 = new Array(aim.tagName, aim.innerHTML);
			blockedElements.push(newShelfArray2);
			localStorage.setItem(document.URL, JSON.stringify(blockedElements));			//Add updated list to local storage
		}
	}
}

document.addEventListener('mousedown', function(e) {								//Left click + ALT event listener - Removes element
	if (e.button == 0 && event.altKey) {
		window.stop();
		e.preventDefault(); 										//Prevent default click action
		let aim = document.elementFromPoint(e.clientX, e.clientY); 					//Grab selected element
		aim.style.display = "none"; 									//Hide it

		const blockedElements = JSON.parse(localStorage.getItem(document.URL));				//Grab site from local storage
		var newSite = checkIfNew(blockedElements);							//Check if new site
		
		saveChanges(newSite, aim, blockedElements);
	}
});

document.addEventListener('mousedown', function(b) {								//Right click + ALT event listener - Undoes last removal
	if (b.button == 2 && event.altKey) {
		const storedElements = JSON.parse(localStorage.getItem(document.URL));				//Grab site's entry from local storage
		if (storedElements != null && storedElements.length > 0) {
			storedElements.pop();									//Remove the last entry
		}
		if (storedElements.length == 0) {
			localStorage.removeItem(document.URL);							//Remove site entry entirely if empty
		} else {
			localStorage.setItem(document.URL, JSON.stringify(storedElements));			//Add updated list to local storage
		}
		location.reload();										//Reload page to reflect changes
	}
});

document.addEventListener('mousedown', function(a) {								//Right Click + ALT + CTRL event listener - Resets page
	if (a.button == 2 && event.altKey && event.ctrlKey) {
		localStorage.removeItem(document.URL);								//Clear site's local storage entry
		location.reload();										//Reload page to reflect changes
	}
});