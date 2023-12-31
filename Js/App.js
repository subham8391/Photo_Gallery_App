// api key=>(fDIYrQjqffXnRAVX8ATHLziubdZvSNjSE8gXqP_R7To) unspalash

//loding State
const loadingIndicator = document.getElementById('loadingIndicator');
function showLoadingIndicator() {
    loadingIndicator.style.display = 'flex';
}

function hideLoadingIndicator() {
    loadingIndicator.style.display = 'none';
}

//Error Massage Display

function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    imageGallery.style.display = 'none';
    searchButton.style.display = 'none';
    searchInput.style.display='none';
    loadMoreButton.style.display = 'none';
    
    // Append the error message to the container
    document.querySelector('.container').appendChild(errorElement);
}


const itemsPerPage = 20;
let currentPage = 1;
let randomImagesLoaded = false;
let searchTerm = '';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const loadMoreButton = document.getElementById('loadMore');
const imageGallery = document.getElementById('imageGallery');

const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const imageDetails = document.getElementById('imageDetails');
const downloadLink = document.getElementById('downloadLink');
//For searching 
searchButton.addEventListener('click', () => {
    searchTerm = searchInput.value;
    currentPage = 1;
    randomImagesLoaded = false;
    fetchImages();
});
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchTerm = searchInput.value;
        currentPage = 1;
        randomImagesLoaded = false;
        fetchImages();
    }
});
//For looding
loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchImages();
});

async function fetchImages() {
    const apiKey = 'fDIYrQjqffXnRAVX8ATHLziubdZvSNjSE8gXqP_R7To'; 
    try {
        showLoadingIndicator();

        let url;
        if (searchTerm && currentPage === 1) {
            url = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=${itemsPerPage}&page=${currentPage}&client_id=${apiKey}`;
        } else {
            if (currentPage === 1) {
                url = `https://api.unsplash.com/photos/random?count=${itemsPerPage}&client_id=${apiKey}`;
            } else {
                url = `https://api.unsplash.com/photos?per_page=${itemsPerPage}&page=${currentPage}&client_id=${apiKey}`;
            }
        }

        const response = await fetch(url);
        if (!response.ok) {
            // Handle the 404 error
            if (response.status === 404) {
                showError('Error: 404 Not Found');
            } else {
                showError('An error occurred. Please try again later...');
            }
            // Hide the loading indicator
            hideLoadingIndicator();
            return;
        }

        const data = await response.json();
        if (searchTerm && currentPage === 1) {
            displayImages(data.results);
        } else {
            appendImages(data);
        }

        hideLoadingIndicator();
    } catch (error) {
        console.error(error);
        // Show an error message in case of an error
        showError('An error occurred. Please try again later.');
        hideLoadingIndicator();
    }
}

function displayImages(images) {
    imageGallery.innerHTML = '';
    images.forEach(imageData => {
        const image = document.createElement('img');
        image.src = imageData.urls.small;
        image.alt = imageData.alt_description;
        image.setAttribute('data-description', imageData.description);
        imageGallery.appendChild(image);
    });
}

function appendImages(images) {
    images.forEach(imageData => {
        const image = document.createElement('img');
        image.src = imageData.urls.small;
        image.alt = imageData.alt_description;
        image.setAttribute('data-description', imageData.description); 
        imageGallery.appendChild(image);
    });
}

fetchImages();

// Modal

imageGallery.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
        const imageUrl = e.target.src;
        const imageAlt = e.target.alt;
        const imageDescription = e.target.getAttribute('data-description');

        modalImage.src = imageUrl;
        modalImage.alt = imageAlt;
        imageDetails.textContent = imageDescription;

        //  download link
        const downloadUrl = `${imageUrl}&dl=1`;
        downloadLink.href = downloadUrl;

        imageModal.style.display = 'block';
    }
});

closeModal.addEventListener('click', () => {
    imageModal.style.display = 'none';
});


window.addEventListener('click', (e) => {
    if (e.target === imageModal) {
        imageModal.style.display = 'none';
    }
});


document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        imageModal.style.display = 'none';
    }
});
