const fileInput = document.getElementById('file-input');
const preview = document.getElementById('preview');
const removeBgBtn = document.getElementById('remove-bg-btn');
const uploadContainer = document.getElementById('upload-container');
const buttonContainer = document.getElementById('button-container');
let downloadBtn = null;

fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            preview.src = event.target.result;
            preview.style.display = 'block';
            preview.classList.add('fade-in');
            removeBgBtn.style.display = 'inline-block';
            removeBgBtn.classList.add('fade-in');
        }
        reader.readAsDataURL(file);
    }
});

removeBgBtn.addEventListener('click', function() {
    //Insert APi key here//
    //API url//

    const formData = new FormData();
    formData.append('image_file', fileInput.files[0]);
    formData.append('size', 'auto');

    const progressBar = document.createElement('div');
    progressBar.className = 'lightsaber-progress';
    progressBar.innerHTML = '<div class="lightsaber-hilt"></div><div class="lightsaber-blade"></div>';
    document.getElementById('upload-container').appendChild(progressBar);

    const blade = progressBar.querySelector('.lightsaber-blade');
    
    // Start the lightsaber animation
    setTimeout(() => {
        blade.style.width = 'calc(100% - 60px)';
    }, 50);

    const startTime = Date.now();

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'X-Api-Key': apiKey
        },
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        preview.src = url;
        preview.style.display = 'block';
        preview.classList.add('fade-in');

        // Remove the "Remove Background" button
        removeBgBtn.remove();

        // Remove existing download button if it exists
        if (downloadBtn) {
            downloadBtn.remove();
        }

        // Create new download button
        downloadBtn = document.createElement('a');
        downloadBtn.href = url;
        downloadBtn.download = 'background_removed.png';
        downloadBtn.textContent = 'Download Image';
        downloadBtn.className = 'download-btn';
        downloadBtn.setAttribute('data-tooltip', 'Click to download the image');
        buttonContainer.appendChild(downloadBtn);

        // Center the download button
        buttonContainer.style.justifyContent = 'center';

        const endTime = Date.now();
        const elapsedTime = endTime - startTime;

        if (elapsedTime < 1000) {
            setTimeout(() => {
                progressBar.remove();
            }, 1000 - elapsedTime);
        } else {
            progressBar.remove();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while removing the background. Please try again.');
        progressBar.remove();
    });
});

function createComet() {
    const comet = document.createElement('div');
    comet.className = 'comet';
    
    // Random starting position
    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;
    
    // Random angle (between -30 and -60 degrees)
    const angle = -(Math.random() * 30 + 30);
    
    // Random duration (between 2 and 6 seconds)
    const duration = Math.random() * 4 + 2;
    
    comet.style.left = `${startX}px`;
    comet.style.top = `${startY}px`;
    comet.style.transform = `rotate(${angle}deg)`;
    
    document.body.appendChild(comet);
    
    comet.animate(
        [
            { transform: `rotate(${angle}deg) translate(-100%, -100%)`, opacity: 1 },
            { transform: `rotate(${angle}deg) translate(200%, 200%)`, opacity: 0 }
        ],
        {
            duration: duration * 1000,
            easing: 'linear'
        }
    ).onfinish = () => {
        comet.remove();
        createComet(); // Create a new comet when this one finishes
    };
}

// Create initial comets
for (let i = 0; i < 5; i++) {
    setTimeout(createComet, Math.random() * 3000);
}
