// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add active class to nav links on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').substring(1) === current) {
            link.classList.add('active');
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    const formResponse = document.getElementById('form-response');
    const responseMessage = formResponse.querySelector('.response-message');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="prompt">$</span> Sending...';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = {
            name: contactForm.querySelector('#name').value,
            email: contactForm.querySelector('#email').value,
            message: contactForm.querySelector('#message').value
        };
        
        try {
            // Here you can add your form submission logic
            // For now, just show success message
            formResponse.classList.remove('hidden', 'error');
            formResponse.classList.add('success');
            responseMessage.textContent = 'Message sent successfully! I will get back to you soon.';
            
            // Reset form
            contactForm.reset();
        } catch (error) {
            // Show error message
            formResponse.classList.remove('hidden', 'success');
            formResponse.classList.add('error');
            responseMessage.textContent = 'Failed to send message. Please try again later.';
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Scroll response into view
            formResponse.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Portfolio error handling
function startPortfolioErrorCountdown() {
    const countdownElement = document.querySelector('.countdown-timer');
    const retryButton = document.querySelector('.terminal-retry-btn');
    const retryCountdown = document.querySelector('.retry-countdown');
    
    if (!countdownElement || !retryButton || !retryCountdown) return;

    let minutes = 59;
    let seconds = 59;
    retryButton.disabled = true;
    retryCountdown.style.display = 'block';

    const countdown = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            clearInterval(countdown);
            retryButton.disabled = false;
            retryCountdown.style.display = 'none';
            return;
        }

        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function retryLoadPortfolio() {
    const errorWindow = document.querySelector('.portfolio-error-window');
    const projectsGrid = document.querySelector('.projects-grid');
    const terminalContent = errorWindow.querySelector('.terminal-content');

    // Show loading state
    terminalContent.innerHTML = `
        <div class="terminal-line">
            <span class="terminal-prompt">$</span> fetch portfolio-data --source github --force
        </div>
        <div class="loading-message">
            <span class="loading-spinner">⠋</span> Retrying...
        </div>
    `;

    // Simulate loading (replace this with actual API call when ready)
    setTimeout(() => {
        // Show error again for now
        terminalContent.innerHTML = `
            <div class="terminal-line">
                <span class="terminal-prompt">$</span> fetch portfolio-data --source github --force
            </div>
            <div class="error-message">
                <span class="error-icon">❌</span> Error: resource_exhausted
                <br>
                <span class="error-code">Rate limit exceeded for GitHub API</span>
                <br>
                <span class="error-details">Try again in about an hour...</span>
                <div class="error-suggestion">
                    <span class="comment"># Suggestion:</span>
                    <br>
                    <span class="suggestion-text">While waiting, you can:</span>
                    <br>
                    - Visit my <a href="https://github.com/AldramA" target="_blank" class="terminal-link">GitHub profile</a> directly
                    <br>
                    - Check out my <a href="#contact" class="terminal-link">contact section</a>
                </div>
            </div>
            <div class="terminal-line">
                <span class="terminal-prompt">$</span> <span class="cursor-blink">█</span>
            </div>
            <div class="retry-button">
                <button onclick="retryLoadPortfolio()" class="terminal-retry-btn">
                    <span class="terminal-prompt">$</span> retry --force
                </button>
                <span class="retry-countdown" style="display: none;">
                    Next retry available in: <span class="countdown-timer">59:59</span>
                </span>
            </div>
        `;
        startPortfolioErrorCountdown();
    }, 2000);
}

// Start the countdown when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const errorWindow = document.querySelector('.portfolio-error-window');
    if (errorWindow) {
        startPortfolioErrorCountdown();
    }
});