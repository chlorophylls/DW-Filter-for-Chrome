// content.js; Runs in the foreground of the HTML page.

// List to edit/test.
var list = [];

// Check if the extension state is on or off.
chrome.storage.sync.get("extensionState", function (result) {
	if (result["extensionState"] == "dw-filter-on") { // If it's on, run the necessary functions..
		chrome.storage.sync.get("filterList", function (result) {
			list = result["filterList"];
			console.log("List has been loaded into overlay div: " + list);

			createOverlay(); // Create overlay div.

			updateOverlay(list); // Updates the overlay with the current list of terms.

			filter(); // Filters the page.
		});
	} else { // Else, it's off, so do nothing.
		// hideOverlay();
	}
});

// Sets the CSS styling properties of the overlay div and appends it to the document's body.
function createOverlay() {
	// Creates the necessary overlay divs, which consist of 3 things: the wrapper, the overlay div (the content), and the title div.
	var overlay = document.createElement("div");
	var overlayWrapper = document.createElement("div");
	var overlayTitleDiv = document.createElement("div");

	overlayTitleDiv.id = "filter-overlay-title";
	overlayWrapper.id = "filter-overlay-wrapper";
	overlay.id = "filter-overlay-content";

	overlayTitleDiv.innerText = "CURRENTLY FILTERING TO:"; // Inner text for the title div.

	overlay.appendChild(overlayTitleDiv); // Attaches the title div to the actual overlay div.
	overlayWrapper.appendChild(overlay); // Attaches the actual overlay div (the content) to the wrapper.

	// Appends the overlay divs to the HTML page's body.
	document.body.appendChild(overlayWrapper);
}

// Accepts an array/list of terms and updates the overlay such that those show up, styling and all.
function updateOverlay(list) {
	console.log("Updating overlay div"); // Debugging

	for (i = 0; i < list.length; i++) {
		var term = document.createElement("div");
		term.innerText = list[i];

		// CSS styling for each overlay-term div.
		term.className = "overlay-term";

		document.getElementById("filter-overlay-content").appendChild(term); // Appends the term to the content div.
	}
}

// Hides the CSS list overlay (once it's been created).
function hideOverlay() {
	document.getElementById("filter-overlay-wrapper").style.display = "none";
}

// Goes through all the Dreamwidth comments (which typically have the class "comment-thread").
function filter() {
	console.log("Filtering..."); // Debugging

	var commentThreads = document.getElementsByClassName("comment-thread"); // List of HTML elements that are DW comment threads.

	var allowed = false; // Variable that holds the check state of the overall processing of the comment-threads.

	// For each comment-thread...
	for (i = 0; i < commentThreads.length; i++) {

		// Checks if it's a toplevel. It's a toplevel if it contains the class 'comment-depth-1'.
		if (commentThreads[i].classList.contains("comment-depth-1")) {

			var toplevel = commentThreads[i].querySelector('.comment'); // Gets the toplevel comment element itself.

			// Searches for the comment title/header element and gets the inner HTML (inside of the span tags that are in headers).
			var titleDIV = toplevel.querySelector('.comment-title > span');

			// Checks to make sure that the title DIV even has HTML in it to pull the title from. If there's (no subject), then it's null.
			if (titleDIV) {
				var title = titleDIV.innerHTML; // If the title exists, time to check it against the whitelist.
				if (checkList(title)) { // If comment contains a whitelisted phrase in header, leave it visible.
					// And sets whitelistedToplevel to true, so the comment-threads immediately following afterwards are left alone until it runs into another toplevel.
					allowed = true;

				} else { // If it's not in the list, then it and its following comments are not allowed.
					allowed = false;
				}
			} else { // If there's nothing in the header of the comment, it's not allowed.
				allowed = false;
				console.log("Subject header text of " + toplevel.id + ": (no subject)");
			}
		}

		// After checking the allowed flag, if it's not allowed, sets the comment-thread to be invisible.
		if (allowed == false) {
			commentThreads[i].style.display = "none"; // If these aren't allowed/whitelisted or part of a whitelisted toplevel thread, hide it.
		}
		//console.log("Allowed = " + allowed); // Debugging
	}
	console.log("Filtering done!"); // Debugging
}

// Checks if the input text (usually the comment title/subject header) contains any phrase in the list. Returns true if it does.
function checkList(text) {

	var length = list.length; // Length of whitelist
	
	// Replaces any / in the input text with \/, to make it regex-understandable (since it's an escape character in regex).
	text.replace('/', '\/');

	var regexList = new RegExp(list.join("|"), "i"); // regular expression that joins a whole list, and includes case insensitive matching

	while (length--) { // Loops through entire list of whitelisted terms and check if the input text ('text') matches any of them.
		if (regexList.test(text)) {
			console.log(text + " contains whitelisted term"); // Prints to console the input text if it does contain a whitelisted term.
			return true;
		} else {
			console.log("No whitelisted terms found in subject header: " + text); // Debugging
			return false; // Prints to console that it doesn't contain a whitelisted term.
		}
	}
}
