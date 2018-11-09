// Document ready function. 
document.addEventListener("DOMContentLoaded", evt => {

	// Binds the Enter key such that if it's pressed in the input box, it's treated as a button click/submission.
	document.getElementById("list-add-input").addEventListener("keydown", function (e) {
		if (e.keyCode === 13) { //checks whether the pressed key is "Enter"
			document.getElementById("list-add-button").click();
		}
	});
	
	// Binds deleteTerm to all list-delete-buttons.
	// 
});

// When the list-add-input button is clicked, this runs. 
function addTerms() {
	var inputField = document.getElementById("list-add-input");
	var input = inputField.value;
	// Separates the input string (input) by the separator character (which should be a comma), and trims it so that the leading and ending whitespace for each term are gone.
	var inputList = input.trim().split(/\s*,\s*/);

	// Inserts the appropriate DIV(s) to the filter-list, in a loop.
	// For each item in the inputList array, create a div and append it to the filter-list div.
	var currentList = document.getElementById("filter-list");

	for (i = 0; i < inputList.length; i++) {
		var insertDIV = document.createElement('div');
		insertDIV.setAttribute("class", "row filter-list-row");
		insertDIV.innerHTML = '<div class="col-9 list-text">' + inputList[i] + '</div><div class="col-3 text-center list-actions"><button class="list-delete-button" onClick="deleteTerm(this)"><i class="fas fa-trash-alt"></i></button></div>';
		currentList.appendChild(insertDIV);
	}
	// Clears the input field.
	inputField.value = '';
}

// Deletes the row and phrase from the list when the list-delete-button buttons are clicked.
function deleteTerm(button) {
	button.closest('.filter-list-row').remove();
}
