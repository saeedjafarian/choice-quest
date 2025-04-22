const button = document.getElementById('fullscreen-btn');
const iframe = document.querySelector('iframe');

button.addEventListener('click', () => {
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
});

// Get message
window.addEventListener('message', (event) => {
    // Ensure the message is coming from the expected origin
    if (event.origin !== window.location.origin) {
    console.warn('Origin mismatch:', event.origin);
    return;
    }

    // Handle the message received from the iframe
    // console.log('Message from iframe:', event.data);
    if (event.data.type) {
        alert(`Received message: ${event.data.type}`);
    }
});