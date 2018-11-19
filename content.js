// content.js; Runs in the foreground of the HTML page.

// List to edit/test.
var list = ["fire emblem awakening", "mcu", "dceu", "toriko", "m/m", "ota"];

//document.addEventListener("DOMContentLoaded", evt => {
// When document is ready, create overlay div.
createOverlay();

updateOverlay(list); // Updates the overlay with the current list of terms.

filter(); // Filters the 
//});

// Sets the CSS styling properties of the overlay div.
function createOverlay() {
	// Creates the necessary overlay divs, which consist of 3 things: the wrapper, the overlay div (the content), and the title div.
	var overlay = document.createElement("div");
	var overlayWrapper = document.createElement("div");
	var overlayTitleDiv = document.createElement("div");

	overlayTitleDiv.id = "filter-overlay-title";
	overlayWrapper.id = "filter-overlay-wrapper";
	overlay.id = "filter-overlay-content";

	overlay.appendChild(overlayTitleDiv); // Attaches the title div to the actual overlay div.
	overlayWrapper.appendChild(overlay); // Attaches the actual overlay div (the content) to the wrapper.

	/** Set CSS styling for the elements. **/
	// CSS styling for wrapper.
	overlayWrapper.style.top = "10px";
	overlayWrapper.style.left = "50%";
	overlayWrapper.style.position = "fixed";
	overlayWrapper.style.zIndex = "999";
	overlayWrapper.style.minWidth = "70%";

	// CSS styling for the title div (CURRENTLY FILTERING TO).
	overlayTitleDiv.innerText = "CURRENTLY FILTERING TO:"; // Inner text.
	overlayTitleDiv.style.color = "#ffffff";
	overlayTitleDiv.style.padding = "0.4em";
	overlayTitleDiv.style.fontSize = "1em";
	overlayTitleDiv.style.backgroundColor = "#78C2AD";

	// CSS styling for actual overlay itself.
	overlay.style.position = "relative";
	overlay.style.left = "-50%";
	overlay.style.textAlign = "center";
	//overlay.style.minHeight = "12em";
	overlay.style.borderRadius = "1em";
	overlay.style.backgroundColor = "rgba(211, 211, 211, 0.5)"; // This is just the same gray (#D3D3D3) that's used in popup, just with transparency.

	// Appends the overlay divs to the HTML page's body.
	document.body.appendChild(overlayWrapper);
}

// Accepts an array/list of terms and updates the overlay such that those show up, styling and all.
function updateOverlay(list) {

	for (i = 0; i < list.length; i++) {
		var term = document.createElement("div");
		term.innerText = list[i];

		// CSS styling for each overlay-term div.
		term.className = "overlay-term";
		term.style.backgroundColor = "#78C2AD";
		term.style.fontSize = "0.75em";
		term.style.padding = "0.5em";
		term.style.margin = "0.5em";
		term.style.color = "#ffffff";
		term.style.display = "inline-block";
		term.style.borderRadius = "0.5em";
		//term.style.border = "1px solid #3c8671";

		document.getElementById("filter-overlay-content").appendChild(term);
	}
}

// Goes through all the Dreamwidth comment threads (which typically have the class "comment-depth-1").
function filter() {
	var commentThreads = document.getElementsByClassName("comment-depth-1"); // list of HTML elements that are DW comment threads.

	// For each comment thread, go to the topmost one (which should be the original comment anyway).
	for (i = 0; i < commentThreads.length; i++) {
		var toplevel = commentThreads[i].querySelector('.comment'); // gets the toplevel comment itself
		var commentTitle = toplevel.querySelector('.comment-title > span').innerHTML; // searches for the comment title/header and gets the inner HTML (inside of the span tags that are in headers).
		checkList(commentTitle);
	}
}

// Checks if the input text contains any phrase in the list. Returns true if it does.
function checkList(text) {
	length = list.length;

	var regexList = new RegExp(list.join("|"), "i"); // case insensitive matching

	while (length--) { // loops through entire list of whitelisted terms and check if the input text ("text") matches any of them.
		if (regexList.test(text)) {
			console.log(text); // returns the input text if it does contain a whitelisted term.
			return true;
		} else {
			return false;
		}
	}
}
