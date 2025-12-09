
        let currentPage = 'home';

        function navigateTo(page) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(p => {
                p.classList.add('hidden');
            });

            // Show selected page
            document.getElementById(page).classList.remove('hidden');

            // Update nav links
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.dataset.page === page) {
                    link.classList.add('active');
                }
            });

            // Close mobile menu if open
            document.getElementById('navLinks').classList.remove('active');

            // Update current page
            currentPage = page;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function toggleMenu() {
            const navLinks = document.getElementById('navLinks');
            navLinks.classList.toggle('active');
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            const nav = document.querySelector('nav');
            const navLinks = document.getElementById('navLinks');
            if (!nav.contains(e.target)) {
                navLinks.classList.remove('active');
            }
        });

        // Handle back/forward browser navigation
        window.addEventListener('popstate', () => {
            // This is a placeholder for when you want to use proper URL routing
            console.log('Browser navigation detected');
        });

        // Prevent default link behavior
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
            });
        });

        function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.add('hidden');
    });

    // Show selected page
    document.getElementById(page).classList.remove('hidden');

    // Update nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Close mobile menu if open
    document.getElementById('navLinks').classList.remove('active');

    // Update current page
    currentPage = page;

    // Auto-load content based on page
    loadPageContent(page);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to auto-load content when navigating to pages
function loadPageContent(page) {
    switch(page) {
        case 'news':
            // Load news when navigating to news page
            setTimeout(() => {
                if (typeof fetchNews === 'function') {
                    fetchNews('general');
                }
            }, 100);
            break;
        case 'finance':
            // Load finance data when navigating to finance page
            setTimeout(() => {
                if (typeof fetchStockData === 'function') {
                    fetchStockData('AAPL');
                }
            }, 100);
            break;
        case 'movies':
            // Load movies when navigating to movies page
            setTimeout(() => {
                if (typeof fetchMovies === 'function') {
                    fetchMovies('popular');
                }
            }, 100);
            break;
        case 'weather':
            // Reset weather placeholder when navigating to weather page
            setTimeout(() => {
                const weatherPlaceholder = document.querySelector('#weather .api-placeholder');
                if (weatherPlaceholder && !weatherPlaceholder.querySelector('.weather-display')) {
                    weatherPlaceholder.innerHTML = `
                        <div class="api-placeholder-icon">🌤️</div>
                        <h3>Weather API Integration Placeholder</h3>
                        <p>This section will display live weather data including temperature, humidity, wind speed, and 5-day forecasts.</p>
                    `;
                }
            }, 100);
            break;
    }
}

// Also trigger content loading when the page first loads
document.addEventListener('DOMContentLoaded', function() {
    // Check which page is currently active and load its content
    const activePage = document.querySelector('.page:not(.hidden)');
    if (activePage) {
        loadPageContent(activePage.id);
    }
});