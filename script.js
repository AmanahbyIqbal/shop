document.addEventListener('DOMContentLoaded', function() {
    // Image Slider Functionality
    const sliderContainers = document.querySelectorAll('.slider-container');
    
    sliderContainers.forEach(container => {
        const slider = container.querySelector('.slider');
        const slides = slider.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');
        
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let currentIndex = 0;
        
        // Touch events
        slider.addEventListener('touchstart', touchStart);
        slider.addEventListener('touchend', touchEnd);
        slider.addEventListener('touchmove', touchMove);
        
        // Mouse events
        slider.addEventListener('mousedown', touchStart);
        slider.addEventListener('mouseup', touchEnd);
        slider.addEventListener('mouseleave', touchEnd);
        slider.addEventListener('mousemove', touchMove);
        
        // Prevent context menu
        window.oncontextmenu = function(event) {
            if(event.target.closest('.slider-container')) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        }
        
        // Dot navigation
        if (dots.length > 0) {
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToSlide(index);
                });
            });
        }
        
        function updateDots() {
            if (dots.length > 0) {
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }
        }
        
        function goToSlide(index) {
            currentIndex = index;
            prevTranslate = currentIndex * -slider.clientWidth;
            currentTranslate = prevTranslate;
            setSliderPosition();
            updateDots();
        }
        
        function touchStart(event) {
            const touch = event.type.includes('mouse') ? event : event.touches[0];
            startPos = touch.clientX;
            isDragging = true;
            
            animationID = requestAnimationFrame(animation);
            container.classList.add('dragging');
        }
        
        function touchMove(event) {
            if (isDragging) {
                const touch = event.type.includes('mouse') ? event : event.touches[0];
                const currentPosition = touch.clientX;
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }
        
        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);
            
            const movedBy = currentTranslate - prevTranslate;
            
            // Determine if slide should change based on movement distance
            if (movedBy < -50 && currentIndex < slides.length - 1) {
                currentIndex += 1;
            }
            
            if (movedBy > 50 && currentIndex > 0) {
                currentIndex -= 1;
            }
            
            // Snap to the current slide
            prevTranslate = currentIndex * -slider.clientWidth;
            currentTranslate = prevTranslate;
            
            setSliderPosition();
            updateDots();
            container.classList.remove('dragging');
        }
        
        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }
        
        function setSliderPosition() {
            // Constrain movement within bounds
            if (currentTranslate > 0) {
                currentTranslate = 0;
            }
            
            const minTranslate = -(slides.length - 1) * slider.clientWidth;
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate;
            }
            
            slider.style.transform = `translateX(${currentTranslate}px)`;
        }
        
        // Initialize dots
        if (dots.length > 0) {
            dots[0].classList.add('active');
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            prevTranslate = currentIndex * -slider.clientWidth;
            currentTranslate = prevTranslate;
            setSliderPosition();
        });
    });
    
    // FAQ Accordion Functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const parent = toggle.parentElement;
            const content = parent.querySelector('.faq-content');
            
            if (content.style.display === 'block') {
                content.style.display = 'none';
                toggle.classList.remove('active');
            } else {
                content.style.display = 'block';
                toggle.classList.add('active');
            }
        });
    });
    
    // Countdown Timer Functionality (if needed)
    function startCountdown(endTime) {
        const countdownElements = {
            days: document.getElementById('countdown-days'),
            hours: document.getElementById('countdown-hours'),
            minutes: document.getElementById('countdown-minutes'),
            seconds: document.getElementById('countdown-seconds')
        };
        
        if (!countdownElements.days) return;
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
                clearInterval(timer);
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            countdownElements.days.textContent = days.toString().padStart(2, '0');
            countdownElements.hours.textContent = hours.toString().padStart(2, '0');
            countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
            countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
        }
        
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
    }
    
    // Set countdown end time (24 hours from now)
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 24);
    startCountdown(endTime.getTime());
});
