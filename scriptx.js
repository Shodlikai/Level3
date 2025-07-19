// scriptx.js - Updated with Story and Reading options

// Get all modal elements
const modal = document.getElementById("modal");
const option1Btn = document.getElementById("option1-btn");
const option2Btn = document.getElementById("option2-btn");
const option3Btn = document.getElementById("option3-btn");
const option4Btn = document.getElementById("option4-btn");
const closeBtn = document.getElementById("close-btn");

// Store the selected lesson number
let selectedLesson = 1;

// Function to show modal with options for the selected lesson
function showOptions(lessonNumber) {
    selectedLesson = lessonNumber;
    modal.style.display = "flex";
    
    // Set up event listeners for all options
    setupOptionButtons();
}

// Function to set up all option button click handlers
function setupOptionButtons() {
    // Fleshcard option - goes to index[lesson].html
    option1Btn.onclick = function() {
        redirectToLesson(`index${selectedLesson}.html`);
    };

    // Words option - goes to index-[lesson].html
    option2Btn.onclick = function() {
        redirectToLesson(`${selectedLesson}pod.html`);
    };

    // Story option - goes to [lesson]gram.html
    option3Btn.onclick = function() {
        redirectToLesson(`${selectedLesson}gramm.html`);
    };

    // Reading option - goes to [lesson]read.html
    option4Btn.onclick = function() {
        redirectToLesson(`${selectedLesson}read.html`);
    };
}

// Function to handle redirection with error checking
function redirectToLesson(url) {
    // Hide modal before redirecting
    modal.style.display = "none";
    
    // You could add additional checks here to verify the file exists
    // before redirecting, but that would require more advanced JavaScript
    
    // Redirect to the selected lesson page
    window.location.href = url;
}

// Close modal when clicking the cancel button
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Developer page redirection
function showDasturchi() {
    window.location.href = "dastur.html";
}

// Video loading handler (moved from HTML to here for better organization)
document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("background-video");
    const image = document.getElementById("background-image");

    // When video is ready to play, switch from image to video
    video.oncanplaythrough = function() {
        image.style.display = "none";
        video.style.display = "block";
        video.play().catch(e => console.log("Video autoplay prevented:", e));
    };

    // Fallback in case oncanplaythrough doesn't fire
    setTimeout(function() {
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA
            image.style.display = "none";
            video.style.display = "block";
            video.play().catch(e => console.log("Video autoplay prevented:", e));
        }
    }, 2000);
});