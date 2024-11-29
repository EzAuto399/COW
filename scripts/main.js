/**
 * 1. Tokenomics Chart Initialization
 * Initializes the Chart.js doughnut chart on the Tokenomics page.
 */
function initializeTokenomicsChart() {
    console.log('Initializing Tokenomics Chart...');
    const canvas = document.getElementById('tokenomicsChart');
    if (!canvas) {
        console.log('Canvas element not found.');
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.log('Failed to get canvas context.');
        return;
    }

    try {
        const tokenomicsChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Community Rewards', 'Development', 'Marketing', 'Liquidity Pool', 'Team'],
                datasets: [
                    {
                        data: [40, 20, 15, 15, 10],
                        backgroundColor: [
                            '#FF6384',
                            '#36A2EB',
                            '#FFCE56',
                            '#4BC0C0',
                            '#9966FF',
                        ],
                        hoverBackgroundColor: [
                            '#FF6384CC',
                            '#36A2EBCC',
                            '#FFCE56CC',
                            '#4BC0C0CC',
                            '#9966FFCC',
                        ],
                    },
                ],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff',
                        },
                    },
                },
            },
        });
        console.log('Tokenomics Chart initialized successfully.');
    } catch (error) {
        console.error('Error initializing Tokenomics Chart:', error);
    }
}

// Initialize Chart.js only if on Tokenomics page
if (document.getElementById('tokenomicsChart')) {
    initializeTokenomicsChart();
}

/**
 * 2. Timeline Animations
 * Animates timeline items as they enter the viewport on the Roadmap page.
 */
function animateTimeline() {
    const items = document.querySelectorAll('.timeline-item');

    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0;
    };

    const run = () => {
        items.forEach((item) => {
            if (isInViewport(item)) {
                item.classList.add('show');
            }
        });
    };

    const debounce = (func, delay = 20) => {
        let timeout;
        return function () {
            clearTimeout(timeout);
            timeout = setTimeout(func, delay);
        };
    };

    window.addEventListener('load', run);
    window.addEventListener('resize', run);
    window.addEventListener('scroll', debounce(run));
}

if (document.querySelector('.timeline')) {
    animateTimeline();
}

/**
 * 3. Smooth Scrolling for Internal Links
 */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
            });
        }
    });
});

/**
 * 4. Responsive Navigation Menu Toggle
 */
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

const menuIcon = document.querySelector('.menu-icon');
if (menuIcon) {
    menuIcon.addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', function () {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

/**
 * 5. Haunted Floating Cows
 * Dynamically creates cows at random intervals, with random positions, avoiding overlap.
 */
function spawnCowsRandomly() {
    const existingPositions = []; // Track positions to avoid collisions
    const maxCows = 20; // Maximum number of cows at a time
    const minCows = 5; // Minimum number of cows to maintain
    const cowSize = 100; // Approximate size for collision detection

    /**
     * Helper: Generate random positions ensuring no overlap
     */
    function getRandomPosition(size) {
        const maxWidth = window.innerWidth - size;
        const maxHeight = window.innerHeight - size;

        let x, y, collision;

        do {
            collision = false;
            x = Math.random() * maxWidth;
            y = Math.random() * maxHeight;

            // Check for collision
            for (const pos of existingPositions) {
                const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                if (distance < size) {
                    collision = true;
                    break;
                }
            }
        } while (collision);

        existingPositions.push({ x, y });
        return { x, y };
    }

    /**
     * Creates a single cow at a random position and manages its animations.
     */
    function createCow() {
        if (document.querySelectorAll('.haunted-cow').length >= maxCows) return;

        const cow = document.createElement('img');
        cow.src = 'images/cow.png'; // Ensure path is correct
        cow.alt = 'Haunted Cow';
        cow.className = 'haunted-cow';

        // Generate random position and size
        const { x, y } = getRandomPosition(cowSize);
        cow.style.width = `${Math.random() * 150 + 50}px`; // Random size between 50px and 200px
        cow.style.position = 'absolute';
        cow.style.top = `${y}px`;
        cow.style.left = `${x}px`;
        cow.style.opacity = '0'; // Initially hidden
        cow.style.transition = 'opacity 3s ease-in-out, top 2s ease, left 2s ease';

        document.body.appendChild(cow);

        // Fade-in effect
        setTimeout(() => {
            cow.style.opacity = '1';

            // Fade-out and remove cow after a delay
            setTimeout(() => {
                cow.style.opacity = '0';

                setTimeout(() => {
                    document.body.removeChild(cow);
                    const index = existingPositions.findIndex((pos) => pos.x === x && pos.y === y);
                    if (index !== -1) existingPositions.splice(index, 1); // Remove from tracker
                }, 3000); // Matches fade-out duration
            }, Math.random() * 5000 + 2000); // Visible for 2–7 seconds
        }, 100); // Fade-in delay
    }

    /**
     * Ensure minimum number of cows are always visible.
     */
    function ensureMinimumCows() {
        const currentCows = document.querySelectorAll('.haunted-cow').length;
        if (currentCows < minCows) {
            for (let i = currentCows; i < minCows; i++) {
                createCow();
            }
        }
    }

    // Spawn cows at random intervals
    setInterval(() => {
        createCow();
        ensureMinimumCows(); // Check and maintain the minimum number of cows
    }, Math.random() * 2000 + 1000); // Random interval between 1–3 seconds
}

// Initialize cow spawning on page load
window.addEventListener('load', () => {
    console.log('Starting random cow spawning...');
    spawnCowsRandomly();
});
