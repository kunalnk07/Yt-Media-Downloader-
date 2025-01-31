const API_KEY = 'AIzaSyC2i3Qg1VAmBvmpxOLfhLY4eVD_9lfsZjQ'; // Replace with your API key
const VIDEO_CONTAINER = document.getElementById('video-container');
const SEARCH_INPUT = document.getElementById('search-input');
const SEARCH_BUTTON = document.getElementById('search-button');
const CATEGORY_BUTTONS = document.querySelectorAll('.category-button');
const LOADING_SPINNER = document.getElementById('loading-spinner');
let nextPageToken = ''; // For pagination

// Fetch videos from YouTube
async function fetchVideos(query, category = '') {
  LOADING_SPINNER.classList.remove('hidden');
  let url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&maxResults=10&key=${API_KEY}`;
  if (category) {
    url += `&videoCategoryId=${category}`;
  }
  if (nextPageToken) {
    url += `&pageToken=${nextPageToken}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  nextPageToken = data.nextPageToken || '';
  displayVideos(data.items);
  LOADING_SPINNER.classList.add('hidden');
}

// Display videos on the page
function displayVideos(videos) {
  videos.forEach(video => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';
    videoItem.innerHTML = `
      <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}" data-video-id="${video.id.videoId}">
      <p>${video.snippet.title}</p>
    `;
    videoItem.addEventListener('click', () => playVideo(video.id.videoId));
    VIDEO_CONTAINER.appendChild(videoItem);
  });
}

// Play video using YouTube IFrame Player API
function playVideo(videoId) {
  new YT.Player('player', {
    height: '450',
    width: '800',
    videoId: videoId,
    playerVars: {
      autoplay: 1,
    },
  });
}

// Search for videos when the button is clicked
SEARCH_BUTTON.addEventListener('click', () => {
  const query = SEARCH_INPUT.value;
  if (query) {
    VIDEO_CONTAINER.innerHTML = ''; // Clear previous results
    nextPageToken = ''; // Reset pagination
    fetchVideos(query);
  }
});

// Load videos by category
CATEGORY_BUTTONS.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.getAttribute('data-category');
    VIDEO_CONTAINER.innerHTML = ''; // Clear previous results
    nextPageToken = ''; // Reset pagination
    fetchVideos('', category);
  });
});

// Infinite scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    const query = SEARCH_INPUT.value;
    fetchVideos(query);
  }
});

// Initial search for popular videos
fetchVideos('popular videos');