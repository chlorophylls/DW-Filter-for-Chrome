// The main array/list that stores the data for what terms to filter to.
//var list = ["Fate", "Stay", "Night", "Unlimited", "blade", "works", "Strange", "Fake", "Prototype", "Apocrypha", "Zero", "Hollow", "Ataraxia", "Extra", "Last", "Encore", "Heaven's", "Feel", "Carnival", "Phantasm"];

// Document ready function. 
document.addEventListener("DOMContentLoaded", evt => {

	// Binds the Enter key such that if it's pressed in the input box, it's treated as a button click/submission.
	document.getElementById("list-add-input").addEventListener("keydown", function (e) {
		if (e.keyCode === 13) { //checks whether the pressed key is "Enter"
			document.getElementById("list-add-button").click();
		}
	});
	
	// Loads the list.
	chrome.storage.sync.get("filterList", function (result) {
		// If there's nothing in the onset, define the list array so it doesn't spit out an undefined error.
		if (result['filterList'] == null){ 		
			chrome.storage.sync.set({filterList: []}, function () {
				console.log("Defined the list.");
			});
		}
		
		updateList();
	});

	document.getElementById("list-add-button").onclick = addTerms;

	// Binds the deleteSelected function to any button with the id 'delete-selected-button'.
	document.getElementById("delete-selected-button").onclick = deleteSelected;

	// Checks the switch state of the button with the id 'extension-toggle', if there is one.
	if (document.getElementById("extension-toggle")) {
		checkSwitch();
	}
	
});

// Populates filter-list divs based on an array/list.
function updateList() {
	var currentListDIV = document.getElementById("filter-list");

	// Reloads/clears the list for the updated one.
	currentListDIV.innerHTML = "";

	chrome.storage.sync.get("filterList", function (result) {
		var list = result["filterList"];
		
		// Goes through the list and repopulates it with the updated data.
		// For each item in the list array, create a div and append it to the filter-list div.
		for (i = 0; i < list.length; i++) {
			var insertDIV = document.createElement('div');
			insertDIV.setAttribute("class", "row filter-list-row");
			insertDIV.setAttribute("data-index", i);
			insertDIV.innerHTML = '<div class="col-8 list-text">' + list[i] + '</div><div class="col-4 list-actions"><input type="checkbox" class="list-check"><button class="list-delete-button"><i class="fas fa-trash-alt"></i></button></div>';
			currentListDIV.appendChild(insertDIV);
		}
		
		// List of list-delete-button elements.
		var deleteButtons = document.getElementsByClassName("list-delete-button");

		// Attaches the deleteTerm function to all of the newly created buttons with class "list-delete-button".
		for (i = 0; i < deleteButtons.length; i++) {
			deleteButtons[i].onclick = deleteTerm;
		}

		console.log("Updated the filter list divs!");
		console.log(list);
	});
}

// When the list-add-input button is clicked, this runs. 
function addTerms() {
	var inputField = document.getElementById("list-add-input");
	var input = inputField.value;

	// Separates the input string (input) by the separator character (which should be a comma), and trims it so that the leading and ending whitespace for each term are gone.
	var inputList = input.trim().split(/\s*,\s*/);

	chrome.storage.sync.get('filterList', function (result) {
		var list = result['filterList'];
		var debuggingList = [];		// Debugging
		
		for (i = 0; i < inputList.length; i++) {
			debuggingList.push(inputList[i]);
			list.push(inputList[i]);
		}

		// Store the changed list in Chrome storage.
		chrome.storage.sync.set({filterList: list}, function () {
			console.log("Term(s) added to list: " + debuggingList);
		});
		
		inputField.value = ''; // Clears the input field.
		updateList();
	});
}

// Deletes the row and phrase from the list when the list-delete-button buttons are clicked.
function deleteTerm() {
	// Finds the closest div with the class name 'filter-list-row' that is also a direct child of #filter-list, and gets the index of the term (from 'data-index').
	var index = this.closest("#filter-list > div.filter-list-row").getAttribute("data-index");
	
	chrome.storage.sync.get("filterList", function (result) {
		var list = result["filterList"];
		list.splice(index, 1);
		
		chrome.storage.sync.set({filterList: list}, function () {
			console.log("Deleted term from list.");
		});
		
		updateList(); // Updates the list divs because a row was removed.
	});
}

// When the delete-selected-button is clicked, goes through all the checked rows and deletes the respective items.
function deleteSelected() {

	chrome.storage.sync.get("filterList", function (result) {
		var checkboxes = document.querySelectorAll("input[class=list-check]:checked");
		var indexesToRemove = []; // Indexes of the selected terms to delete.

		for (var i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) {
				var deleteTerm = checkboxes[i].closest("#filter-list > div.filter-list-row").getAttribute("data-index"); // Takes the data-index of the row selected for deletion.
				indexesToRemove.push(deleteTerm); // And pushes the index into a temporary list that stores which items at these indexes need to be cleaned out.
			}
		}
		
		var list = result["filterList"];

		// Goes through the main list and removes the elements in the indexes that are stored in indexesToRemove.
		// Removes items from list in reverse order so it avoids messing up the indexes of the yet-to-be-removed items.
		for (var j = indexesToRemove.length - 1; j >= 0; j--) {
			list.splice(indexesToRemove[j], 1);
		}
		
		chrome.storage.sync.set({filterList: list}, function () {
			console.log("Extension data has been saved. Term(s) deleted from list.");
		});
		
		updateList(); // Updates the list divs because terms were removed from the main list.
	});
}

// // Checks what the button should look like by referring to the stored data. Default is OFF/unchecked.
function checkSwitch(){
	// First get the state of the button as saved in storage settings.
	chrome.storage.sync.get("extensionState", function (result) {

		// Then set it to checked (if on) or not (if off).
		if (result["extensionState"] == "dw-filter-on") { // If the state is ON, set it to checked.
			document.getElementById("extension-toggle").checked = true;
		} else { // Else, it's off and set it to unchecked.
			document.getElementById("extension-toggle").checked = false;
		}
		// And bind the switchState function to the button.
		document.getElementById("extension-toggle").onclick = switchState;
	});
}

// In popup.html. Toggles whether the button/extension is off or on.
function switchState() {
	var button = document.getElementById("extension-toggle"); // Gets the extension-toggle button.

	chrome.storage.sync.get("extensionState", function (result) {
		button.className = result["extensionState"];
		console.log("Switch value is " + result["extensionState"]);

		if (button.className == "dw-filter-on") { // If already on, turn off.
			button.className = "dw-filter-off";
			button.checked = false;

			chrome.storage.sync.set({extensionState: "dw-filter-off"}, function () {
				console.log("Extension setting has been saved. Extension status: OFF.");
			});
			
			// Reloads the current active tab.
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        		chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
			});

			chrome.storage.sync.get("extensionState", function (result) {
				console.log("Switch value is now " + result["extensionState"]);
			});

		} else { // Else, it's already off, so turn on.
			button.className = "dw-filter-on";
			button.checked = true;

			chrome.storage.sync.set({extensionState: "dw-filter-on"}, function () {
				console.log("Extension setting has been saved. Extension status: ON.");
			});
			// Reloads the current active tab.
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        		chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
    		});

			chrome.storage.sync.get("extensionState", function (result) {
				console.log("Switch value is now " + result["extensionState"]);
			});
		}
	});
}
