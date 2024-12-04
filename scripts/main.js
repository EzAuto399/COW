/**
 * 1. Tokenomics Chart Initialization
 * Initializes the Chart.js doughnut chart on the Tokenomics page.
 */
function initializeTokenomicsChart() {
    const canvas = document.getElementById('tokenomicsChart');
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
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
    menuIcon.addEventListener('click', toggleMenu);

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
 * Dynamically creates cows on the extreme left and right sides,
 * avoiding overlapping with main content sections.
 */
function spawnCowsRandomly() {
    const existingPositions = { left: [], right: [] };
    const maxCowsPerSide = 5;
    const minCowsPerSide = 2;
    const cowSize = 100;

    function getRandomPosition(side) {
        let x, y, collision;

        const sidePercentage = 12;
        const sideWidth = (window.innerWidth * sidePercentage) / 100;

        const xMin = side === 'left' ? 0 : window.innerWidth - sideWidth;
        const xMax = side === 'left' ? sideWidth : window.innerWidth;

        const yMin = 60;
        const yMax = window.innerHeight - cowSize;

        do {
            collision = false;
            x = Math.random() * (xMax - xMin - cowSize) + xMin;
            y = Math.random() * (yMax - yMin) + yMin;

            const positions = existingPositions[side];
            for (const pos of positions) {
                const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
                if (distance < cowSize) {
                    collision = true;
                    break;
                }
            }
        } while (collision);

        existingPositions[side].push({ x, y });
        return { x, y };
    }

    function createCow(side) {
        if (existingPositions[side].length >= maxCowsPerSide) return;

        const cow = document.createElement('img');
        cow.src = 'images/cow.png';
        cow.alt = 'Haunted Cow';
        cow.className = 'haunted-cow';

        const { x, y } = getRandomPosition(side);

        const size = Math.random() * 50 + 50;
        cow.style.width = `${size}px`;
        cow.style.position = 'absolute';
        cow.style.top = `${y}px`;
        cow.style.left = `${x}px`;
        cow.style.opacity = '0';
        cow.style.transition = 'opacity 3s ease-in-out, top 4s ease, left 4s ease';

        document.body.appendChild(cow);

        setTimeout(() => {
            cow.style.opacity = '1';

            setTimeout(() => {
                cow.style.opacity = '0';

                setTimeout(() => {
                    if (cow.parentElement) {
                        cow.parentElement.removeChild(cow);
                    }
                    const posIndex = existingPositions[side].findIndex(
                        (pos) => pos.x === x && pos.y === y
                    );
                    if (posIndex !== -1) existingPositions[side].splice(posIndex, 1);
                }, 3000);
            }, Math.random() * 5000 + 3000);
        }, 100);
    }

    function ensureMinimumCows() {
        ['left', 'right'].forEach((side) => {
            const currentCows = existingPositions[side].length;
            if (currentCows < minCowsPerSide) {
                const cowsToAdd = minCowsPerSide - currentCows;
                for (let i = 0; i < cowsToAdd; i++) {
                    createCow(side);
                }
            }
        });
    }

    setInterval(() => {
        const side = Math.random() < 0.5 ? 'left' : 'right';
        createCow(side);
        ensureMinimumCows();
    }, Math.random() * 3000 + 2000);
}

window.addEventListener('load', () => {
    spawnCowsRandomly();
});

/**
 * 6. Ghost Cursor Trail
 */
document.addEventListener('mousemove', function (e) {
    let ghost = document.createElement('div');
    ghost.className = 'ghost-trail';
    ghost.style.left = e.pageX + 'px';
    ghost.style.top = e.pageY + 'px';
    document.body.appendChild(ghost);
    setTimeout(function () {
        ghost.remove();
    }, 1000);
});

/**
 * 7. Play Sound on Scroll
 */
let hasPlayedScrollSound = false;
const scrollSound = document.getElementById('scrollSound');

window.addEventListener('scroll', () => {
    if (!hasPlayedScrollSound) {
        scrollSound.play();
        hasPlayedScrollSound = true;
    }
});

/**
 * 8. Light Overlay Removal on Page Load
 */
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("light-overlay");
    if (overlay) {
        if (!sessionStorage.getItem("lightEffectShown")) {
            overlay.addEventListener("animationend", () => {
                overlay.remove();
            });
            sessionStorage.setItem("lightEffectShown", "true");
        } else {
            overlay.remove();
        }
    }
});


/**
 * 8. Light Overlay Removal on Page Load
 */
document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("light-overlay");
    if (overlay) {
        if (!sessionStorage.getItem("lightEffectShown")) {
            overlay.addEventListener("animationend", () => {
                overlay.remove();
            });
            sessionStorage.setItem("lightEffectShown", "true");
        } else {
            overlay.remove();
        }
    }
});
