// Document ready function. 
document.addEventListener("DOMContentLoaded", evt => {
	/** options.html ONLY FUNCTIONS **/

	// Binds the deleteAll function to any button with the id 'delete-all-button'.
	document.getElementById("delete-all-button").onclick = deleteAll;

	// Binds the importFromFile function to any button with the id 'import-button'.
	document.getElementById("import-button").onclick = importFromFile;

	// Binds the exportPlaintext function to any button with the id 'export-button'.
	document.getElementById("export-button").onclick = exportPlaintext();

	// Binds the exportPlaintext function to any button with the id 'export-button'.
	document.getElementById("export-plain-copy-button").onclick = copyToClipboard;

	/** MODAL SECTION **/

	// Get the modal
	var modal = document.getElementById('export-modal');

	// Get the button that opens the modal
	var btn = document.getElementById("export-button");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("modal-close")[0];

	// When the user clicks on the button, open the modal 
	btn.onclick = function () {
		modal.style.display = "block";
	};

	// When the user clicks on <span> (x), close the modal
	span.onclick = function () {
		modal.style.display = "none";
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	};

});

// In options.html. The delete-all-button deletes all terms saved in the database.
function deleteAll() {
	if (confirm('Are you sure you want to delete all of your saved filter terms?')) {
		chrome.storage.sync.get("filterList", function (result) {
			var list = result["filterList"];

			chrome.storage.sync.set({
				filterList: list
			}, function () {
				list.length = 0; // Clears the entire list.
				updateList(list); // Updates the list divs.
				console.log("Filter list has been entirely cleared.");
			});

		});

	} else {
		return; // Do nothing!
	}
}

// In options.html. When the file-upload button is clicked, the user uploads a file and imports that search term list.
function importFromFile() {
	document.getElementById('file-upload').click();
}

// In options.html. When the user clicks the export button (export-button), a modal shows up (export-modal) and provides a textarea that they can copy from for their list in plaintext form.
// This function will fill in the textarea.
function exportPlaintext() {
	var textarea = document.getElementById("export-plain-textarea");
	//textarea.value = list.toString();
}

// Functions that allows the user to copy the whole list to clipboard by clicking the export-plain-textarea button in options.html.
function copyToClipboard() {

	var textarea = document.getElementById("export-plain-textarea");
	textarea.select();

	/* Copy the text inside the text field */
	document.execCommand("copy");
}
