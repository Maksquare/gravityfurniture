/* ============================================================
   1. MOBILE NAV TOGGLE
============================================================ */
/* ============================================================
   NAV: TOGGLE + SCROLL SPY + HEADER SCROLL STATE
============================================================ */
const navBtn   = document.getElementById('nav_trigger_btn');
const navMenu  = document.getElementById('nav_menu');
const header   = document.querySelector('header');
const navLinks = document.querySelectorAll('#nav_menu a[href^="#"]');
let navOpen = false;

/* ── Mobile toggle ── */
if (navBtn && navMenu) {
    navBtn.addEventListener('click', () => {
        if (window.innerWidth >= 1024) return;
        navOpen = !navOpen;
        navMenu.style.height  = navOpen ? navMenu.scrollHeight + 24 + 'px' : '0';
        navMenu.style.padding = navOpen ? '16px 24px' : '0';
    });
}

/* ── Resize guard ── */
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        navOpen = false;
        navMenu.style.height  = '';
        navMenu.style.padding = '';
    } else {
        if (!navOpen) {
            navMenu.style.height  = '0';
            navMenu.style.padding = '0';
        }
    }
});

/* ── Set active link ── */
function setActiveLink(id) {
    navLinks.forEach(link => {
        link.classList.toggle('nav-active', link.getAttribute('href') === '#' + id);
    });
}

/* ── Scroll spy + header state ── */
const sections = document.querySelectorAll('section[id], footer[id]');

function onScroll() {
    /* Header style on scroll */
    header.classList.toggle('header-scrolled', window.scrollY > 10);

    /* Active section detection */
    let current = '';
    sections.forEach(section => {
        const top    = section.offsetTop - 155;
        const bottom = top + section.offsetHeight;
        if (window.scrollY >= top && window.scrollY < bottom) {
            current = section.id;
        }
    });
    if (current) setActiveLink(current);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ── Click: set active + close mobile nav ── */
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        setActiveLink(this.getAttribute('href').replace('#', ''));
        if (window.innerWidth < 1024) {
            navOpen = false;
            navMenu.style.height  = '0';
            navMenu.style.padding = '0';
        }
    });
});
/* ============================================================
   2. SMOOTH SCROLL
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (window.innerWidth < 1024 && navMenu) {
            navMenu.style.height  = '0';
            navMenu.style.padding = '0';
        }
    });
});

/* ============================================================
   3. TESTIMONIAL SWIPER
============================================================ */
new Swiper('.testimonial-swiper', {
    loop: true,
    speed: 700,
    grabCursor: true,
    slidesPerView: 1,
    spaceBetween: 30,
    autoplay: { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.testimonial-swiper .swiper-pagination', clickable: true },
    breakpoints: {
        1024: { slidesPerView: 2 },
        1280: { slidesPerView: 3 },
    },
});

/* ============================================================
   4. MODAL SYSTEM
============================================================ */
let _closing = false;

function openModal(id) {
    const bd = document.getElementById(id);
    if (!bd) return;
    const card = bd.querySelector('.modal-card, .gallery-modal-card');
    if (!card) return;

    _closing = false;
    bd.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    bd.getAnimations().forEach(a => a.cancel());
    card.getAnimations().forEach(a => a.cancel());

    bd.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 200, easing: 'ease-out', fill: 'forwards' });

    card.animate([
        { opacity: 0,   transform: 'translateY(44px) scale(0.94)' },
        { opacity: 0.7, transform: 'translateY(-5px) scale(1.01)', offset: 0.72 },
        { opacity: 1,   transform: 'translateY(0) scale(1)' }
    ], { duration: 440, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
}

function closeModal(bd) {
    if (!bd || _closing) return;
    const card = bd.querySelector('.modal-card, .gallery-modal-card');
    if (!card) return;
    _closing = true;

    card.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.96)' }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' }
    );
    bd.animate([{ opacity: 1 }, { opacity: 0 }],
        { duration: 240, easing: 'ease-in', fill: 'forwards' }
    ).onfinish = () => {
        bd.style.display = 'none';
        document.body.style.overflow = '';
        _closing = false;
    };
}

/* Close buttons (X inside modal) */
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
        e.stopPropagation();
        closeModal(btn.closest('.modal-backdrop'));
    });
});

/* Click backdrop to close */
document.querySelectorAll('.modal-backdrop').forEach(bd => {
    bd.addEventListener('click', e => { if (e.target === bd) closeModal(bd); });
});

/* Links that close + navigate */
document.querySelectorAll('.modal-close-trigger').forEach(el => {
    el.addEventListener('click', () => closeModal(el.closest('.modal-backdrop')));
});

/* ESC key */
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        const open = document.querySelector('.modal-backdrop[style*="flex"]');
        if (open) closeModal(open);
    }
});

/* Read More buttons → service modals */
document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal(btn.dataset.modal);
    });
});

/* Phone trigger */
const phoneTrigger = document.getElementById('phone-trigger');
if (phoneTrigger) {
    phoneTrigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal('modal-phone');
    });
}

/* Showroom / social trigger */
const showroomTrigger = document.getElementById('showroom-trigger');
if (showroomTrigger) {
    showroomTrigger.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal('modal-showroom');
    });
}

/* Contact section button */
const contactBtn = document.querySelector('.contact__container .btn-accent');
if (contactBtn) {
    contactBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        openModal('modal-phone');
    });
}

/* ============================================================
   5. GALLERY LIGHTBOX
============================================================ */
const GALLERY = {
    living:  { title: 'Luxury Living Room Set', badge: 'Living Room', slides: [
        { src: 'assets/work/01.png', fb: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=85&auto=format&fit=crop', title: 'Velvet Cloud Sofa', sub: 'Deep-seated luxury · Solid walnut legs' },
        { src: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Forme Lounge Chair', sub: 'Organically sculpted oak · Full-grain leather' },
        { src: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Strata Shelving Unit', sub: 'Modular solid oak · Offset geometry' },
        { src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Signature Living Set', sub: "Editor's Pick 2026 · Grade-A Walnut" }
    ]},
    office:  { title: 'Executive Home Office', badge: 'Home Office', slides: [
        { src: 'assets/work/02.png', fb: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200&q=85&auto=format&fit=crop', title: 'Meridian Executive Desk', sub: 'Thick walnut top · Brass hardware' },
        { src: 'https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?w=1200&q=85&auto=format&fit=crop', fb: '', title: "Director's Chair", sub: 'Full-grain leather · Polished steel base' },
        { src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Studio Bookcase', sub: 'Open walnut shelving · Cable management' }
    ]},
    bedroom: { title: 'Bespoke Bedroom Suite', badge: 'Bedroom', slides: [
        { src: 'assets/work/03.png', fb: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&q=85&auto=format&fit=crop', title: 'Opus King Bed Frame', sub: 'Bouclé headboard · Brass-capped legs' },
        { src: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Sable Wardrobe System', sub: 'Matte ebony finish · Integrated LED' },
        { src: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Marble Nightstand', sub: 'Honed Calacatta top · Walnut drawer' }
    ]},
    dining:  { title: 'Artisan Dining Collection', badge: 'Dining Room', slides: [
        { src: 'assets/work/04.png', fb: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=85&auto=format&fit=crop', title: 'Atlas Dining Table', sub: 'Live-edge oak · Brushed steel base' },
        { src: 'https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Arc Dining Chair', sub: 'Set of 6 · Bouclé upholstery' },
        { src: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=85&auto=format&fit=crop', fb: '', title: 'Pendant Bar Cabinet', sub: 'Walnut & glass · Built-in lighting' }
    ]}
};

let gCat = 'living', gIdx = 0, gAnim = false;
const gBd    = document.getElementById('modal-gallery');
const gCard  = document.getElementById('gallery-card');
const gTrack = document.getElementById('gallery-track');
const gDots  = document.getElementById('gallery-dots');
const gBadge = document.getElementById('gallery-badge');
const gTitle = document.getElementById('gallery-cat-title');
const gITitle = document.getElementById('gallery-img-title');
const gISub  = document.getElementById('gallery-img-sub');
const gCount = document.getElementById('gallery-counter');
const gPrev  = document.getElementById('gallery-prev');
const gNext  = document.getElementById('gallery-next');

function buildGallery(cat, idx) {
    const d = GALLERY[cat]; if (!d) return;
    gCat = cat; gIdx = idx || 0;
    gBadge.textContent = d.badge;
    gTitle.textContent = d.title;

    gTrack.innerHTML = '';
    d.slides.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'gallery-slide' + (i === gIdx ? ' is-active' : '');
        const img = document.createElement('img');
        img.alt = s.title; img.src = s.src;
        if (s.fb) img.onerror = function () { this.src = s.fb; this.onerror = null; };
        div.appendChild(img); gTrack.appendChild(div);
    });

    gDots.innerHTML = '';
    d.slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.className = 'gallery-dot' + (i === gIdx ? ' is-active' : '');
        b.addEventListener('click', () => gGoTo(i));
        gDots.appendChild(b);
    });
    gMeta();
}

function gMeta() {
    const d = GALLERY[gCat], total = d.slides.length, s = d.slides[gIdx];
    gITitle.textContent = s.title;
    gISub.textContent   = s.sub;
    gCount.textContent  = (gIdx + 1) + ' / ' + total;
    gPrev.disabled = gIdx === 0;
    gNext.disabled = gIdx === total - 1;
    gDots.querySelectorAll('.gallery-dot').forEach((b, i) => b.classList.toggle('is-active', i === gIdx));
}

function gGoTo(ni, dir) {
    if (gAnim) return;
    const total = GALLERY[gCat].slides.length;
    if (ni < 0 || ni >= total) return;
    gAnim = true;
    const slides = gTrack.querySelectorAll('.gallery-slide');
    const cur = slides[gIdx], nxt = slides[ni];
    const d = dir !== undefined ? dir : (ni > gIdx ? 1 : -1);
    const outX = d > 0 ? '-60px' : '60px', inX = d > 0 ? '60px' : '-60px';

    cur.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${outX})` }],
        { duration: 260, easing: 'cubic-bezier(0.4,0,1,1)', fill: 'forwards' });

    nxt.style.opacity = '0';
    nxt.classList.add('is-active');
    nxt.animate([{ opacity: 0, transform: `translateX(${inX})` }, { opacity: 1, transform: 'translateX(0)' }],
        { duration: 320, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
    ).onfinish = () => {
        cur.classList.remove('is-active');
        cur.style.opacity = cur.style.transform = '';
        gIdx = ni; gMeta(); gAnim = false;
    };
}

gPrev.addEventListener('click', () => gGoTo(gIdx - 1, -1));
gNext.addEventListener('click', () => gGoTo(gIdx + 1,  1));

document.addEventListener('keydown', e => {
    if (!gBd || gBd.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft')  gGoTo(gIdx - 1, -1);
    if (e.key === 'ArrowRight') gGoTo(gIdx + 1,  1);
});

let tX = 0;
gCard.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
gCard.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - tX;
    if (Math.abs(dx) > 40) gGoTo(dx < 0 ? gIdx + 1 : gIdx - 1, dx < 0 ? 1 : -1);
}, { passive: true });

document.getElementById('gallery-close-btn').addEventListener('click', () => closeModal(gBd));
gBd.addEventListener('click', e => { if (e.target === gBd) closeModal(gBd); });
gBd.querySelectorAll('.gallery-close-trigger').forEach(el => {
    el.addEventListener('click', () => closeModal(gBd));
});

function openGallery(cat, idx) {
    buildGallery(cat, idx || 0);
    gBd.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    gBd.getAnimations().forEach(a => a.cancel());
    gCard.getAnimations().forEach(a => a.cancel());
    gBd.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'forwards' });
    gCard.animate([{ opacity: 0, transform: 'scale(0.96)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 380, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
}

document.querySelectorAll('.work-item').forEach(item => {
    const cat     = item.dataset.category;
    const arrow   = item.querySelector('.work-arrow');
    const imgWrap = item.querySelector('.work-item__img-wrap');
    if (arrow)   arrow.addEventListener('click',   e => { e.stopPropagation(); openGallery(cat, 0); });
    if (imgWrap) imgWrap.addEventListener('click', e => { e.stopPropagation(); openGallery(cat, 0); });
});




/* ============================================================
   NEWS MODAL
============================================================ */
const newsBd      = document.getElementById('modal-news');
const newsTrack   = document.getElementById('news-slides-track');
const newsTabs    = document.querySelectorAll('.news-modal-tab');
const newsCloseBtn= document.getElementById('news-modal-close');

let newsIdx = 0;

const NEWS_MAP = { sofa: 0, wood: 1, trends: 2 };

function openNewsModal(slideIdx) {
    newsIdx = slideIdx || 0;
    newsTrack.style.transition = 'none';
    newsTrack.style.transform  = `translateX(-${newsIdx * 100}%)`;
    updateNewsTabs();

    newsBd.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    newsBd.getAnimations().forEach(a => a.cancel());
    const card = newsBd.querySelector('.news-modal-card');
    card.getAnimations().forEach(a => a.cancel());

    newsBd.animate([{ opacity: 0 }, { opacity: 1 }],
        { duration: 220, easing: 'ease-out', fill: 'forwards' });
    card.animate([
        { opacity: 0,   transform: 'translateY(40px) scale(0.95)' },
        { opacity: 0.8, transform: 'translateY(-4px) scale(1.01)', offset: 0.7 },
        { opacity: 1,   transform: 'translateY(0) scale(1)' }
    ], { duration: 460, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' });
}

function closeNewsModal() {
    const card = newsBd.querySelector('.news-modal-card');
    card.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.96)' }],
        { duration: 220, easing: 'ease-in', fill: 'forwards' }
    );
    newsBd.animate([{ opacity: 1 }, { opacity: 0 }],
        { duration: 240, easing: 'ease-in', fill: 'forwards' }
    ).onfinish = () => {
        newsBd.style.display = 'none';
        document.body.style.overflow = '';
    };
}

function goToNewsSlide(idx) {
    newsIdx = idx;
    newsTrack.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
    newsTrack.style.transform  = `translateX(-${newsIdx * 100}%)`;
    updateNewsTabs();
}

function updateNewsTabs() {
    newsTabs.forEach((tab, i) => tab.classList.toggle('is-active', i === newsIdx));
}

/* Tab clicks */
newsTabs.forEach((tab, i) => {
    tab.addEventListener('click', () => goToNewsSlide(i));
});

/* Close */
newsCloseBtn.addEventListener('click', closeNewsModal);
newsBd.addEventListener('click', e => { if (e.target === newsBd) closeNewsModal(); });
document.querySelectorAll('.news-close-trigger').forEach(el => {
    el.addEventListener('click', () => closeNewsModal());
});

/* News card clicks */
document.querySelectorAll('.news__item').forEach(item => {
    item.addEventListener('click', () => {
        const key = item.dataset.news;
        openNewsModal(NEWS_MAP[key] ?? 0);
    });
});

/* Keyboard */
document.addEventListener('keydown', e => {
    if (!newsBd || newsBd.style.display !== 'flex') return;
    if (e.key === 'ArrowLeft'  && newsIdx > 0) goToNewsSlide(newsIdx - 1);
    if (e.key === 'ArrowRight' && newsIdx < 2)  goToNewsSlide(newsIdx + 1);
});

/* Touch swipe */
let nTouchX = 0;
newsBd.addEventListener('touchstart', e => { nTouchX = e.touches[0].clientX; }, { passive: true });
newsBd.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - nTouchX;
    if (Math.abs(dx) > 40) {
        if (dx < 0 && newsIdx < 2) goToNewsSlide(newsIdx + 1);
        if (dx > 0 && newsIdx > 0) goToNewsSlide(newsIdx - 1);
    }
}, { passive: true });


/* ============================================================
   6. SCROLL REVEAL
============================================================ */
const sr = ScrollReveal({
    origin: 'bottom',
    distance: '60px',
    duration: 1000,
    delay: 200,
});

sr.reveal('.hero__text',        { origin: 'top' });
sr.reveal('.steps__step',       { interval: 150 });
sr.reveal('.about__text',       { origin: 'left' });
sr.reveal('.about__img',        { origin: 'right', delay: 400 });
sr.reveal('.testimonial__bg',   { delay: 200 });
sr.reveal('.brands__img',       { interval: 100 });
sr.reveal('.work__title');
sr.reveal('.work__subtitle',    { delay: 200 });
sr.reveal('.work-item',         { interval: 150, delay: 300 });
sr.reveal('.stats__item',       { interval: 100 });
sr.reveal('.news__title');
sr.reveal('.news__subtitle',    { delay: 200 });
sr.reveal('.news__item',        { interval: 150, delay: 300 });
sr.reveal('.contact__container');
sr.reveal('.contact__text',     { delay: 200 });
sr.reveal('.footer__item',      { interval: 100 });
sr.reveal('.footer__copyright');