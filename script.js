// ─── MOBILE HAMBURGER MENU ───
const hamburger = document.getElementById('nav-hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Tutup kalau klik di luar menu
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      closeMobileMenu();
    }
  });

  // Tutup kalau resize ke desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
  });
}

// ─── EXPLORE BUTTON — smooth scroll fallback ───
const exploreBtn = document.getElementById('explore-btn');
if (exploreBtn) {
  exploreBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById('about');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// ─── GALLERY — data-driven (tinggal tambah objek baru di array ini
//     untuk menambah foto galeri baru, lengkap dengan judul & deskripsi) ───
const galleryData = [
  { photo: "gallery1.webp", title: "Late Night VC",   desc: "Tempat terbaik untuk ngobrol larut malam" },
  { photo: "gallery2.webp", title: "Rooftop Vibes",    desc: "Urban lounge, anytime, nongkrong" },
  { photo: "gallery3.webp", title: "Music Session",    desc: "Playlist curated, chill sepanjang malam" },
  { photo: "gallery4.webp", title: "Community Night",  desc: "Mabar, ngobrol, connect" },
  { photo: "gallery5.webp", title: "Chill Together",   desc: "Suasana santai, obrolan yang gak ada habisnya" },
];

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = galleryData.map(item => `
    <div class="gallery-item">
      <div class="gallery-bg">
        <img src="${item.photo}" alt="${item.title}" class="gallery-photo" loading="lazy">
        <div class="gallery-city-lights"></div>
      </div>
      <div class="gallery-caption">
        <span>${item.title}</span>
        <p>${item.desc}</p>
      </div>
    </div>
  `).join('');
}

renderGallery();

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll(
  '.feature-card, .pillar, .lb-card, .gallery-item'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.6s ease ${(i % 6) * 0.08}s, transform 0.6s ease ${(i % 6) * 0.08}s`;
  revealObserver.observe(el);
});

// ─── SECTION LABEL ANIMATE ───
document.querySelectorAll('.section-label, .staff-kicker').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateX(-12px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateX(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

// ─── DISCORD WIDGET STATS ───
async function fetchDiscordStats() {
  const members = document.getElementById('stat-members');
  const online  = document.getElementById('stat-online');
  try {
    // Invite API: memberi total member & online (widget.json tidak punya member_count)
    const res = await fetch('https://discord.com/api/v10/invites/westline?with_counts=true');
    if (!res.ok) throw new Error('Invite API error ' + res.status);
    const d = await res.json();
    if (members) members.textContent = d.approximate_member_count ?? '—';
    if (online)  online.textContent  = d.approximate_presence_count ?? '—';
  } catch (err) {
    console.warn('Gagal ambil statistik Discord:', err.message);
  }
}

fetchDiscordStats();


// ─── NAVBAR SCROLL EFFECT ───
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(13, 13, 13, 0.98)';
    navbar.style.borderBottomColor = 'rgba(237, 237, 237, 0.1)';
  } else {
    navbar.style.background = 'rgba(13, 13, 13, 0.95)';
    navbar.style.borderBottomColor = 'rgba(237, 237, 237, 0.07)';
  }
});

// (explore button handled above via #explore-btn)

// ─── STAFF MODAL ───
const modal = document.getElementById('staff-modal');
const modalClose = document.getElementById('modal-close');

const roleStyles = {
  founder:  { bg: 'rgba(122,28,36,0.25)',  color: '#c9626e', border: 'rgba(122,28,36,0.4)' },
  admin:    { bg: 'rgba(80,40,120,0.2)',   color: '#a080d0', border: 'rgba(80,40,120,0.35)' },
  mod:      { bg: 'rgba(30,90,50,0.2)',    color: '#60b878', border: 'rgba(30,90,50,0.35)' },
  Security: { bg: 'rgba(30,60,100,0.2)',   color: '#6090d0', border: 'rgba(30,60,100,0.35)' },
  eo:       { bg: 'rgba(140,110,20,0.2)',  color: '#d4a843', border: 'rgba(140,110,20,0.35)' },
  creative: { bg: 'rgba(20,110,105,0.2)',  color: '#45b858', border: 'rgba(20,110,105,0.35)' },
  partner: { bg: 'rgba(20,110,105,0.2)',  color: '#3f00d2', border: 'rgba(20,110,105,0.35)' },
};

function openModal(card) {
  const name      = card.dataset.name;
  const username  = card.dataset.username;
  const discordId = card.dataset.discordId;
  const role      = card.dataset.role;
  const roleType  = card.dataset.roleType;
  const bio       = card.dataset.bio;
  const color     = card.dataset.color;
  const photo     = card.dataset.photo;
  const initial   = name.charAt(0).toUpperCase();
  const style     = roleStyles[roleType] || roleStyles.mod;

  // Banner
  document.getElementById('modal-banner').style.background = `linear-gradient(${color})`;

  // Avatar — foto atau inisial
  const avatarEl = document.getElementById('modal-avatar');
  if (photo) {
    avatarEl.innerHTML = `<img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    avatarEl.style.background = 'transparent';
  } else {
    avatarEl.innerHTML = initial;
    avatarEl.style.background = `linear-gradient(${color})`;
  }

  document.getElementById('modal-name').textContent     = name;
  document.getElementById('modal-username').textContent = username;
  document.getElementById('modal-bio').textContent      = bio;

  const badge = document.getElementById('modal-role-badge');
  badge.textContent      = role;
  badge.style.background = style.bg;
  badge.style.color      = style.color;
  badge.style.border     = `1px solid ${style.border}`;

  document.getElementById('modal-discord').href = `https://discord.com/users/${discordId}`;

  modal.classList.add('active');
}

// Guardian carousel cards — event delegation
document.addEventListener('click', (e) => {
  const card = e.target.closest('.guardian-card');
  if (card) openModal(card);
});

modalClose.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});


// ─── STAFF ROLES CAROUSEL 

const esc = s => String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

const staffRolesData = [
  { name: "Lyn",       username: "@lyn_lyn_0",             discordId: "1248581171936362557",  role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "lilin.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Sheana",   username: "@kyoceans",            discordId: "758841242934050869",  role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "sonya.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Dio",    username: "@rrdio",            discordId: "1384736078816219168", role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "dio.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "san",         username: "@sanmorinyo",          discordId: "1516394190861369456", role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "san.png", color: "135deg, #1a1a2a, #2a2a4a" },
  
//{ name: "mercyjane",       username: "@porscheyy",  discordId: "1358065149193486508", role: "Event Organizer", roleType: "eo",       bio: "Mengatur event & acara Westline",     photo: "mj.png", color: "135deg, #1a1a2a, #2a2a4a" },
  
  { name: "acha", username: "@cha1nee",  discordId: "1226084690486759455", role: "Creative Team",   roleType: "creative", bio: "Desain, konten, dan visual Westline", photo: "aca.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Zhang~", username: "@imfaldhee",  discordId: "324027990726017034", role: "Creative Team",   roleType: "creative", bio: "Desain, konten, dan visual Westline", photo: "zhang.webp", color: "135deg, #1a1a2a, #2a2a4a" },
];

function renderStaffRoles() {
  const track = document.getElementById('guardian-track');
  if (!track) return;

  const cardHTML = (item, hidden) => `
    <div class="guardian-card"${hidden ? ' aria-hidden="true"' : ''}
         data-name="${esc(item.name)}" data-username="${esc(item.username)}"
         data-discord-id="${esc(item.discordId)}" data-role="${esc(item.role)}"
         data-role-type="${esc(item.roleType)}" data-bio="${esc(item.bio)}"
         data-color="${esc(item.color)}" data-photo="${esc(item.photo)}">
      <img src="${esc(item.photo)}" alt="${hidden ? '' : item.name}" class="guardian-card-photo" loading="lazy">
      <div class="guardian-card-overlay"></div>
      <div class="guardian-card-info">
        <span class="showcase-role ${esc(item.roleType)}">${item.role}</span>
        <p class="guardian-card-name">${item.name}</p>
        <p class="guardian-card-user">${item.username}</p>
      </div>
    </div>`;

  // Set A + set B (duplikat, aria-hidden) supaya loop auto-scroll mulus tanpa jeda
  track.innerHTML =
    staffRolesData.map(item => cardHTML(item, false)).join('') +
    staffRolesData.map(item => cardHTML(item, true)).join('');
}

renderStaffRoles();

const staffData = [
  {
    name:"Alza",
    username:"@alza7",
    role:"Founder",
    roleClass:"founder",
    image:"founder1.png",
    discordId:"356080136434483202",
    bio:"Founder of Westline."
  },

  {
    name:"Cathyna",
    username:"@walldorft",
    role:"Founder",
    roleClass:"founder",
    image:"founder2.png",
    discordId:"1424053888788594730",
    bio:"Co-founder of Westline."
  },

  {
    name:"mercyjane",
    username:"@porscheyy",
    role:"Admin",
    roleClass:"admin",
    image:"council1.webp",
    discordId:"1358065149193486508",
    bio:"Core management team."
  },
];

let current = 0;

let cards = Array.from(
  document.querySelectorAll(".showcase-card")
);

const nextBtn =
  document.querySelector(".next");

const prevBtn =
  document.querySelector(".prev");

const showcase =
  document.querySelector(".showcase-stack");

/* UPDATE CARD */

function updateCard(card, data){

  card.querySelector(".showcase-image").src =
    data.image;

  card.querySelector("h3").innerText =
    data.name;

  card.querySelector(".showcase-user").innerText =
    data.username;

  card.querySelector(".showcase-bio").innerText =
    data.bio;

  const role =
    card.querySelector(".showcase-role");

  role.innerText =
    data.role;

  role.className =
    `showcase-role ${data.roleClass}`;

  const btn =
    card.querySelector(".showcase-btn");

  btn.href =
    `https://discord.com/users/${data.discordId}`;
}

/* UPDATE ALL */

function updateCards(){

  // Update counter display — dynamic dari staffData.length
  const slideEl = document.getElementById('currentSlide');
  const totalEl = document.querySelector('.staff-counter span:last-child');
  if (slideEl) slideEl.textContent = String(current + 1).padStart(2, '0');
  if (totalEl) totalEl.textContent = String(staffData.length).padStart(2, '0');

  updateCard(
    cards[0],
    staffData[current]
  );

  updateCard(
    cards[1],
    staffData[
      (current + 1) % staffData.length
    ]
  );

  updateCard(
    cards[2],
    staffData[
      (current + 2) % staffData.length
    ]
  );

}

/* NEXT */

function nextSlide(){

  current++;

  if(current >= staffData.length){
    current = 0;
  }

  cards[0].className =
    "showcase-card third";

  cards[1].className =
    "showcase-card active";

  cards[2].className =
    "showcase-card second";

  cards.push(cards.shift());

  updateCards();
}

/* PREV */

function prevSlide(){

  current--;

  if(current < 0){
    current = staffData.length - 1;
  }

  cards[0].className =
    "showcase-card second";

  cards[1].className =
    "showcase-card third";

  cards[2].className =
    "showcase-card active";

  cards.unshift(cards.pop());

  updateCards();
}

/* BUTTON */

if(nextBtn){
  nextBtn.addEventListener(
    "click",
    nextSlide
  );
}

if(prevBtn){
  prevBtn.addEventListener(
    "click",
    prevSlide
  );
}

/* MOBILE SWIPE */

let startX = 0;

if(showcase){

  showcase.addEventListener(
    "touchstart",
    (e) => {

      startX =
        e.touches[0].clientX;

    }
  );

  showcase.addEventListener(
    "touchend",
    (e) => {

      const endX =
        e.changedTouches[0].clientX;

      const diff =
        startX - endX;

      if(diff > 50){
        nextSlide();
      }

      if(diff < -50){
        prevSlide();
      }

    }
  );

}

/* INIT */

updateCards();

/* updateCards init sudah dipanggil di atas */

window.addEventListener("scroll",()=>{

if(window.scrollY>80){

navbar.classList.add("scrolled");

}else{

navbar.classList.remove("scrolled");

}

});


// ─── GALLERY LIGHTBOX ───
const galleryItems  = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox      = document.getElementById('gallery-lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxCap   = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');

let lightboxIndex = 0;

function openLightbox(index) {
  if (!galleryItems.length) return;
  lightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[lightboxIndex];
  const img  = item.querySelector('.gallery-photo');
  const title = item.querySelector('.gallery-caption span');
  const desc  = item.querySelector('.gallery-caption p');

  lightboxImg.src = img ? img.src : '';
  lightboxImg.alt = img ? img.alt : '';
  lightboxCap.textContent = [title?.textContent, desc?.textContent].filter(Boolean).join(' — ');

  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxPrev)  lightboxPrev.addEventListener('click', () => openLightbox(lightboxIndex - 1));
if (lightboxNext)  lightboxNext.addEventListener('click', () => openLightbox(lightboxIndex + 1));

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (!lightbox || !lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightbox(lightboxIndex - 1);
  if (e.key === 'ArrowRight') openLightbox(lightboxIndex + 1);
});

// ─── SUPPORT REDIRECT CTA ───
document.querySelectorAll('a[href="#support-server"]').forEach((link) => {
  link.addEventListener('click', () => {
    const section = document.getElementById('support-server');
    if (section) {
      setTimeout(() => {
        section.classList.add('support-highlight');
        setTimeout(() => section.classList.remove('support-highlight'), 1400);
      }, 300);
    }
  });
});


