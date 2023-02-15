function checkStorage(key) {
	//Apply domain filters
	const domainStoredElements = JSON.parse(localStorage.getItem(Location.hostname));			//Check local storage for current domain's list

	if (domainStoredElements != null) {
		for (let a = 0; a < domainStoredElements.length; a++) {
			var shelfArray = domainStoredElements[a];
			var possibleMatches = document.getElementsByTagName(shelfArray[0]);			//Grab page elements w/ matching HTML tag name
		
			for (let b = 0; b < possibleMatches.length; b++) {
				if (possibleMatches[b].innerHTML == shelfArray[1]) {				//Iterate them, checking for an innerHTML match
					possibleMatches[b].style.display = "none";				//Hide matches
				}
			}
		}
	}

	//Apply page filters
	const storedElements = JSON.parse(localStorage.getItem(document.URL));					//Check local storage for current page's list

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

document.addEventListener('mousedown', function(e) {								//Left click + ALT event listener - Removes element
	if (e.button == 0 && event.altKey) {
		window.stop();
		e.preventDefault();										//Prevent default click action
		let aim = document.elementFromPoint(e.clientX, e.clientY); 					//Grab selected element
		aim.style.display = "none"; 									//Hide it
		const blockedElements = JSON.parse(localStorage.getItem(document.URL));				//Grab page list from local storage

		if (event.shiftKey) {										//Check if domain level
			if (blockedElements == null) { 								//If new domain
				var newShelfArray = new Array(aim.tagName, aim.innerHTML);
				var newBlockedElements = new Array(newShelfArray);				//Create list if it doesn't exist in local storage
				saveList(newBlockedElements, true);
			} else {
				if (!blockedElements.includes(aim.innerHTML)) {
					var newShelfArray2 = new Array(aim.tagName, aim.innerHTML);
					blockedElements.push(newShelfArray2);
					saveList(blockedElements, true);					//Update existing domain list
				}
			}
		} else {
			if (blockedElements == null) {								//If new page
				var newShelfArray = new Array(aim.tagName, aim.innerHTML);
				var newBlockedElements = new Array(newShelfArray);				//Create list if it doesn't exist in local storage
				saveList(newBlockedElements, false);
			} else {
				if (!blockedElements.includes(aim.innerHTML)) {
					var newShelfArray2 = new Array(aim.tagName, aim.innerHTML);
					blockedElements.push(newShelfArray2);
					saveList(blockedElements, false);					//Update existing page list
				}
			}
		}
	}
});

function saveList(blockedElementsList, isDomainLevel) {
	if (isDomainLevel) {
		localStorage.setItem(Location.hostname, JSON.stringify(blockedElementsList));			//Add new domain list to local storage
	} else {
		localStorage.setItem(document.URL, JSON.stringify(blockedElementsList));			//Add new page list to local storage
	}
}

function deleteList(isDomainLevel) {
	if (isDomainLevel) {
		localStorage.removeItem(Location.hostname);							//Delete domain list
	} else {
		localStorage.removeItem(document.URL);								//Delete page list
	}
}

document.addEventListener('mousedown', function(b) {								//Right click + ALT event listener - Undoes last removal
	if (b.button == 2 && event.altKey && !event.ctrlKey) {
		if (event.shiftKey) {
			const storedElements = JSON.parse(localStorage.getItem(Location.hostname));		//Grab domain's entry from local storage
			if (storedElements != null) {
				if (storedElements.length > 0) {
					storedElements.pop();							//Remove the last entry
					saveList(storedElements, true);						//Add updated list to local storage
					location.reload();							//Reload page to reflect changes
				} else {
					deleteList(true);							//Remove domain entry entirely if empty
				}
			}
		} else {
			const storedElements = JSON.parse(localStorage.getItem(document.URL));			//Grab page's entry from local storage
			if (storedElements != null) {
				if (storedElements.length > 0) {
					storedElements.pop();							//Remove the last entry
					saveList(storedElements, false);					//Add updated list to local storage
					location.reload();							//Reload page to reflect changes
				} else {
					deleteList(false);							//Remove page entry entirely if empty
				}
			}
		}
	}
});

document.addEventListener('mousedown', function(a) {								//Right Click + ALT + CTRL event listener - Resets page
	if (a.button == 2 && event.altKey && event.ctrlKey) {
		if (event.shiftKey) {
			deleteList(true);									//Clear domain's local storage entry
			location.reload();									//Reload page to reflect changes
		} else {
			deleteList(false);									//Clear page's local storage entry
			location.reload();									//Reload page to reflect changes
		}
	}
});
