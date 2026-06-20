document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form');
    const registrationCard = document.getElementById('registration-card');
    const successCard = document.getElementById('success-card');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Change button state to show loading
        const submitBtn = form.querySelector('.submit-btn');
        submitBtn.innerHTML = '<span>Memproses...</span>';
        submitBtn.style.opacity = '0.8';
        submitBtn.disabled = true;

        // Simulate API call / form submission delay
        setTimeout(() => {
            // Hide registration card
            registrationCard.style.opacity = '0';
            registrationCard.style.transform = 'translateY(-20px) scale(0.95)';
            
            setTimeout(() => {
                registrationCard.classList.add('hidden');
                registrationCard.style.position = 'absolute';
                
                // Show success card
                successCard.classList.remove('hidden');
                successCard.style.position = 'relative';
                
                // Trigger reflow
                void successCard.offsetWidth;
                
                successCard.style.opacity = '1';
                successCard.style.transform = 'translateY(0) scale(1)';
                
            }, 500); // Wait for fade out animation
            
        }, 1500); // Mock network request
    });
});
