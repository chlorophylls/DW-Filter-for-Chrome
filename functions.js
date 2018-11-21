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
	var list = chrome.storage.sync.get("filterList", function (result) {
		updateList(result["filterList"]);
	});

	document.getElementById("list-add-button").onclick = addTerms;

	// Binds the deleteSelected function to any button with the id 'delete-selected-button'.
	document.getElementById("delete-selected-button").onclick = deleteSelected;

	// Binds the switchState function to any button with the id 'extension-toggle', if there is one.
	if (document.getElementById("extension-toggle")) {
		
		// Checks what the button should look like first.
		// First get the state of the button as saved in storage settings.
		chrome.storage.sync.get("extensionState", function (result) {

			// Then set it to checked (if on) or not (if off).
			if (result["extensionState"] == "dw-filter-on"){ // If the state is ON, set it to checked.
				document.getElementById("extension-toggle").checked = true;
			} else { // Else, it's off and set it to unchecked.
				document.getElementById("extension-toggle").checked = false;
			}
			
		// And bind the switchState function to the button.
		document.getElementById("extension-toggle").onclick = switchState;
		});
	}
});

// Populates filter-list divs based on an array/list.
function updateList(input) {
	var currentListDIV = document.getElementById("filter-list");

	// Reloads/clears the list for the updated one.
	currentListDIV.innerHTML = "";

	chrome.storage.sync.get("filterList", function (result) {
		var list = result["filterList"];

		// Goes through the list and repopulates it with the updated data.
		// For each item in the list array, create a div and append it to the filter-list div.
		for (i = 0; i < input.length; i++) {
			var insertDIV = document.createElement('div');
			insertDIV.setAttribute("class", "row filter-list-row");
			insertDIV.setAttribute("data-index", i);
			insertDIV.innerHTML = '<div class="col-8 list-text">' + list[i] + '</div><div class="col-4 list-actions"><input type="checkbox" class="list-check"><button class="list-delete-button" onClick="deleteTerm(this)"><i class="fas fa-trash-alt"></i></button></div>';
			currentListDIV.appendChild(insertDIV);
		}
		console.log("Updated the filter list divs!");
	});
}

// When the list-add-input button is clicked, this runs. 
function addTerms() {
	var inputField = document.getElementById("list-add-input");
	var input = inputField.value;

	// Separates the input string (input) by the separator character (which should be a comma), and trims it so that the leading and ending whitespace for each term are gone.
	var inputList = input.trim().split(/\s*,\s*/);

	chrome.storage.sync.get("filterList", function (result) {
		var list = result["filterList"];

		for (i = 0; i < inputList.length; i++) {
			list.push(inputList[i]);

			// Store the changed list in Chrome storage.
			chrome.storage.sync.set({
				filterList: list
			}, function () {
				updateList(list);
				console.log("Term(s) added to list.");
			});
		}
	});

	// Clears the input field.
	inputField.value = '';
}

// Deletes the row and phrase from the list when the list-delete-button buttons are clicked.
function deleteTerm(button) {
	// Finds the closest div with the class name 'filter-list-row' that is also a direct child of #filter-list, and gets the index of the term (from 'data-index').
	var index = button.closest("#filter-list > div.filter-list-row").getAttribute("data-index");
	list.splice(index, 1);
	updateList(list); // Updates the list divs because a row was removed.
}

// When the delete-selected-button is clicked, goes through all the checked rows and deletes the respective items.
function deleteSelected() {
	var checkboxes = document.querySelectorAll("input[class=list-check]:checked");
	var indexesToRemove = []; // Indexes of the selected terms to delete.

	for (var i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			var deleteTerm = checkboxes[i].closest("#filter-list > div.filter-list-row").getAttribute("data-index"); // Takes the data-index of the row selected for deletion.
			indexesToRemove.push(deleteTerm); // And pushes the index into a temporary list that stores which items at these indexes need to be cleaned out.
		}
	}

	chrome.storage.sync.get("filterList", function (result) {
		var list = result["filterList"];
		// Goes through the main list and removes the elements in the indexes that are stored in indexesToRemove.
		// Removes items from list in reverse order so it avoids messing up the indexes of the yet-to-be-removed items.
		for (var j = indexesToRemove.length - 1; j >= 0; j--) {
			list.splice(indexesToRemove[j], 1);
		}
		updateList(list); // Updates the list divs because rows were removed from the main list.
		chrome.storage.sync.set({
			filterList: list
		}, function () {
			console.log("Extension data has been saved. Term(s) deleted from list.");
		});
	});
}

// In popup.html. Toggles whether the button/extension is off or on.
function switchState() {
	var button = document.getElementById("extension-toggle"); // Gets the extension-toggle button.

	chrome.storage.sync.get("extensionState", function (result) {
		button.className = result["extensionState"];
		console.log("Value is " + result["extensionState"]);

		if (button.className == "dw-filter-on") { // If already on, turn off.
			button.className = "dw-filter-off";
			button.checked = false;
			
			chrome.storage.sync.set({extensionState: "dw-filter-off"}, function () {
				console.log("Extension setting has been saved. Extension status: OFF.");
			});

			chrome.storage.sync.get("extensionState", function (result) {
				console.log("Value is " + result["extensionState"]);
			});

		} else { // Else, it's already off, so turn on.
			button.className = "dw-filter-on";
			button.checked = true;
			
			chrome.storage.sync.set({extensionState: "dw-filter-on"}, function () {
				console.log("Extension setting has been saved. Extension status: ON.");
			});

			chrome.storage.sync.get("extensionState", function (result) {
				console.log("Value is " + result["extensionState"]);
			});
		}
	});
}
