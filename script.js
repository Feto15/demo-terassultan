function isIOSSafari() {
    const ua = navigator.userAgent;
    const isIOS = /iP(hone|ad|od)/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isWebKit = /WebKit/i.test(ua);
    const isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);

    return isIOS && isWebKit && !isOtherIOSBrowser;
}

function preparePromoVideos() {
    const videos = document.querySelectorAll('.video-section video');

    videos.forEach((video) => {
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.playsInline = true;

        const source = video.querySelector('source');
        if (source) {
            if (!source.type) {
                source.type = 'video/mp4';
            }

            const deferredSrc = source.dataset.src;
            if (deferredSrc && source.src !== deferredSrc) {
                source.src = deferredSrc;
            }
        }

        video.addEventListener('play', () => {
            videos.forEach((otherVideo) => {
                if (otherVideo !== video) {
                    otherVideo.pause();
                }
            });
        });
    });

    // Force the browser to re-evaluate sources after the dashboard is visible.
    videos.forEach((video) => {
        video.load();
    });

    if (isIOSSafari()) {
        document.body.classList.add('ios-safari');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const registrationCard = document.getElementById('registration-card');
    const successCard = document.getElementById('success-card');
    const errorMessage = document.getElementById('error-message');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Custom Validation
        if (!form.checkValidity()) {
            const firstInvalid = form.querySelector(':invalid');
            if (firstInvalid && errorMessage) {
                let fieldName = firstInvalid.getAttribute('name');
                const label = form.querySelector(`label[for="${firstInvalid.id}"]`);
                
                if (label && label.textContent) {
                    fieldName = label.textContent;
                } else if (firstInvalid.name === 'title') {
                    fieldName = 'Title (Mr./Mrs./Ms.)';
                } else if (firstInvalid.name === 'marketing') {
                    fieldName = 'Marketing Preferences';
                } else if (firstInvalid.name === 'category') {
                    fieldName = 'Guest Category';
                } else if (firstInvalid.name === 'discovery') {
                    fieldName = 'Event Discovery';
                }
                
                errorMessage.textContent = `Please complete the field: ${fieldName}`;
                errorMessage.classList.remove('hidden');
                
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
                
                // Trigger shake animation
                errorMessage.classList.remove('shake');
                void errorMessage.offsetWidth;
                errorMessage.classList.add('shake');
            }
            return;
        }

        if (errorMessage) errorMessage.classList.add('hidden');

        // Add loading state to button
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Memproses...</span>';
        submitBtn.style.opacity = '0.8';
        submitBtn.disabled = true;

        // Real API call to Google Apps Script
        const scriptURL = 'https://script.google.com/macros/s/AKfycbwft9JfUiVOakkexrzcGCecC-8d8FrwY7a-C4GZh2K8R-SVNJsdanrA1RShdTuEcaM8LQ/exec';
        
        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => {
                // Hide registration card
                registrationCard.style.opacity = '0';
                registrationCard.style.transform = 'translateY(-20px) scale(0.95)';
                
                setTimeout(() => {
                    registrationCard.classList.add('hidden');
                    registrationCard.style.position = 'absolute';
                    
                    // Scroll back to top so user sees the new dashboard
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Show success card
                    successCard.classList.remove('hidden');
                    successCard.style.position = 'relative';
                    
                    // Trigger reflow
                    void successCard.offsetWidth;
                    
                    successCard.style.opacity = '1';
                    successCard.style.transform = 'translateY(0) scale(1)';
                    preparePromoVideos();
                    
                }, 500); // Wait for fade out animation
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.innerHTML = '<span>Daftar Sekarang</span><svg class="arrow-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                if (errorMessage) {
                    errorMessage.textContent = 'Terjadi kesalahan server. Silakan coba lagi.';
                    errorMessage.classList.remove('hidden');
                }
            });
    });
});

function openLightbox(img) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        if (lightboxCaption) {
            lightboxCaption.textContent = img.alt || 'Terasultan';
        }
        lightbox.classList.remove('hidden');
    }
}

// --- Slider Logic ---
let slideIndex = 0;
let slideInterval;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (slides.length === 0 || !dotsContainer) return;
    
    // Create dots
    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.onclick = () => currentSlide(index);
        dotsContainer.appendChild(dot);
    });
    
    startSlideInterval();
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slides.length === 0) return;
    
    if (index >= slides.length) slideIndex = 0;
    if (index < 0) slideIndex = slides.length - 1;
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    slides[slideIndex].classList.add('active');
    if (dots[slideIndex]) dots[slideIndex].classList.add('active');
}

function moveSlide(step) {
    slideIndex += step;
    showSlide(slideIndex);
    resetSlideInterval();
}

function currentSlide(index) {
    slideIndex = index;
    showSlide(slideIndex);
    resetSlideInterval();
}

function startSlideInterval() {
    // Auto-change every 4 seconds
    slideInterval = setInterval(() => {
        moveSlide(1);
    }, 4000);
}

function resetSlideInterval() {
    clearInterval(slideInterval);
    startSlideInterval();
}

// Call initSlider when DOM is loaded, or if success card is shown
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
});
