// api key=>(uXW_ZmyeDgDJhvn4HO0Dyu1WNgnas07RccYuS6dCHLw) unspalash

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

searchButton.addEventListener('click', () => {
    searchTerm = searchInput.value;
    currentPage = 1;
    randomImagesLoaded = false;
    fetchImages();
});

loadMoreButton.addEventListener('click', () => {
    currentPage++;
    fetchImages();
});

async function fetchImages() {
    const apiKey = 'uXW_ZmyeDgDJhvn4HO0Dyu1WNgnas07RccYuS6dCHLw'; 
    try {
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
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (searchTerm && currentPage === 1) {
            displayImages(data.results);
        } else {
            appendImages(data);
        }
    } catch (error) {
        console.error(error);
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

//close modal
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
