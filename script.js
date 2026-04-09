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
    
    // Simulate chat opening based on type
    switch(chatType) {
        case 'Live Chat':
            openVideoChatWindow();
            break;
        case 'Group Chat':
            openGroupChatWindow();
            break;
        case 'Live Shows':
            openLiveShowsWindow();
            break;
        case 'Text Chat':
            openTextChatWindow();
            break;
        default:
            showNotification('Chat type wordt geladen...', 'info');
    }
}

function openVideoChatWindow() {
    createChatModal('Random Video Chat', `
        <div class="video-chat-container">
            <div class="video-grid">
                <div class="video-item">
                    <h4>Jij</h4>
                    <video id="localVideo" autoplay muted playsinline style="width: 100%; height: 240px; border-radius: 10px; background: #000; object-fit: cover;"></video>
                </div>
                <div class="video-item">
                    <h4 id="remoteUserLabel">Wachten op verbinding...</h4>
                    <video id="remoteVideo" autoplay playsinline style="width: 100%; height: 240px; border-radius: 10px; background: #000; object-fit: cover;"></video>
                </div>
            </div>
            <div id="videoStatus" style="color: #ff6b35; margin: 10px 0; text-align: center;">Zoeken naar willekeurige gebruiker...</div>
            <div class="chat-controls">
                <button class="chat-btn" id="cameraBtn" onclick="toggleCamera()"> Camera</button>
                <button class="chat-btn" id="micBtn" onclick="toggleMicrophone()"> Microfoon</button>
                <button class="chat-btn skip-btn" onclick="skipUser()" id="skipBtn" disabled> Volgende </button>
                <button class="chat-btn end-call" onclick="endCall()"> Stop </button>
            </div>
            <div class="chat-messages-container">
                <div class="chat-messages" id="chatMessages" style="height: 150px; overflow-y: auto; background: #1a1a1a; border-radius: 10px; padding: 10px; margin-top: 10px;">
                    <div style="color: #999; text-align: center;">Wachten op verbinding...</div>
                </div>
                <div class="chat-input" style="display: flex; gap: 10px; margin-top: 10px;">
                    <input type="text" id="chatInput" placeholder="Typ een bericht..." style="flex: 1; padding: 8px; border: 1px solid #333; border-radius: 5px; background: #000; color: white;" />
                    <button onclick="sendMessage()" style="background: #ff6b35; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">Verstuur</button>
                </div>
            </div>
        </div>
    `);
    
    // Start P2P chat when modal opens
    setTimeout(() => {
        startP2PVideoChat();
    }, 500);
}

function openGroupChatWindow() {
    createChatModal('Group Chat', `
        <div class="group-chat-container">
            <div class="chat-messages">
                <div class="message">
                    <strong>System:</strong> Welkom in de group chat!
                </div>
            </div>
            <div class="chat-input-container">
                <input type="text" id="groupChatInput" placeholder="Typ je bericht..." />
                <button onclick="sendGroupMessage()">Verstuur</button>
            </div>
        </div>
    `);
}

function openLiveShowsWindow() {
    createChatModal('Live Shows', `
        <div class="live-shows-container">
            <div class="show-grid">
                <div class="show-item">
                    <div class="show-thumbnail">🎬</div>
                    <h4>Live Show 1</h4>
                    <button class="watch-btn">Bekijken</button>
                </div>
                <div class="show-item">
                    <div class="show-thumbnail">🎭</div>
                    <h4>Live Show 2</h4>
                    <button class="watch-btn">Bekijken</button>
                </div>
            </div>
        </div>
    `);
}

function openTextChatWindow() {
    createChatModal('Text Chat', `
        <div class="text-chat-container">
            <div class="online-users">
                <h4>Online Gebruikers</h4>
                <div class="user-list">
                    <div class="user-item">🟢 User123</div>
                    <div class="user-item">🟢 StarGazer</div>
                    <div class="user-item">🟡 NightOwl</div>
                </div>
            </div>
            <div class="chat-area">
                <div class="chat-messages">
                    <div class="message">Welcome to text chat!</div>
                </div>
                <div class="chat-input">
                    <input type="text" placeholder="Type your message..." />
                    <button>Send</button>
                </div>
            </div>
        </div>
    `);
}

function createChatModal(title, content) {
    // Remove existing modal
    const existingModal = document.querySelector('.chat-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'chat-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="close-btn" onclick="closeChatModal()">✕</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Add styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    document.body.appendChild(modal);
    
    // Animate in
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 100);
}

function closeChatModal() {
    const modal = document.querySelector('.chat-modal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Subscription Management
function initializeSubscriptionFeatures() {
    // Add click handlers to subscription cards
    const subscriptionCards = document.querySelectorAll('#abonnementen .tournament-card');
    subscriptionCards.forEach(card => {
        card.addEventListener('click', function() {
            const plan = this.querySelector('h3').textContent;
            handleSubscriptionSelection(plan);
        });
    });
}

function handleSubscriptionSelection(plan) {
    // Scroll to registration form
    const registrationSection = document.getElementById('registratie');
    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = registrationSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Pre-fill subscription field
    setTimeout(() => {
        const subscriptionSelect = document.getElementById('subscription');
        if (subscriptionSelect) {
            switch(plan) {
                case 'Basic':
                    subscriptionSelect.value = 'basic';
                    break;
                case 'Premium':
                    subscriptionSelect.value = 'premium';
                    break;
                case 'VIP':
                    subscriptionSelect.value = 'vip';
                    break;
            }
            showNotification(`${plan} abonnement geselecteerd`, 'info');
        }
    }, 500);
}

// WebRTC P2P Video Chat Variables
let localStream = null;
let remoteStream = null;
let peerConnection = null;
let currentUserId = null;
let connectedUserId = null;
let cameraEnabled = false;
let microphoneEnabled = false;
let isSearching = false;
let socket = null;

// WebRTC Configuration
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Initialize WebSocket connection
function initializeSocket() {
    // Connect to Socket.IO server
    socket = io();
    
    // Receive user ID
    socket.on('user-id', (userId) => {
        currentUserId = userId;
        console.log('Received user ID:', userId);
    });
    
    // Handle partner found
    socket.on('partner-found', async (data) => {
        connectedUserId = data.partnerId;
        isSearching = false;
        
        const statusElement = document.getElementById('videoStatus');
        const remoteUserLabel = document.getElementById('remoteUserLabel');
        const skipBtn = document.getElementById('skipBtn');
        
        if (data.isInitiator) {
            // Create peer connection as initiator
            await createPeerConnection(true);
            statusElement.textContent = 'Verbinding maken met ' + connectedUserId.substr(0, 8) + '...';
        } else {
            // Create peer connection as receiver
            await createPeerConnection(false);
            statusElement.textContent = 'Verbinding ontvangen van ' + connectedUserId.substr(0, 8) + '...';
        }
        
        remoteUserLabel.textContent = 'Gebruiker ' + connectedUserId.substr(0, 8);
    });
    
    // Handle WebRTC signaling
    socket.on('signal', async (data) => {
        if (peerConnection) {
            try {
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.signal));
                
                if (data.signal.type === 'offer') {
                    // Create and send answer
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    socket.emit('signal', { signal: answer });
                }
            } catch (error) {
                console.error('Error handling signal:', error);
            }
        }
    });
    
    // Handle searching state
    socket.on('searching', () => {
        const statusElement = document.getElementById('videoStatus');
        const remoteUserLabel = document.getElementById('remoteUserLabel');
        const skipBtn = document.getElementById('skipBtn');
        
        isSearching = true;
        connectedUserId = null;
        
        statusElement.textContent = 'Zoeken naar willekeurige gebruiker...';
        statusElement.style.color = '#ff6b35';
        remoteUserLabel.textContent = 'Wachten op verbinding...';
        skipBtn.disabled = true;
        skipBtn.style.background = '#666';
        
        // Clear remote video
        const remoteVideo = document.getElementById('remoteVideo');
        if (remoteVideo) {
            remoteVideo.srcObject = null;
        }
        
        addSystemMessage('Zoeken naar nieuwe gebruiker...');
    });
    
    // Handle partner skipped
    socket.on('partner-skipped', () => {
        addSystemMessage('Gebruiker heeft geskipt');
        socket.emit('find-partner');
    });
    
    // Handle partner disconnected
    socket.on('partner-disconnected', () => {
        addSystemMessage('Gebruiker is offline gegaan');
        socket.emit('find-partner');
    });
    
    // Handle chat messages
    socket.on('chat-message', (data) => {
        addChatMessage('Gebruiker ' + data.from.substr(0, 8), data.message, false);
    });
}

// Create WebRTC peer connection
async function createPeerConnection(isInitiator) {
    const remoteVideo = document.getElementById('remoteVideo');
    const statusElement = document.getElementById('videoStatus');
    const skipBtn = document.getElementById('skipBtn');
    
    try {
        // Close existing connection
        if (peerConnection) {
            peerConnection.close();
        }
        
        // Create new peer connection
        peerConnection = new RTCPeerConnection(configuration);
        
        // Add local stream
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        // Handle remote stream
        peerConnection.ontrack = (event) => {
            const [stream] = event.streams;
            remoteVideo.srcObject = stream;
            
            // Connection established
            statusElement.textContent = 'Verbonden met ' + connectedUserId.substr(0, 8) + '!';
            statusElement.style.color = '#4CAF50';
            skipBtn.disabled = false;
            skipBtn.style.background = '#ff6b35';
            
            showNotification('Verbonden met willekeurige gebruiker!', 'success');
            addSystemMessage('Verbonden met een nieuwe gebruiker');
        };
        
        // Handle ICE candidates
        peerConnection.onicecandidate = (event) => {
            if (event.candidate && socket) {
                socket.emit('signal', { signal: peerConnection.localDescription });
            }
        };
        
        if (isInitiator) {
            // Create and send offer
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);
            socket.emit('signal', { signal: offer });
        }
        
    } catch (error) {
        console.error('Error creating peer connection:', error);
        statusElement.textContent = 'Verbinding mislukt';
        statusElement.style.color = '#f44336';
    }
}

// Start P2P video chat
async function startP2PVideoChat() {
    const localVideo = document.getElementById('localVideo');
    const remoteVideo = document.getElementById('remoteVideo');
    const statusElement = document.getElementById('videoStatus');
    const cameraBtn = document.getElementById('cameraBtn');
    const micBtn = document.getElementById('micBtn');
    
    if (!localVideo || !remoteVideo) return;
    
    try {
        statusElement.textContent = 'Camera en microfoon starten...';
        
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }, 
            audio: true 
        });
        
        localStream = stream;
        localVideo.srcObject = stream;
        
        cameraEnabled = true;
        microphoneEnabled = true;
        
        // Update button states
        cameraBtn.textContent = 'Camera UIT';
        cameraBtn.style.background = '#ff6b35';
        micBtn.textContent = 'Microfoon UIT';
        micBtn.style.background = '#ff6b35';
        
        // Initialize WebSocket connection
        initializeSocket();
        
        // Start searching for partner
        setTimeout(() => {
            if (socket) {
                socket.emit('find-partner');
            }
        }, 1000);
        
    } catch (error) {
        console.error('Error accessing media devices:', error);
        statusElement.textContent = 'Geen toegang tot camera/microfoon';
        statusElement.style.color = '#f44336';
        
        if (error.name === 'NotAllowedError') {
            showNotification('Geef toegang tot camera en microfoon', 'error');
        } else {
            showNotification('Fout bij starten video chat', 'error');
        }
    }
}

// Toggle camera on/off
function toggleCamera() {
    if (!localStream) {
        showNotification('Start eerst de video chat', 'info');
        return;
    }
    
    const videoTrack = localStream.getVideoTracks()[0];
    const cameraBtn = document.getElementById('cameraBtn');
    
    if (videoTrack) {
        cameraEnabled = !cameraEnabled;
        videoTrack.enabled = cameraEnabled;
        
        if (cameraEnabled) {
            cameraBtn.textContent = 'Camera UIT';
            cameraBtn.style.background = '#ff6b35';
            showNotification('Camera ingeschakeld', 'info');
        } else {
            cameraBtn.textContent = 'Camera AAN';
            cameraBtn.style.background = '#666';
            showNotification('Camera uitgeschakeld', 'info');
        }
    }
}

// Toggle microphone on/off
function toggleMicrophone() {
    if (!localStream) {
        showNotification('Start eerst de video chat', 'info');
        return;
    }
    
    const audioTrack = localStream.getAudioTracks()[0];
    const micBtn = document.getElementById('micBtn');
    
    if (audioTrack) {
        microphoneEnabled = !microphoneEnabled;
        audioTrack.enabled = microphoneEnabled;
        
        if (microphoneEnabled) {
            micBtn.textContent = 'Microfoon UIT';
            micBtn.style.background = '#ff6b35';
            showNotification('Microfoon ingeschakeld', 'info');
        } else {
            micBtn.textContent = 'Microfoon AAN';
            micBtn.style.background = '#666';
            showNotification('Microfoon uitgeschakeld', 'info');
        }
    }
}

// Skip to next user
function skipUser() {
    if (!socket || !connectedUserId) {
        showNotification('Geen actieve verbinding om te skippen', 'info');
        return;
    }
    
    addSystemMessage('Gebruiker geskipt, zoeken naar nieuwe...');
    
    // Close current connection
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    // Clear remote video
    const remoteVideo = document.getElementById('remoteVideo');
    if (remoteVideo) {
        remoteVideo.srcObject = null;
    }
    
    // Reset UI
    const statusElement = document.getElementById('videoStatus');
    const remoteUserLabel = document.getElementById('remoteUserLabel');
    const skipBtn = document.getElementById('skipBtn');
    
    connectedUserId = null;
    skipBtn.disabled = true;
    skipBtn.style.background = '#666';
    
    statusElement.textContent = 'Zoeken naar nieuwe gebruiker...';
    statusElement.style.color = '#ff6b35';
    remoteUserLabel.textContent = 'Wachten op verbinding...';
    
    // Tell server to skip and find new partner
    socket.emit('skip');
    
    showNotification('Nieuwe gebruiker zoeken...', 'info');
}

// Send chat message
function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim() || !socket || !connectedUserId) return;
    
    const message = input.value.trim();
    input.value = '';
    
    // Add message to local chat
    addChatMessage('Jij', message, true);
    
    // Send to server
    socket.emit('chat-message', message);
}

// Add chat message to UI
function addChatMessage(sender, message, isLocal) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 8px;
        background: ${isLocal ? '#ff6b35' : '#333'};
        color: white;
        max-width: 80%;
        ${isLocal ? 'margin-left: auto; text-align: right;' : 'margin-right: auto;'}
    `;
    
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Add system message
function addSystemMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        margin-bottom: 8px;
        padding: 8px;
        border-radius: 8px;
        background: #1a1a1a;
        color: #999;
        text-align: center;
        font-style: italic;
        font-size: 0.9em;
    `;
    
    messageDiv.textContent = message;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Handle Enter key in chat input
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && e.target.id === 'chatInput') {
        sendMessage();
    }
});

// End video call
function endCall() {
    // Disconnect from server
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    
    // Close peer connection
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    // Stop local stream
    if (localStream) {
        localStream.getTracks().forEach(track => {
            track.stop();
        });
        localStream = null;
    }
    
    // Reset variables
    connectedUserId = null;
    currentUserId = null;
    cameraEnabled = false;
    microphoneEnabled = false;
    isSearching = false;
    
    closeChatModal();
    showNotification('Video chat beëindigd', 'info');
}

function sendGroupMessage() {
    const input = document.getElementById('groupChatInput');
    if (input && input.value.trim()) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `<strong>Je:</strong> ${input.value}`;
        messagesContainer.appendChild(messageDiv);
        input.value = '';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Add CSS for chat modal
const chatModalStyles = `
    .chat-modal {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-content {
        background: #1a1a1a;
        border-radius: 15px;
        border: 2px solid #ff6b35;
        max-width: 800px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #333;
    }
    
    .modal-header h3 {
        color: #ffffff;
        margin: 0;
    }
    
    .close-btn {
        background: none;
        border: none;
        color: #ff6b35;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
    }
    
    .modal-body {
        padding: 20px;
        max-height: 60vh;
        overflow-y: auto;
    }
    
    .video-chat-container {
        text-align: center;
    }
    
    .video-placeholder {
        background: #000;
        border-radius: 10px;
        padding: 40px;
        margin-bottom: 20px;
    }
    
    .camera-icon {
        font-size: 48px;
        margin-bottom: 10px;
    }
    
    .loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #333;
        border-top: 3px solid #ff6b35;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 20px auto;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .chat-controls {
        display: flex;
        justify-content: center;
        gap: 10px;
    }
    
    .chat-btn {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
    }
    
    .chat-btn:hover {
        background: #ff8555;
        transform: translateY(-2px);
    }
    
    .end-call {
        background: #f44336;
    }
    
    .end-call:hover {
        background: #da190b;
    }
    
    .group-chat-container, .text-chat-container {
        display: flex;
        flex-direction: column;
        height: 400px;
    }
    
    .chat-messages {
        flex: 1;
        background: #000;
        border-radius: 10px;
        padding: 15px;
        overflow-y: auto;
        margin-bottom: 15px;
    }
    
    .message {
        color: #ffffff;
        margin-bottom: 10px;
        padding: 8px;
        background: #333;
        border-radius: 5px;
    }
    
    .chat-input-container, .chat-input {
        display: flex;
        gap: 10px;
    }
    
    .chat-input input, .chat-input-container input {
        flex: 1;
        padding: 10px;
        border: 1px solid #333;
        border-radius: 5px;
        background: #000;
        color: white;
    }
    
    .chat-input button, .chat-input-container button {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }
    
    .live-shows-container {
        text-align: center;
    }
    
    .show-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
    }
    
    .show-item {
        background: #333;
        padding: 20px;
        border-radius: 10px;
    }
    
    .show-thumbnail {
        font-size: 48px;
        margin-bottom: 10px;
    }
    
    .watch-btn {
        background: #ff6b35;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 5px;
        cursor: pointer;
    }
    
    .online-users {
        background: #333;
        padding: 15px;
        border-radius: 10px;
        margin-bottom: 15px;
    }
    
    .online-users h4 {
        color: #ff6b35;
        margin-top: 0;
    }
    
    .user-list {
        color: #ffffff;
    }
    
    .user-item {
        padding: 5px 0;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = chatModalStyles;
document.head.appendChild(styleSheet);