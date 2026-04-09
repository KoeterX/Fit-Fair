document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Form submission handling - Registration Form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Validate form
            if (!data.username || !data.email || !data.password || !data.subscription || !data.age) {
                showNotification('Vul alle verplichte velden in.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Voer een geldig e-mailadres in.', 'error');
                return;
            }
            
            // Password validation (minimum 6 characters)
            if (data.password.length < 6) {
                showNotification('Wachtwoord moet minimaal 6 tekens lang zijn.', 'error');
                return;
            }
            
            // Simulate form submission
            submitRegistration(data);
        });
    }
    
    // Register buttons for subscription and trial
    const registerButtons = document.querySelectorAll('.register-btn');
    registerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.open-day-card').querySelector('h3').textContent;
            
            // Scroll to registration form
            const registrationSection = document.getElementById('registratie');
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = registrationSection.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Pre-fill subscription field based on button clicked
            setTimeout(() => {
                const subscriptionSelect = document.getElementById('subscription');
                if (subscriptionSelect) {
                    if (cardTitle.includes('Gratis')) {
                        subscriptionSelect.value = 'trial';
                    } else if (cardTitle.includes('VIP')) {
                        subscriptionSelect.value = 'vip';
                    } else {
                        subscriptionSelect.value = 'premium';
                    }
                    showNotification(`Registratie formulier geopend voor ${cardTitle}`, 'info');
                }
            }, 500);
        });
    });
    
    // Video chat functionality
    initializeVideoChat();
    
    // Subscription management
    initializeSubscriptionFeatures();
    
    // Add scroll effect to header
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    const animatedElements = document.querySelectorAll('.activity-card, .training-day, .tournament-card, .open-day-card, .stat-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Update participants list dynamically
    updateParticipantsList();
    
    // Add hover effects to cards
    addCardHoverEffects();
});

// Function to show notifications
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
            break;
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Function to handle registration submission
async function submitRegistration(data) {
    // Check if Firebase is available
    if (typeof window.dbManager !== 'undefined') {
        // Use Firebase database
        showNotification('Bezig met opslaan in database...', 'info');
        
        try {
            const result = await window.dbManager.addRegistration(data);
            
            if (result.success) {
                showNotification(result.message, 'success');
                
                // Reset form
                document.getElementById('registrationForm').reset();
                
                // Mark user as registered
                localStorage.setItem('knorrie_user_registered', 'true');
                
                // Statistics will be updated automatically via real-time listener
            } else {
                showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Er is een fout opgetreden. Probeer het opnieuw.', 'error');
        }
    } else {
        // Fallback to localStorage
        showNotification('Bezig met verwerken...', 'info');
        
        setTimeout(() => {
            const registrations = JSON.parse(localStorage.getItem('epstein_registrations') || '[]');
            const newRegistration = {
                ...data,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                date: new Date().toLocaleDateString('nl-NL')
            };
            registrations.push(newRegistration);
            localStorage.setItem('epstein_registrations', JSON.stringify(registrations));
            
            addParticipantToList(newRegistration);
            showNotification('Aanmelding succesvol! We nemen binnenkort contact met je op.', 'success');
            
            document.getElementById('registrationForm').reset();
            
            // Mark user as registered
            localStorage.setItem('knorrie_user_registered', 'true');
            
            updateStatistics();
        }, 1500);
    }
}

// Function to add participant to the list
function addParticipantToList(registration) {
    const participantsList = document.querySelector('.participants-list');
    if (!participantsList) return;
    
    const participantItem = document.createElement('div');
    participantItem.className = 'participant-item';
    participantItem.style.opacity = '0';
    participantItem.style.transform = 'translateX(-20px)';
    participantItem.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    const subscriptionNames = {
        'basic': 'Basic',
        'premium': 'Premium', 
        'vip': 'VIP',
        'trial': 'Gratis Proefperiode'
    };
    
    // Format date from Firebase timestamp or regular date string
    let formattedDate = '';
    if (registration.timestamp) {
        if (typeof registration.timestamp.toDate === 'function') {
            // Firebase timestamp
            formattedDate = registration.timestamp.toDate().toLocaleDateString('nl-NL');
        } else if (typeof registration.timestamp === 'string') {
            // ISO string
            formattedDate = new Date(registration.timestamp).toLocaleDateString('nl-NL');
        } else {
            // Fallback
            formattedDate = registration.date || new Date().toLocaleDateString('nl-NL');
        }
    } else {
        formattedDate = registration.date || new Date().toLocaleDateString('nl-NL');
    }
    
    participantItem.innerHTML = `
        <span class="participant-name">${registration.username || registration.name}</span>
        <span class="participant-activity">${subscriptionNames[registration.subscription] || registration.subscription}</span>
        <span class="participant-date">${formattedDate}</span>
    `;
    
    // Add to the top of the list
    const firstParticipant = participantsList.querySelector('.participant-item');
    if (firstParticipant) {
        participantsList.insertBefore(participantItem, firstParticipant);
    } else {
        participantsList.appendChild(participantItem);
    }
    
    // Animate in
    setTimeout(() => {
        participantItem.style.opacity = '1';
        participantItem.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove last item if list gets too long
    const items = participantsList.querySelectorAll('.participant-item');
    if (items.length > 4) {
        items[items.length - 1].remove();
    }
}

// Function to update participants list on page load
async function updateParticipantsList() {
    // Check if Firebase is available
    if (typeof window.dbManager !== 'undefined') {
        try {
            const registrations = await window.dbManager.getRecentRegistrations(4);
            registrations.forEach(registration => {
                addParticipantToList(registration);
            });
            
            // Set up real-time listener for updates
            window.dbManager.onRegistrationsUpdate((updatedRegistrations) => {
                // Clear current list and rebuild
                const participantsList = document.querySelector('.participants-list');
                const currentItems = participantsList.querySelectorAll('.participant-item');
                currentItems.forEach(item => item.remove());
                
                // Add updated registrations
                updatedRegistrations.slice(0, 4).forEach(registration => {
                    addParticipantToList(registration);
                });
            });
            
            // Set up real-time statistics listener
            window.dbManager.onStatisticsUpdate((stats) => {
                updateStatisticsDisplay(stats);
            });
        } catch (error) {
            console.error('Error loading participants:', error);
            // Fallback to localStorage
            loadFromLocalStorage();
        }
    } else {
        // Fallback to localStorage
        loadFromLocalStorage();
    }
}

// Fallback function for localStorage
function loadFromLocalStorage() {
    const registrations = JSON.parse(localStorage.getItem('epstein_registrations') || '[]');
    
    // Sort by timestamp (newest first)
    registrations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Add last 4 registrations to the list
    registrations.slice(0, 4).forEach(registration => {
        addParticipantToList(registration);
    });
    
    // Update statistics
    updateStatistics();
}

// Function to update statistics display
function updateStatisticsDisplay(stats) {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (statNumbers[0]) {
        statNumbers[0].textContent = stats.totalMembers || 247;
    }
    
    if (statNumbers[1]) {
        statNumbers[1].textContent = stats.activeParticipants || 189;
    }
    
    if (statNumbers[2]) {
        statNumbers[2].textContent = stats.newMembers || 23;
    }
}

// Function to update statistics
async function updateStatistics() {
    // Check if Firebase is available
    if (typeof window.dbManager !== 'undefined') {
        try {
            const stats = await window.dbManager.getStatistics();
            updateStatisticsDisplay(stats);
        } catch (error) {
            console.error('Error updating statistics:', error);
            // Fallback to localStorage calculation
            updateStatisticsFromLocalStorage();
        }
    } else {
        // Fallback to localStorage calculation
        updateStatisticsFromLocalStorage();
    }
}

// Fallback statistics calculation from localStorage
function updateStatisticsFromLocalStorage() {
    const registrations = JSON.parse(localStorage.getItem('epstein_registrations') || '[]');
    
    // Update total members (demo data + registrations)
    const totalMembers = 247 + registrations.length;
    const totalMembersElement = document.querySelector('.stat-number');
    if (totalMembersElement) {
        totalMembersElement.textContent = totalMembers;
    }
    
    // Update active participants (demo data)
    const activeParticipants = 189 + Math.floor(registrations.length * 0.8);
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers[1]) {
        statNumbers[1].textContent = activeParticipants;
    }
    
    // Update new members (registrations from last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newMembers = registrations.filter(reg => new Date(reg.timestamp) > thirtyDaysAgo).length;
    if (statNumbers[2]) {
        statNumbers[2].textContent = 23 + newMembers;
    }
}

// Function to add hover effects to cards
function addCardHoverEffects() {
    const cards = document.querySelectorAll('.activity-card, .training-day, .tournament-card, .open-day-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Function to handle window resize
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    }
});

// Video Chat Functionality
function initializeVideoChat() {
    // Add click handlers to live chat cards
    const liveChatCards = document.querySelectorAll('#livechat .activity-card');
    liveChatCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const chatType = this.querySelector('h3').textContent;
            handleChatSelection(chatType);
        });
    });
}

function handleChatSelection(chatType) {
    // Check if user is registered
    const isRegistered = localStorage.getItem('knorrie_user_registered');
    
    if (!isRegistered) {
        showNotification('Je moet eerst een account aanmaken om de chat te gebruiken.', 'info');
        // Scroll to registration form
        const registrationSection = document.getElementById('registratie');
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = registrationSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        return;
    }
    
    // Simu
