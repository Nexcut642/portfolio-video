/* ═══════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════ */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger.addEventListener('click', () => {
  const links = document.querySelector('.nav__links');
  const cta = document.querySelector('.nav__cta');
  if (!links) return;
  const isOpen = links.style.display === 'flex';
  links.style.cssText = isOpen ? '' : 'display:flex;flex-direction:column;position:fixed;top:70px;left:0;right:0;background:rgba(10,10,15,0.97);padding:30px;gap:24px;border-bottom:1px solid #1E1E2A;backdrop-filter:blur(12px);';
  if (cta) cta.style.display = isOpen ? '' : 'none';
});

/* ═══════════════════════════════════════
   LIQUID GLASS (Physics and centered alignment)
═══════════════════════════════════════ */
const blobMain = document.querySelector('.blob-main');
const blobSub = document.querySelector('.blob-sub');
let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let mainBlobPos = { x: mouse.x, y: mouse.y };
let subBlobPos = { x: mouse.x, y: mouse.y };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function lerp(start, end, ease) { return start + (end - start) * ease; }

function updateLiquids() {
  mainBlobPos.x = lerp(mainBlobPos.x, mouse.x, 0.08);
  mainBlobPos.y = lerp(mainBlobPos.y, mouse.y, 0.08);
  subBlobPos.x = lerp(subBlobPos.x, mainBlobPos.x, 0.06);
  subBlobPos.y = lerp(subBlobPos.y, mainBlobPos.y, 0.06);
  
  // Bug fix: Added half-size offsets (-60px and -42px) to perfectly center the blobs under the pointer
  if (blobMain) blobMain.style.transform = `translate3d(${mainBlobPos.x - 60}px, ${mainBlobPos.y - 60}px, 0)`;
  if (blobSub) blobSub.style.transform = `translate3d(${subBlobPos.x - 42}px, ${subBlobPos.y - 42}px, 0)`;
  requestAnimationFrame(updateLiquids);
}
requestAnimationFrame(updateLiquids);

/* ═══════════════════════════════════════
   LIGHTBOX PLAYER SYSTEM
═══════════════════════════════════════ */
const lightbox = document.getElementById('videoLightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.getElementById('lightboxClose');
const openTriggers = document.querySelectorAll('.open-lightbox');

openTriggers.forEach(trigger => {
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const videoSrc = trigger.getAttribute('data-video');
    if (videoSrc && lightbox && lightboxVideo) {
      lightboxVideo.src = videoSrc;
      lightbox.classList.add('active');
      lightboxVideo.play().catch(err => console.log("Autoplay context note:", err));
    }
  });
});

const closeLightbox = () => {
  if (lightbox && lightboxVideo) {
    lightbox.classList.remove('active');
    lightboxVideo.pause();
    lightboxVideo.src = "";
  }
};

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

/* ═══════════════════════════════════════
   PROJECTS ENGINE (FILTERS)
═══════════════════════════════════════ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.projet-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filterValue = btn.getAttribute('data-filter');
    
    projectCards.forEach(card => {
      if (filterValue === 'all' || card.getAttribute('data-cat') === filterValue) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ═══════════════════════════════════════
   STATS COUNTER ANIMATION
═══════════════════════════════════════ */
const statsGrid = document.querySelector('.stats__grid');
const statNumbers = document.querySelectorAll('.stat__number');
let animated = false;

const startCounters = () => {
  statNumbers.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'), 10);
    let count = 0;
    const speed = target / 60;
    
    const update = () => {
      count += speed;
      if (count >= target) {
        stat.textContent = target + (target === 100 ? '%' : '');
      } else {
        stat.textContent = Math.floor(count) + (target === 100 ? '%' : '');
        requestAnimationFrame(update);
      }
    };
    update();
  });
};

if (statsGrid) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      startCounters();
    }
  }, { threshold: 0.5 });
  observer.observe(statsGrid);
}