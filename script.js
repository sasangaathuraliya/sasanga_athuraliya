// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const backToTopBtn = document.getElementById('back-to-top');
const scrollProgressBar = document.getElementById('scroll-progress');

// Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Back to Top Button
// Fill the top progress bar in step with how far the page is scrolled
function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
    scrollProgressBar.style.transform = 'scaleX(' + progress + ')';
}

function toggleBackToTop() {
    if (window.scrollY > 400) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

// Observe elements for animations
function observeElements() {
    // Skill items
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });



    // General fade-in elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
        observer.observe(element);
    });
}

// Project Filtering - Integrated with pagination system
// This will be handled by the pagination system below

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Staggered animation for project cards
function staggerProjectCards() {
    const visibleCards = document.querySelectorAll('.project-card[style*="block"], .project-card:not([style*="none"])');
    visibleCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}


// Active navigation link highlighting with a stretching underline
const navUnderline = document.createElement('div');
navUnderline.className = 'nav-underline';
navMenu.appendChild(navUnderline);

let underlineLeft = 0;
let underlineWidth = 0;
let underlineBusy = false;
let underlinePending = null;
let navLockUntil = 0;

function setUnderline(left, width, duration) {
    navUnderline.style.transition = duration ? `left ${duration}ms ease, width ${duration}ms ease` : 'none';
    navUnderline.style.left = left + 'px';
    navUnderline.style.width = width + 'px';
}

function placeUnderline(link) {
    if (!link) return;
    underlineLeft = link.offsetLeft;
    underlineWidth = link.offsetWidth;
    setUnderline(underlineLeft, underlineWidth, 0);
}

function moveUnderline(link) {
    if (!link) return;
    if (underlineBusy) {
        underlinePending = link;
        return;
    }
    const newLeft = link.offsetLeft;
    const newWidth = link.offsetWidth;
    if (newLeft === underlineLeft && newWidth === underlineWidth) return;

    underlineBusy = true;
    if (newLeft >= underlineLeft) {
        // Stretch to the right, then shrink onto the new link
        setUnderline(underlineLeft, (newLeft - underlineLeft) + newWidth, 300);
    } else {
        // Stretch to the left, then shrink onto the new link
        setUnderline(newLeft, (underlineLeft - newLeft) + underlineWidth, 300);
    }
    setTimeout(() => {
        setUnderline(newLeft, newWidth, 150);
        setTimeout(() => {
            underlineLeft = newLeft;
            underlineWidth = newWidth;
            underlineBusy = false;
            if (underlinePending) {
                const next = underlinePending;
                underlinePending = null;
                moveUnderline(next);
            }
        }, 150);
    }, 300);
}

function setActiveNavLink(link) {
    const navLinks = document.querySelectorAll('.nav-link');
    if (link && link.classList.contains('active')) return;
    navLinks.forEach(l => l.classList.remove('active'));
    if (link) {
        link.classList.add('active');
        moveUnderline(link);
    }
}

function updateActiveNavLink() {
    if (Date.now() < navLockUntil) return; // a menu click is scrolling to its section
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    const activeLink = Array.from(navLinks).find(l => l.getAttribute('href') === `#${current}`);
    setActiveNavLink(activeLink || null);
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLockUntil = Date.now() + 900;
        setActiveNavLink(link);
    });
});

function positionUnderlineInitially() {
    const active = document.querySelector('.nav-link.active') || document.querySelector('.nav-link');
    if (active && !document.querySelector('.nav-link.active')) active.classList.add('active');
    placeUnderline(active);
}
document.addEventListener('DOMContentLoaded', positionUnderlineInitially);
window.addEventListener('load', positionUnderlineInitially);
window.addEventListener('resize', positionUnderlineInitially);
// Parallax effect for floating shapes
function updateFloatingShapes() {
    const shapes = document.querySelectorAll('.floating-shape');
    const scrolled = window.scrollY;
    const rate = scrolled * -0.5;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.2;
        shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
}

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads: line 1, then line 2
window.addEventListener('DOMContentLoaded', () => {
    const lines = Array.from(document.querySelectorAll('.hero-title .title-line'));
    const texts = lines.map(l => l.textContent);
    lines.forEach(l => { l.textContent = ''; });
    let current = 0;
    function typeNext() {
        if (current >= lines.length) return;
        const line = lines[current];
        const text = texts[current];
        let i = 0;
        (function type() {
            if (i < text.length) {
                line.textContent += text.charAt(i++);
                setTimeout(type, 80);
            } else {
                current++;
                setTimeout(typeNext, 250);
            }
        })();
    }
    window.addEventListener('siteLoaded', () => setTimeout(typeNext, 300), { once: true });
});

// Scroll event listeners
window.addEventListener('scroll', () => {
    toggleBackToTop();
    updateActiveNavLink();
    updateFloatingShapes();
});

// Initialize observers and animations
document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    staggerProjectCards();
    
    // Initial show for project cards
    setTimeout(() => {
        projectCards.forEach(card => {
            card.classList.add('show');
        });
    }, 500);
});

// Resize event for responsive adjustments
window.addEventListener('resize', () => {
    // Close mobile menu on resize
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization - throttle scroll events
function throttle(func, wait, options) {
    let context, args, result;
    let timeout = null;
    let previous = 0;
    if (!options) options = {};
    
    const later = function() {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    
    return function() {
        const now = Date.now();
        if (!previous && options.leading === false) previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = arguments;
        
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}

// Apply throttling to scroll events
const throttledScroll = throttle(() => {
    toggleBackToTop();
    updateActiveNavLink();
    updateFloatingShapes();
    updateScrollProgress();
}, 16); // ~60fps

window.removeEventListener('scroll', () => {
    toggleBackToTop();
    updateActiveNavLink();
    updateFloatingShapes();
});

window.addEventListener('scroll', throttledScroll);

// The page can load part-way down, and a resize changes how far there is to scroll
window.addEventListener('resize', updateScrollProgress);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    updateScrollProgress();
});

// Easter egg - Konami code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        // Easter egg activated
        document.body.style.animation = 'rainbow 2s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 10000);
        konamiCode = [];
    }
});

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);



// Add click handlers to academic and client project cards
document.addEventListener('DOMContentLoaded', () => {
    const academicCards = document.querySelectorAll('.project-card[data-category="academic"]');
    const clientCards = document.querySelectorAll('.project-card[data-category="clients"]');
    
    academicCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectType = card.getAttribute('data-project');
            if (projectType) {
                openProjectModal(projectType);
            }
        });
    });
    
    clientCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectType = card.getAttribute('data-project');
            if (projectType) {
                openProjectModal(projectType);
            }
        });
    });
});

// Project modal functions
function openProjectModal(projectType) {
    const modalId = projectType + 'Modal';
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Image viewer functionality for individual projects
let currentImageIndex = 0;
let currentImageSet = [];

const imageSets = {
    // Academic Project Images
    automotiveLabImages: [
        'Projects/Academic Projects/Automotive Laboratory Rack/1.png',
        'Projects/Academic Projects/Automotive Laboratory Rack/2.png',
        'Projects/Academic Projects/Automotive Laboratory Rack/3.png',
        'Projects/Academic Projects/Automotive Laboratory Rack/4.png'
    ],
    dashboardPanelImages: [
        'Projects/Academic Projects/Dashboard Panel for Engine Test Bench/1.JPG',
        'Projects/Academic Projects/Dashboard Panel for Engine Test Bench/2.JPG',
        'Projects/Academic Projects/Dashboard Panel for Engine Test Bench/Screenshot 2024-10-16 100713.png'
    ],
    engineTestBenchImages: [
        'Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054031.png',
        'Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054052.png',
        'Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054115.png'
    ],
    sinkTubImages: [
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095250.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095520.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095706.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095901.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100048.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100202.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095737.png',
        'Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100237.png',

    ],
    pulleySystemImages: [
        'Projects/Academic Projects/Pulley for Gear Mechanism System/Screenshot 2025-07-30 054356.png',
        'Projects/Academic Projects/Pulley for Gear Mechanism System/Screenshot 2025-07-30 054409.png'
    ],
    f1CarImages: [
        'Projects/Academic Projects/F1 Car for Simulation Purposes/1.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/2.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/3.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/4.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/5.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/6.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/7.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/9.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/10.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/11.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/12.png',
        'Projects/Academic Projects/F1 Car for Simulation Purposes/13.png'

    ],
    inlineEngineImages: [
        'Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/1.png',
        'Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/2.png',
        'Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/3.png',
        'Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/4.jpg',


    ],
    plasticBoatImages: [
        'Projects/Academic Projects/Plastic Extractor Boat/1.png',
        'Projects/Academic Projects/Plastic Extractor Boat/2.png',
        'Projects/Academic Projects/Plastic Extractor Boat/3.png',
        'Projects/Academic Projects/Plastic Extractor Boat/4.png',
        'Projects/Academic Projects/Plastic Extractor Boat/5.png',
        'Projects/Academic Projects/Plastic Extractor Boat/6.png',
        'Projects/Academic Projects/Plastic Extractor Boat/7.png',
        'Projects/Academic Projects/Plastic Extractor Boat/8.png',
        'Projects/Academic Projects/Plastic Extractor Boat/9.png',
        'Projects/Academic Projects/Plastic Extractor Boat/10.png',
        'Projects/Academic Projects/Plastic Extractor Boat/11.png',
        'Projects/Academic Projects/Plastic Extractor Boat/12.png',
        'Projects/Academic Projects/Plastic Extractor Boat/13.png',
        'Projects/Academic Projects/Plastic Extractor Boat/14.png',
    ],
    shockWheelImages: [
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/1.png',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/2.png',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/3.png',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/4.png',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/5.jpg',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/6.jpg',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/7.jpg',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/8.jpg',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/9.jpg',
        'Projects/Academic Projects/Shock Spoke Wheel Mechanism/10.png',
    ],
    // Client Project Images
    sinhalaCakeCutterImages: [
        'Projects/Client Projects/Sinhala Letter Cake Cutter/2.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/3.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/4.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/5.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/6.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/7.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/9.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/10.png',
        'Projects/Client Projects/Sinhala Letter Cake Cutter/11.png',
    ],
    tableDecorationStandImages: [
        'Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052452.png',
        'Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052510.png',
        'Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052528.png'
    ],
    tracRideEnclosureImages: [
        'Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 051820.png',
        'Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 051833.png',
        'Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 052110.png'
    ],
    tunnelSuckingMechanismImages: [
        'Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052826.png',
        'Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052843.png',
        'Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052917.png',
        'Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052925.png'
    ],
    // Final-year projects
    biomorphicChassisImages: [
        'Projects/Academic Projects/FYRP/Image9.png',
        'Projects/Academic Projects/FYRP/Image11.png',
        'Projects/Academic Projects/FYRP/Image12.png',
        'Projects/Academic Projects/FYRP/Image13.png',
        'Projects/Academic Projects/FYRP/Image14.png',
        'Projects/Academic Projects/FYRP/Image15.png',
        'Projects/Academic Projects/FYRP/Image16.png',
        'Projects/Academic Projects/FYRP/Image17.png'
    ],
    phoneSimImages: [
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-23 215031.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-23 230033.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060808.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060816.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060835.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060926.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060934.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060945.png',
        'Projects/Academic Projects/FYGP/Screenshot 2026-09-28 060954.png'
    ],
    airDuctImages: [
        'Projects/Client Projects/Air Duct Design for Electric Tray Dryer/Screenshot 2026-08-22 214853.png',
        'Projects/Client Projects/Air Duct Design for Electric Tray Dryer/Screenshot 2026-08-22 214901.png',
        'Projects/Client Projects/Air Duct Design for Electric Tray Dryer/Screenshot 2026-08-22 214910.png',
        'Projects/Client Projects/Air Duct Design for Electric Tray Dryer/Screenshot 2026-08-22 214916.png',
        'Projects/Client Projects/Air Duct Design for Electric Tray Dryer/Screenshot 2026-08-22 214923.png'
    ],
    enclosureImages: [
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 203939.png',
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 203946.png',
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 203953.png',
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 204023.png',
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 204032.png',
        'Projects/Client Projects/Enclosure Design for IoT Indoor Air Quality Monitoring System/Screenshot 2026-08-24 204042.png'
    ],
    thermalCollectorImages: [
        'Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054802.png',
        'Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054818.png',
        'Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054823.png',
        'Projects/Client Projects/Thermal Collector/1.jpg',
        'Projects/Client Projects/Thermal Collector/2.jpg'
        

    ]
};

function openImageViewer(element, imageSetName) {
    const img = element.querySelector('img');
    const imageSrc = img.src;
    currentImageSet = imageSets[imageSetName] || [];
    currentImageIndex = currentImageSet.findIndex(src => decodeURIComponent(imageSrc).endsWith(src));
    
    if (currentImageIndex === -1) {
        currentImageIndex = 0;
    }
    
    const viewer = document.getElementById('imageViewer');
    const viewerImg = document.getElementById('viewerImage');
    const counter = document.getElementById('imageCounter');
    
    viewerImg.src = currentImageSet[currentImageIndex];
    counter.textContent = `${currentImageIndex + 1} / ${currentImageSet.length}`;
    viewer.classList.add('show');
}

function closeImageViewer() {
    document.getElementById('imageViewer').classList.remove('show');
}

function nextImage() {
    if (currentImageSet.length > 0) {
        currentImageIndex = (currentImageIndex + 1) % currentImageSet.length;
        updateImageViewer();
    }
}

function previousImage() {
    if (currentImageSet.length > 0) {
        currentImageIndex = (currentImageIndex - 1 + currentImageSet.length) % currentImageSet.length;
        updateImageViewer();
    }
}

function updateImageViewer() {
    const viewerImg = document.getElementById('viewerImage');
    const counter = document.getElementById('imageCounter');
    
    if (currentImageSet.length > 0) {
        viewerImg.src = currentImageSet[currentImageIndex];
        counter.textContent = `${currentImageIndex + 1} / ${currentImageSet.length}`;
    }
}

// Close image viewer with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeImageViewer();
    } else if (e.key === 'ArrowLeft') {
        previousImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Close image viewer when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const imageViewer = document.getElementById('imageViewer');
    if (imageViewer) {
        imageViewer.addEventListener('click', (e) => {
            if (e.target.id === 'imageViewer') {
                closeImageViewer();
            }
        });
    }
});

// --- Project Pagination ---
(function() {
    const projectsPerPage = 4;
    const projectGrid = document.querySelector('.projects-grid');
    const paginationContainer = document.querySelector('.project-pagination');
    if (!projectGrid || !paginationContainer) return;

    // Category-specific pagination state
    const paginationState = {
        academic: { currentPage: 0, totalPages: 0 },
        'non-academic': { currentPage: 0, totalPages: 0 },
        clients: { currentPage: 0, totalPages: 0 }
    };

    // Get current active filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.getAttribute('data-filter') : 'academic';
    }

    // Get cards for current category
    function getCurrentCategoryCards() {
        const currentFilter = getCurrentFilter();
        return Array.from(document.querySelectorAll(`.project-card[data-category="${currentFilter}"]`));
    }

    function renderPaginationDots() {
        const currentFilter = getCurrentFilter();
        const state = paginationState[currentFilter];
        
        // Remove all dots
        Array.from(paginationContainer.querySelectorAll('.pagination-dot')).forEach(dot => dot.remove());
        
        // Create dots for current category
        for (let i = 0; i < state.totalPages; i++) {
            const dot = document.createElement('span');
            dot.className = 'pagination-dot' + (i === state.currentPage ? ' active' : '');
            dot.addEventListener('click', () => {
                state.currentPage = i;
                showCurrentPage();
            });
            // Insert after left arrow, before right arrow
            paginationContainer.insertBefore(dot, paginationContainer.querySelector('.pagination-arrow.right'));
        }
    }

    function showCurrentPage() {
        const currentFilter = getCurrentFilter();
        const state = paginationState[currentFilter];
        const categoryCards = getCurrentCategoryCards();

        // Hide all cards and section headers first
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = 'none';
            card.classList.remove('show');
        });

        document.querySelectorAll('.project-section-header').forEach(header => {
            header.style.display = 'none';
        });

        document.querySelectorAll('.projects-grid').forEach(grid => {
            grid.style.display = 'none';
        });

        // Show grid for current category
        const categoryGrid = document.querySelector(`.projects-grid[data-category="${currentFilter}"]`) ||
                             document.querySelector(`.${currentFilter}-grid`);

        if (categoryGrid) {
            categoryGrid.style.display = 'flex';
        }

        // Show only cards for current category and page
        categoryCards.forEach((card, idx) => {
            if (idx >= state.currentPage * projectsPerPage && idx < (state.currentPage + 1) * projectsPerPage) {
                card.style.display = 'flex';
                card.style.setProperty('--delay', ((idx - state.currentPage * projectsPerPage) * 0.12) + 's');
                void card.offsetWidth; // restart the animation
                card.classList.add('show');
            }
        });

        // Show message if no projects in category
        const activeGrid = categoryGrid || document.querySelector('.projects-grid');
        let noProjectsMessage = activeGrid ? activeGrid.querySelector('.no-projects-message') : null;

        if (categoryCards.length === 0) {
            if (activeGrid) {
                if (!noProjectsMessage) {
                    noProjectsMessage = document.createElement('div');
                    noProjectsMessage.className = 'no-projects-message';
                    noProjectsMessage.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: var(--muted);">
                            <h3>No projects available in this category</h3>
                            <p>Check back later for new projects!</p>
                        </div>
                    `;
                    activeGrid.appendChild(noProjectsMessage);
                }
                noProjectsMessage.style.display = 'block';
            }
        } else {
            if (noProjectsMessage) {
                noProjectsMessage.style.display = 'none';
            }
        }

        fitCardText();
        renderPaginationDots();
        updateArrowStates();
    }

    function updateArrowStates() {
        const currentFilter = getCurrentFilter();
        const state = paginationState[currentFilter];
        
        const leftArrow = paginationContainer.querySelector('.pagination-arrow.left');
        const rightArrow = paginationContainer.querySelector('.pagination-arrow.right');
        
        if (leftArrow) leftArrow.disabled = state.currentPage === 0;
        if (rightArrow) rightArrow.disabled = state.currentPage === state.totalPages - 1;
    }

    function updatePaginationForCategory(category) {
        const categoryCards = Array.from(document.querySelectorAll(`.project-card[data-category="${category}"]`));
        paginationState[category].totalPages = Math.ceil(categoryCards.length / projectsPerPage);
        paginationState[category].currentPage = 0; // Reset to first page when switching categories
        
        // Hide pagination if no projects in category
        const paginationContainer = document.querySelector('.project-pagination');
        if (categoryCards.length === 0) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'flex';
        }
    }

    // Arrow event listeners
    const leftArrow = paginationContainer.querySelector('.pagination-arrow.left');
    const rightArrow = paginationContainer.querySelector('.pagination-arrow.right');
    
    if (leftArrow) {
        leftArrow.addEventListener('click', () => {
            const currentFilter = getCurrentFilter();
            const state = paginationState[currentFilter];
            if (state.currentPage > 0) {
                state.currentPage--;
                showCurrentPage();
            }
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', () => {
            const currentFilter = getCurrentFilter();
            const state = paginationState[currentFilter];
            if (state.currentPage < state.totalPages - 1) {
                state.currentPage++;
                showCurrentPage();
            }
        });
    }

    // Initialize pagination for all categories
    function initializePagination() {
        updatePaginationForCategory('academic');
        updatePaginationForCategory('non-academic');
        updatePaginationForCategory('clients');
        showCurrentPage();
    }

    // Listen for filter changes
    document.addEventListener('DOMContentLoaded', () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active filter
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Reset pagination for new category
                const category = button.getAttribute('data-filter');
                updatePaginationForCategory(category);
                showCurrentPage();
            });
        });
        
        // Initialize pagination
        initializePagination();
    });


    // Initial render
    initializePagination();
})();
// Close a project modal by clicking the dark background or pressing Esc
document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
        closeProjectModal(e.target.id);
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.show').forEach(m => closeProjectModal(m.id));
    }
});

// Loading screen: hide once the page has loaded (shown at least 500ms), then start the hero intro
(function() {
    const loader = document.getElementById('page-loader');
    const startTime = Date.now();
    let done = false;

    function hideLoader() {
        if (done) return;
        done = true;
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 600);
        }
        document.body.classList.remove('loading');
        window.dispatchEvent(new Event('siteLoaded'));
    }

    window.addEventListener('load', () => {
        setTimeout(hideLoader, Math.max(0, 500 - (Date.now() - startTime)));
    });
    setTimeout(hideLoader, 4000); // fallback so it can never get stuck
})();

// Fit each visible card's description to the free space; "..." appears only when text is cut
function fitCardText() {
    document.querySelectorAll('.project-card').forEach(card => {
        if (card.style.display === 'none') return;
        const p = card.querySelector('.project-content p');
        if (!p) return;
        p.style.flex = '1 1 0';
        p.style.height = 'auto';
        const lineHeight = parseFloat(getComputedStyle(p).lineHeight);
        if (!lineHeight || !p.clientHeight) return;
        const lines = Math.max(1, Math.floor(p.clientHeight / lineHeight));
        p.style.webkitLineClamp = lines;
        p.style.lineClamp = lines;
        p.style.flex = 'none';
        p.style.height = (lines * lineHeight) + 'px';
    });
}
window.addEventListener('load', fitCardText);
window.addEventListener('resize', fitCardText);

