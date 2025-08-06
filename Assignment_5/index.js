let images=['./image/first.webp','./image/second.webp','./image/third.jpg','./image/fourth.jpg','./image/fifth.jpg'];

let currentIndex=0;
function updateImage() {
    const imageElement = document.getElementById('image_display');
    imageElement.src = images[currentIndex];
}

function changeImage(direction) {
    if (direction ==='right') {
        currentIndex = (currentIndex + 1) % images.length;
    }
    else if (direction === 'left') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    }
    updateImage();
    
    
}
updateImage();

