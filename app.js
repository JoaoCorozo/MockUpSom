// --- Data & State ---
const toursData = [
    {
        id: 1,
        title: "Tour experiencia mixta",
        location: "Viña Santa Secreto",
        price: 35000,
        rating: 4.5,
        category: "wine",
        imageClass: "img-1", // Using CSS classes for images as before
        description: "Conoce los viñedos, bodega, capilla colonial y degustación de 4 vinos.",
        duration: "1h 30m",
        schedule: "Mar-Sab 10:00-18:00",
        isFavorite: false
    },
    {
        id: 2,
        title: "Paseo en carruaje",
        location: "Viña Santa Rita",
        price: 45000,
        rating: 4.8,
        category: "hiking", // Mapping 'paseo' to hiking/outdoor
        imageClass: "img-2",
        description: "Recorre los viñedos históricos en un hermoso carruaje de época.",
        duration: "1h 00m",
        schedule: "Lun-Dom 09:00-17:00",
        isFavorite: false
    },
    {
        id: 3,
        title: "Cata subterránea",
        location: "Viña Santa Berta",
        price: 28000,
        rating: 4.9,
        category: "wine",
        imageClass: "img-3",
        description: "Una experiencia única degustando vinos premium en nuestra cava subterránea.",
        duration: "2h 00m",
        schedule: "Vie-Dom 12:00-20:00",
        isFavorite: false
    },
    {
        id: 4,
        title: "Picnic en viñedos",
        location: "Viña Montes",
        price: 40000,
        rating: 4.7,
        category: "food",
        imageClass: "img-1",
        description: "Disfruta de una canasta gourmet en medio de los viñedos con vista al valle.",
        duration: "3h 00m",
        schedule: "Lun-Dom 11:00-16:00",
        isFavorite: false
    },
    {
        id: 5,
        title: "Trekking y Vino",
        location: "Viña Lapostolle",
        price: 55000,
        rating: 4.9,
        category: "hiking",
        imageClass: "img-2",
        description: "Caminata por los cerros de Apalta seguida de una degustación exclusiva.",
        duration: "4h 00m",
        schedule: "Sab-Dom 08:00-14:00",
        isFavorite: false
    },
    {
        id: 6,
        title: "Cena Maridaje",
        location: "Restaurante Fuegos",
        price: 80000,
        rating: 5.0,
        category: "food",
        imageClass: "img-3",
        description: "Cena de 5 tiempos maridada con los mejores vinos de la zona.",
        duration: "3h 30m",
        schedule: "Jue-Sab 20:00-23:30",
        isFavorite: false
    },
    {
        id: 7,
        title: "Tour en Bicicleta",
        location: "Viña Cono Sur",
        price: 30000,
        rating: 4.6,
        category: "hiking",
        imageClass: "img-1",
        description: "Recorre los viñedos orgánicos en bicicleta y termina con una cata.",
        duration: "2h 30m",
        schedule: "Mar-Dom 10:00-17:00",
        isFavorite: false
    }
];

const userBookings = []; // Array to store bookings
let currentDetailId = null; // Track which tour is being viewed

// --- Navigation Logic ---
function navigateTo(screenId) {
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.add('hidden');
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('active');
    }

    // Handle Global Navbar Visibility
    const globalNav = document.getElementById('global-bottom-nav');
    if (screenId === 'screen-login' || screenId === 'screen-login-form' || screenId === 'screen-detail') {
        globalNav.classList.add('hidden');
    } else {
        globalNav.classList.remove('hidden');
        // Update Active State
        const navItems = globalNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === screenId) {
                item.classList.add('active');
            }
        });
    }

    // Refresh data if needed
    if (screenId === 'screen-favorites') renderFavorites();
    if (screenId === 'screen-saved') renderBookings();
}

// --- Modal Logic ---
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.classList.add('hidden');
    });
}

function finishReservation() {
    closeModal();
    navigateTo('screen-home');
}

// --- Rendering Functions ---

function renderTours(filter = 'all', searchText = '') {
    const container = document.getElementById('home-cards-grid');
    if (!container) return;
    container.innerHTML = '';

    const filteredTours = toursData.filter(tour => {
        const matchesCategory = filter === 'all' || tour.category === filter;
        const matchesSearch = tour.title.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    filteredTours.forEach(tour => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.onclick = () => openDetail(tour.id);

        const heartClass = tour.isFavorite ? 'fa-solid active' : 'fa-regular';

        card.innerHTML = `
            <div class="card-image ${tour.imageClass}">
                <i class="${heartClass} fa-heart favorite-icon" onclick="toggleFavorite(event, ${tour.id})"></i>
            </div>
            <div class="card-info">
                <h3>${tour.title}</h3>
                <p class="location">${tour.location}</p>
                <div class="rating">
                    <i class="fa-solid fa-star"></i> ${tour.rating}
                    <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    // Add spacer
    const spacer = document.createElement('div');
    spacer.style.height = '80px';
    container.appendChild(spacer);
}

function renderFavorites() {
    const container = document.getElementById('favorites-cards-grid');
    if (!container) return;
    container.innerHTML = '';

    const favorites = toursData.filter(tour => tour.isFavorite);

    if (favorites.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1; margin-top: 50px;">No tienes favoritos aún.</p>';
        return;
    }

    favorites.forEach(tour => {
        const card = document.createElement('div');
        card.className = 'tour-card';
        card.onclick = () => openDetail(tour.id);

        card.innerHTML = `
            <div class="card-image ${tour.imageClass}">
                <i class="fa-solid fa-heart favorite-icon active" onclick="toggleFavorite(event, ${tour.id})"></i>
            </div>
            <div class="card-info">
                <h3>${tour.title}</h3>
                <p class="location">${tour.location}</p>
                <div class="rating">
                    <i class="fa-solid fa-star"></i> ${tour.rating}
                    <button class="add-btn"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderBookings() {
    const container = document.getElementById('bookings-list');
    if (!container) return;
    container.innerHTML = '';

    if (userBookings.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; margin-top: 50px;">No tienes reservas próximas.</p>';
        return;
    }

    userBookings.forEach(booking => {
        const tour = toursData.find(t => t.id === booking.tourId);
        if (!tour) return;

        const card = document.createElement('div');
        card.className = 'booking-card';
        card.innerHTML = `
            <div class="booking-date">
                <span class="day">${booking.day}</span>
                <span class="month">${booking.month}</span>
            </div>
            <div class="booking-info">
                <h3>${tour.title}</h3>
                <p>${tour.location} - ${booking.time}</p>
                <span class="status confirmed">Confirmada</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function openDetail(id) {
    currentDetailId = id;
    const tour = toursData.find(t => t.id === id);
    if (!tour) return;

    // Populate Detail Screen
    const screen = document.getElementById('screen-detail');
    screen.querySelector('h2').innerText = tour.title;
    screen.querySelector('.detail-image').className = `detail-image ${tour.imageClass}`; // Reuse class for bg image
    // Note: In real app, we'd set background-image url directly. 
    // For now, let's assume the CSS classes set the image, which they do.

    // Update details
    const rows = screen.querySelectorAll('.detail-info-row');
    // Location
    rows[0].querySelector('p').innerText = tour.location;
    // Price
    rows[1].querySelector('p').innerText = `$${tour.price.toLocaleString()}`;
    // Schedule
    rows[3].querySelector('p').innerText = tour.schedule;
    // Duration
    rows[4].querySelector('p').innerText = tour.duration;

    // Description
    screen.querySelector('.detail-description p').innerText = tour.description;

    navigateTo('screen-detail');
}

// --- Actions ---

function toggleFavorite(event, id) {
    event.stopPropagation();
    const tour = toursData.find(t => t.id === id);
    if (tour) {
        tour.isFavorite = !tour.isFavorite;
        // Re-render current view
        const activeScreen = document.querySelector('.screen.active').id;
        if (activeScreen === 'screen-home') {
            // Preserve filter and search state
            const activeBtn = document.querySelector('.cat-btn.active');
            const activeFilter = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            const searchInput = document.getElementById('search-input');
            const searchText = searchInput ? searchInput.value : '';
            renderTours(activeFilter, searchText);
        }
        if (activeScreen === 'screen-favorites') renderFavorites();
    }
}

function makeReservation() {
    if (!currentDetailId) return;

    const btnReserve = document.getElementById('btn-reserve');
    btnReserve.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Procesando...';

    setTimeout(() => {
        // Add to bookings
        const today = new Date();
        const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];

        userBookings.push({
            tourId: currentDetailId,
            day: today.getDate(),
            month: monthNames[today.getMonth()],
            time: "10:00 hrs" // Default time
        });

        showModal('modal-reservation');
        btnReserve.innerHTML = 'Reservar';
    }, 1500);
}

// --- Initialization ---

document.addEventListener('DOMContentLoaded', () => {

    // Initial Render
    renderTours();

    // --- Navigation & Buttons ---
    const btnLoginEmail = document.getElementById('btn-login-email');
    if (btnLoginEmail) btnLoginEmail.addEventListener('click', () => navigateTo('screen-login-form'));

    const btnGuest = document.getElementById('btn-guest');
    if (btnGuest) btnGuest.addEventListener('click', () => navigateTo('screen-home'));

    // Bottom Nav listener removed - handled by navigateTo

    // --- Reservation Button ---
    const btnReserve = document.getElementById('btn-reserve');
    if (btnReserve) {
        btnReserve.addEventListener('click', makeReservation);
    }

    // --- Home Screen Filters ---
    const catBtns = document.querySelectorAll('.cat-btn');
    const searchInput = document.getElementById('search-input');

    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            catBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            renderTours(filter, searchInput ? searchInput.value : '');
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeBtn = document.querySelector('.cat-btn.active');
            const activeCat = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
            renderTours(activeCat, e.target.value);
        });
    }

    // --- Interactive Chat ---
    const chatInput = document.getElementById('chat-input');
    const btnSendChat = document.getElementById('btn-send-chat');
    const chatMessages = document.querySelector('.chat-messages');

    function sendMessage() {
        const text = chatInput.value.trim();
        if (text) {
            addMessage(text, 'sent');
            chatInput.value = '';

            // Simulate "typing" delay for realism
            setTimeout(() => {
                const sommelierReplies = [
                    "Una elección fascinante. Si me permite sugerir, ese vino marida exquisitamente con quesos maduros.",
                    "Entiendo perfectamente. Para esa ocasión, le recomendaría buscar notas más afrutadas y taninos suaves.",
                    "Por supuesto. El Valle de Colchagua ofrece condiciones climáticas únicas que otorgan un carácter inigualable a esa cepa.",
                    "Excelente pregunta. La temperatura de servicio es crucial; le sugiero decantarlo unos 30 minutos antes.",
                    "Es un placer asistirle. He tomado nota de sus preferencias para personalizar su próxima visita a la viña.",
                    "¡Ah, un conocedor! Esa añada en particular fue galardonada por su equilibrio y persistencia en boca."
                ];

                // Simple keyword matching for context (mock AI)
                let reply = sommelierReplies[Math.floor(Math.random() * sommelierReplies.length)];

                if (text.toLowerCase().includes('reserva')) {
                    reply = "Estaré encantado de gestionar su reserva. ¿Prefiere una experiencia al atardecer o un almuerzo maridado?";
                } else if (text.toLowerCase().includes('precio') || text.toLowerCase().includes('valor')) {
                    reply = "Nuestras experiencias están diseñadas para ofrecer el máximo valor. Los precios varían según la exclusividad de la cata.";
                } else if (text.toLowerCase().includes('hola') || text.toLowerCase().includes('buenos')) {
                    reply = "¡Saludos cordiales! Es un honor recibirle en nuestra cava digital. ¿Qué vino desea descubrir hoy?";
                }

                addMessage(reply, 'received');
            }, 1500);
        }
    }

    function addMessage(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', type);
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    if (btnSendChat) btnSendChat.addEventListener('click', sendMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- Profile Editing ---
    // Simple toggle for demo
    const editProfileBtn = document.querySelector('.menu-item:first-child'); // "Editar Perfil"
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const nameEl = document.querySelector('.profile-header h2');
            const currentName = nameEl.innerText;
            const newName = prompt("Editar Nombre:", currentName);
            if (newName) nameEl.innerText = newName;
        });
    }

    // --- Language Selector Logic ---
    const langSelector = document.getElementById('language-selector');
    const langDropdown = document.getElementById('language-dropdown');

    if (langSelector && langDropdown) {
        // Toggle dropdown on click
        langSelector.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            langDropdown.classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (!langDropdown.classList.contains('hidden')) {
                langDropdown.classList.add('hidden');
            }
        });
    }
});

// Global function for language selection (called from HTML onclick)
function selectLanguage(langName, flagEmoji) {
    const selectedLangSpan = document.getElementById('selected-language');
    if (selectedLangSpan) {
        selectedLangSpan.innerText = langName;
    }
    // Close dropdown
    const langDropdown = document.getElementById('language-dropdown');
    if (langDropdown) {
        langDropdown.classList.add('hidden');
    }
    // Optional: You could save preference to localStorage here
}
