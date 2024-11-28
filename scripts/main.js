// scripts/main.js

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
                datasets: [{
                    data: [40, 20, 15, 15, 10],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF'
                    ],
                    hoverBackgroundColor: [
                        '#FF6384CC',
                        '#36A2EBCC',
                        '#FFCE56CC',
                        '#4BC0C0CC',
                        '#9966FFCC'
                    ]
                }]
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#fff'
                        }
                    }
                }
            }
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
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };

    const run = () => {
        items.forEach(item => {
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
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
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

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function () {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

/**
 * 5. Haunted Floating Cows
 * Dynamically creates 1–10 cows that float around the page.
 */
function createFloatingCows() {
    const numberOfCows = Math.floor(Math.random() * 10) + 1; // Randomly generate 1–10 cows
    const body = document.body;

    console.log(`Creating ${numberOfCows} floating cows...`);

    for (let i = 0; i < numberOfCows; i++) {
        const cow = document.createElement('img');
        cow.src = 'images/cow.png'; // Ensure this path is correct
        cow.alt = 'Haunted Cow';
        cow.className = 'haunted-cow';

        // Random initial position and size
        const width = `${Math.random() * 150 + 50}px`; // Size between 50px and 200px
        const top = `${Math.random() * window.innerHeight}px`;
        const left = `${Math.random() * window.innerWidth}px`;

        cow.style.width = width;
        cow.style.top = top;
        cow.style.left = left;
        cow.style.opacity = '1'; // Ensure visibility

        body.appendChild(cow);

        console.log(`Added cow ${i + 1}:`, {
            width,
            top,
            left,
            opacity: cow.style.opacity
        });

        animateCow(cow); // Start the animation
    }
}

function animateCow(cow) {
    const moveCow = () => {
        const newX = Math.random() * window.innerWidth;
        const newY = Math.random() * window.innerHeight;
        const newOpacity = Math.random() > 0.5 ? '1' : '0';

        cow.style.top = `${newY}px`;
        cow.style.left = `${newX}px`;
        cow.style.opacity = newOpacity;

        console.log(`Animating cow: new position (${newX.toFixed(2)}, ${newY.toFixed(2)}), opacity: ${newOpacity}`);

        setTimeout(moveCow, Math.random() * 3000 + 1000);
    };

    setTimeout(moveCow, Math.random() * 1000);
}

// Initialize haunted cows on page load
window.addEventListener('load', () => {
    console.log('Initializing haunted cows...');
    createFloatingCows();
});
