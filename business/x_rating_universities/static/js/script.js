// Jordan Universities Rating - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components with performance optimizations
    requestIdleCallback(() => initializeTooltips());
    initializeFormValidation();
    requestIdleCallback(() => initializeAnimations());
    initializeSearch();
    initializeRatingSystem();
});

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback) {
        return setTimeout(() => {
            callback({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50.0 - (Date.now() - performance.now()))
            });
        }, 1);
    };
}

// Initialize Bootstrap tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('.needs-validation');
    
    forms.forEach(form => {
        // Skip registration and login forms as they have their own validation
        if (form.id === 'registrationForm' || form.id === 'loginForm') {
            return;
        }
        
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// Add fade-in animations with performance optimization
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(() => {
                    entry.target.classList.add('fade-in');
                });
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements with batching
    const elements = document.querySelectorAll('.card, .jumbotron');
    const batchSize = 10;
    
    for (let i = 0; i < elements.length; i += batchSize) {
        const batch = Array.from(elements).slice(i, i + batchSize);
        setTimeout(() => {
            batch.forEach(el => observer.observe(el));
        }, i * 10);
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-universities');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const universityCards = document.querySelectorAll('.university-card');
            
            universityCards.forEach(card => {
                const universityName = card.querySelector('.card-title').textContent.toLowerCase();
                const universityLocation = card.querySelector('.card-text').textContent.toLowerCase();
                
                if (universityName.includes(searchTerm) || universityLocation.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Rating system enhancements
function initializeRatingSystem() {
    const ratingGroups = document.querySelectorAll('.rating-group');
    
    ratingGroups.forEach(group => {
        const inputs = group.querySelectorAll('input[type="radio"]');
        const labels = group.querySelectorAll('.rating-label');
        
        inputs.forEach((input, index) => {
            input.addEventListener('change', function() {
                // Reset all labels in this group
                labels.forEach(label => {
                    label.classList.remove('selected');
                });
                
                // Highlight selected rating and all before it
                for (let i = 0; i <= index; i++) {
                    labels[i].classList.add('selected');
                }
                
                // Update overall rating if on rating form
                updateOverallRating();
            });
        });
    });
}

// Calculate and update overall rating
function updateOverallRating() {
    const ratingForm = document.getElementById('ratingForm');
    if (!ratingForm) return;
    
    const ratingInputs = ratingForm.querySelectorAll('input[type="radio"]:checked');
    const totalRatings = 8; // Number of rating categories
    
    if (ratingInputs.length === totalRatings) {
        let total = 0;
        ratingInputs.forEach(input => {
            total += parseInt(input.value);
        });
        
        const average = total / totalRatings;
        
        // Update overall rating display if it exists
        const overallDisplay = document.getElementById('overall-rating');
        if (overallDisplay) {
            overallDisplay.textContent = average.toFixed(1);
        }
    }
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Loading states for buttons
document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        // Skip registration and login forms as they have their own loading states
        if (this.form && (this.form.id === 'registrationForm' || this.form.id === 'loginForm')) {
            return;
        }
        
        if (this.form && this.form.checkValidity()) {
            this.innerHTML = '<span class="spinner me-2"></span>Loading...';
            this.disabled = true;
        }
    });
});

// Auto-hide alerts after 5 seconds
document.querySelectorAll('.alert').forEach(alert => {
    setTimeout(() => {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
    }, 5000);
});

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        showToast('Copied to clipboard!', 'success');
    }).catch(function() {
        showToast('Failed to copy to clipboard', 'error');
    });
}

// Toast notification system
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    // Remove toast element after it's hidden
    toast.addEventListener('hidden.bs.toast', function() {
        toast.remove();
    });
}

// Create toast container if it doesn't exist
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// Keyboard navigation for rating forms
document.addEventListener('keydown', function(e) {
    if (e.target.matches('.rating-group input[type="radio"]')) {
        const currentInput = e.target;
        const inputs = Array.from(currentInput.parentElement.querySelectorAll('input[type="radio"]'));
        const currentIndex = inputs.indexOf(currentInput);
        
        if (e.key === 'ArrowLeft' && currentIndex < inputs.length - 1) {
            inputs[currentIndex + 1].checked = true;
            inputs[currentIndex + 1].dispatchEvent(new Event('change'));
        } else if (e.key === 'ArrowRight' && currentIndex > 0) {
            inputs[currentIndex - 1].checked = true;
            inputs[currentIndex - 1].dispatchEvent(new Event('change'));
        }
    }
});

// Responsive table wrapper
function initializeResponsiveTables() {
    const tables = document.querySelectorAll('.table-responsive');
    tables.forEach(table => {
        if (table.scrollWidth > table.clientWidth) {
            table.classList.add('has-scroll');
        }
    });
}

// Initialize responsive tables
initializeResponsiveTables();

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced search with debouncing
const debouncedSearch = debounce(function(searchTerm) {
    // Perform search operation
    console.log('Searching for:', searchTerm);
}, 300);

// Export functions for global use
window.JordanUniversitiesRating = {
    showToast,
    copyToClipboard,
    debouncedSearch
}; 