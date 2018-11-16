// The main array/list that stores the data for what terms to filter to.
var list = ["Fate", "Stay", "Night", "Unlimited", "blade", "works", "Strange", "Fake", "Prototype", "Apocrypha", "Zero", "Hollow", "Ataraxia", "Extra", "Last", "Encore", "Heaven's", "Feel", "Carnival", "Phantasm"];

// Document ready function. 
document.addEventListener("DOMContentLoaded", evt => {

	// Binds the Enter key such that if it's pressed in the input box, it's treated as a button click/submission.
	document.getElementById("list-add-input").addEventListener("keydown", function (e) {
		if (e.keyCode === 13) { //checks whether the pressed key is "Enter"
			document.getElementById("list-add-button").click();
		}
	});

	// TESTING FOR ARRAY/LIST FUNCTIONS
	updateList(list);
	
	document.getElementById("list-add-button").onclick = addTerms;

	// Binds the deleteSelected function to any button with the id 'delete-selected-button'.
	document.getElementById("delete-selected-button").onclick = deleteSelected;

	/** options.html ONLY FUNCTIONS **/
	
	// Binds the deleteAll function to any button with the id 'delete-all-button'.
	document.getElementById("delete-all-button").onclick = deleteAll;
	
	// Binds the importFromFile function to any button with the id 'import-button'.
	document.getElementById("import-button").onclick = importFromFile;
	
	// Binds the exportPlaintext function to any button with the id 'export-button'.
	document.getElementById("export-button").onclick = exportPlaintext();
	
	// Binds the exportPlaintext function to any button with the id 'export-button'.
	document.getElementById("export-plain-copy-button").onclick = copyToClipboard;
	
	// Get the modal
	var modal = document.getElementById('export-modal');

	// Get the button that opens the modal
	var btn = document.getElementById("export-button");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("modal-close")[0];

	// When the user clicks on the button, open the modal 
	btn.onclick = function() {
    	modal.style.display = "block";
	};

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
    	modal.style.display = "none";
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};
	
});

// Populates filter-list divs based on an array/list.
function updateList(list) {
	var currentList = document.getElementById("filter-list");
	
	// Reloads/clears the list for the updated one.
	currentList.innerHTML = "";
	
	// Goes through the list and repopulates it with the updated data.
	// For each item in the list array, create a div and append it to the filter-list div.
	for (i = 0; i < list.length; i++) {
		var insertDIV = document.createElement('div');
		insertDIV.setAttribute("class", "row filter-list-row");
		insertDIV.setAttribute("data-index", i);
		insertDIV.innerHTML = '<div class="col-8 list-text">' + list[i] + '</div><div class="col-4 list-actions"><input type="checkbox" class="list-check"><button class="list-delete-button" onClick="deleteTerm(this)"><i class="fas fa-trash-alt"></i></button></div>';
		currentList.appendChild(insertDIV);
	}
	console.log(list.toString());
}

// When the list-add-input button is clicked, this runs. 
function addTerms() {
	var inputField = document.getElementById("list-add-input");
	var input = inputField.value;
	// Separates the input string (input) by the separator character (which should be a comma), and trims it so that the leading and ending whitespace for each term are gone.
	var inputList = input.trim().split(/\s*,\s*/);

	for (i = 0; i < inputList.length; i++) {
		list.push(inputList[i]);		
	}
	// Clears the input field.
	inputField.value = '';
	updateList(list);
}

// Deletes the row and phrase from the list when the list-delete-button buttons are clicked.
function deleteTerm(button) {
	// Finds the closest div with the class name 'filter-list-row' that is also a direct child of #filter-list, and gets the index of the term (from 'data-index').
	var index = button.closest("#filter-list > div.filter-list-row").getAttribute("data-index");
	list.splice(index, 1);
	updateList(list); // Updates the list divs because a row was removed.
}

// In options.html. The delete-all-button deletes all terms saved in the database.
function deleteAll() {
	if (confirm('Are you sure you want to delete all of your saved filter terms?')) {
		list.length = 0; 	// Clears the entire list.
		updateList(list); 	// Updates the list divs.
	} else {
		return; // Do nothing!
	}
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
	
	// Goes through the main list and removes the elements in the indexes that are stored in indexesToRemove.
	// Removes items from list in reverse order so it avoids messing up the indexes of the yet-to-be-removed items.
	for (var j = indexesToRemove.length - 1; j >= 0; j--){
		list.splice(indexesToRemove[j], 1);
	}
	updateList(list); // Updates the list divs because rows were removed from the main list.
}

// In options.html. When the file-upload button is clicked, the user uploads a file and imports that search term list.
function importFromFile() {
	document.getElementById('file-upload').click();
}

// In options.html. When the user clicks the export button (export-button), a modal shows up (export-modal) and provides a textarea that they can copy from for their list in plaintext form.
// This function will fill in the textarea.
function exportPlaintext(){
	var textarea = document.getElementById("export-plain-textarea");
	textarea.value = list.toString();
}

function copyToClipboard(){
	
var textarea = document.getElementById("export-plain-textarea");
	textarea.select();
  /* Copy the text inside the text field */
  document.execCommand("copy");

}
