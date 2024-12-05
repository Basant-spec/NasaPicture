const API_KEY = 'gWa4VItdj4OIgPE5dC4HlKehnbPQWrujDcP8Fwk3';
const currentDate = new Date().toISOString().split("T")[0];


function getCurrentImageOfTheDay() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${currentDate}`)
    .then(response => response.json())
    .then(data => {
      displayImage(data);
    })
    .catch(error => {
      console.error('Error fetching current image:', error);
    });
}

// Fetch image for a specific date
function getImageOfTheDay(date) {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&date=${date}`)
    .then(response => response.json())
    .then(data => {
      displayImage(data);
      saveSearch(date);
      addSearchToHistory(date);
    })
    .catch(error => {
      console.error('Error fetching image:', error);
    });
}

// Display image data in the UI
function displayImage(data) {
  const imageElement = document.getElementById('nasa-image');
  const titleElement = document.getElementById('image-title');
  const descriptionElement = document.getElementById('image-description');

  if (data.url) {
    imageElement.src = data.url;
    imageElement.style.display = "block";
  } else {
    imageElement.style.display = "none";
  }

  titleElement.textContent = data.title || "No Title Available";
  descriptionElement.textContent = data.explanation || "No Description Available";
}

// Save search date to local storage
function saveSearch(date) {
  let searches = JSON.parse(localStorage.getItem('searches')) || [];
  if (!searches.includes(date)) {
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
  }
}

// Add search to history in the UI
function addSearchToHistory(date) {
  const searchHistoryList = document.getElementById('search-history');
  const listItem = document.createElement('li');
  listItem.textContent = date;
  listItem.onclick = function() {
    getImageOfTheDay(date);
  };
  searchHistoryList.appendChild(listItem);
}

// Load and display search history
function loadSearchHistory() {
  const searches = JSON.parse(localStorage.getItem('searches')) || [];
  searches.forEach(date => {
    addSearchToHistory(date);
  });
}

// Handle form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const date = document.getElementById('search-input').value;
  if (date) {
    getImageOfTheDay(date);
  }
});

// Load current image and search history when the page loads
document.addEventListener('DOMContentLoaded', function() {
  getCurrentImageOfTheDay();
  loadSearchHistory();
});
