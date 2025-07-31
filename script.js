// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const backToTopBtn = document.getElementById('back-to-top');
const scrollProgress = document.querySelector('.scroll-progress');

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

// Scroll Progress Bar
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgress.style.width = scrollPercent + '%';
}

// Back to Top Button
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

    // Project cards
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });

    // Timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        observer.observe(item);
    });

    // General fade-in elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
        observer.observe(element);
    });
}

// Project Filtering - Integrated with pagination system
// This will be handled by the pagination system below

// Contact Form Submission with Spinner
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Show spinner and disable button
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');
    
    btnText.style.display = 'none';
    btnSpinner.style.display = 'inline-block';
    submitBtn.disabled = true;

    try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Success state
        btnSpinner.style.display = 'none';
        btnText.textContent = 'Message Sent!';
        btnText.style.display = 'inline-block';
        submitBtn.style.background = '#4CAF50';

        // Reset form
        contactForm.reset();

        // Reset button after 3 seconds
        setTimeout(() => {
            btnText.textContent = 'Send Message';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
        }, 3000);

    } catch (error) {
        // Error state
        btnSpinner.style.display = 'none';
        btnText.textContent = 'Error! Try Again';
        btnText.style.display = 'inline-block';
        submitBtn.style.background = '#f44336';
        submitBtn.disabled = false;

        // Reset button after 3 seconds
        setTimeout(() => {
            btnText.textContent = 'Send Message';
            submitBtn.style.background = '';
        }, 3000);
    }
});

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

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

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

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const originalText = heroTitle.textContent;
    setTimeout(() => {
        typeWriter(heroTitle, originalText, 80);
    }, 500);
});

// Scroll event listeners
window.addEventListener('scroll', () => {
    updateScrollProgress();
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
    updateScrollProgress();
    toggleBackToTop();
    updateActiveNavLink();
    updateFloatingShapes();
}, 16); // ~60fps

window.removeEventListener('scroll', () => {
    updateScrollProgress();
    toggleBackToTop();
    updateActiveNavLink();
    updateFloatingShapes();
});

window.addEventListener('scroll', throttledScroll);

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
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
        'CAD Projects/Academic Projects/Automotive Laboratory Rack/1.png',
        'CAD Projects/Academic Projects/Automotive Laboratory Rack/2.png',
        'CAD Projects/Academic Projects/Automotive Laboratory Rack/3.png',
        'CAD Projects/Academic Projects/Automotive Laboratory Rack/4.png'
    ],
    dashboardPanelImages: [
        'CAD Projects/Academic Projects/Dashboard Panel for Engine Test Bench/1.JPG',
        'CAD Projects/Academic Projects/Dashboard Panel for Engine Test Bench/2.JPG',
        'CAD Projects/Academic Projects/Dashboard Panel for Engine Test Bench/Screenshot 2024-10-16 100713.png'
    ],
    engineTestBenchImages: [
        'CAD Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054031.png',
        'CAD Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054052.png',
        'CAD Projects/Academic Projects/Engine Test Bench Sample Design/Screenshot 2025-07-30 054115.png'
    ],
    sinkTubImages: [
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095250.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095520.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095706.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095901.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100048.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100202.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 095737.png',
        'CAD Projects/Academic Projects/Sink & Tub with Cupboard/Screenshot 2024-10-09 100237.png',

    ],
    pulleySystemImages: [
        'CAD Projects/Academic Projects/Pulley for Gear Mechanism System/Screenshot 2025-07-30 054356.png',
        'CAD Projects/Academic Projects/Pulley for Gear Mechanism System/Screenshot 2025-07-30 054409.png'
    ],
    f1CarImages: [
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/1.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/2.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/3.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/4.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/5.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/6.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/7.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/9.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/10.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/11.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/12.png',
        'CAD Projects/Academic Projects/F1 Car for Simulation Purposes/13.png'

    ],
    inlineEngineImages: [
        'CAD Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/1.png',
        'CAD Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/2.png',
        'CAD Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/3.png',
        'CAD Projects/Academic Projects/Inline Four Cylinder Engine Sample Design/4.jpg',


    ],
    plasticBoatImages: [
        'CAD Projects/Academic Projects/Plastic Extractor Boat/1.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/2.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/3.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/4.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/5.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/6.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/7.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/8.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/9.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/10.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/11.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/12.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/13.png',
        'CAD Projects/Academic Projects/Plastic Extractor Boat/14.png',
    ],
    shockWheelImages: [
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/1.png',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/2.png',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/3.png',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/4.png',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/5.jpg',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/6.jpg',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/7.jpg',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/8.jpg',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/9.jpg',
        'CAD Projects/Academic Projects/Shock Spoke Wheel Mechanism/10.png',
    ],
    // Client Project Images
    sinhalaCakeCutterImages: [
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/1.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/2.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/3.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/4.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/5.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/6.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/7.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/8.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/9.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/10.png',
        'CAD Projects/Client Projects/Sinhala Letter Cake Cutter/11.png',
    ],
    tableDecorationStandImages: [
        'CAD Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052452.png',
        'CAD Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052510.png',
        'CAD Projects/Client Projects/Table Decoration Stand/Screenshot 2025-07-30 052528.png'
    ],
    tracRideEnclosureImages: [
        'CAD Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 051820.png',
        'CAD Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 051833.png',
        'CAD Projects/Client Projects/TracRide Enclosure/Screenshot 2025-07-30 052110.png'
    ],
    tunnelSuckingMechanismImages: [
        'CAD Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052826.png',
        'CAD Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052843.png',
        'CAD Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052917.png',
        'CAD Projects/Client Projects/Tunnel for Sucking Mechanism/Screenshot 2025-07-30 052925.png'
    ],
    thermalCollectorImages: [
        'CAD Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054802.png',
        'CAD Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054818.png',
        'CAD Projects/Client Projects/Thermal Collector/Screenshot 2025-07-30 054823.png',
        'CAD Projects/Client Projects/Thermal Collector/1.jpg',
        'CAD Projects/Client Projects/Thermal Collector/2.jpg'
        

    ]
};

function openImageViewer(element, imageSetName) {
    const img = element.querySelector('img');
    const imageSrc = img.src;
    currentImageSet = imageSets[imageSetName] || [];
    currentImageIndex = currentImageSet.findIndex(src => src === imageSrc);
    
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
    const projectsPerPage = 3;
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
        
        // Hide all cards first
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.display = 'none';
            card.classList.remove('show');
        });
        
        // Show only cards for current category and page
        categoryCards.forEach((card, idx) => {
            if (idx >= state.currentPage * projectsPerPage && idx < (state.currentPage + 1) * projectsPerPage) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('show'), 50);
            }
        });
        
        // Show message if no projects in category
        const projectGrid = document.querySelector('.projects-grid');
        let noProjectsMessage = projectGrid.querySelector('.no-projects-message');
        
        if (categoryCards.length === 0) {
            if (!noProjectsMessage) {
                noProjectsMessage = document.createElement('div');
                noProjectsMessage.className = 'no-projects-message';
                noProjectsMessage.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--muted);">
                        <h3>No projects available in this category</h3>
                        <p>Check back later for new projects!</p>
                    </div>
                `;
                projectGrid.appendChild(noProjectsMessage);
            }
            noProjectsMessage.style.display = 'block';
        } else {
            if (noProjectsMessage) {
                noProjectsMessage.style.display = 'none';
            }
        }
        
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

    // Also handle filter buttons that might be clicked before DOMContentLoaded
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

    // Initial render
    initializePagination();
})();