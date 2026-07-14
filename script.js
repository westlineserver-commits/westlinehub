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
  { photo: "gallery1.png", title: "Late Night VC",   desc: "Tempat terbaik untuk ngobrol larut malam" },
  { photo: "gallery2.png", title: "Rooftop Vibes",    desc: "Urban lounge, anytime, nongkrong" },
  { photo: "gallery3.png", title: "Music Session",    desc: "Playlist curated, chill sepanjang malam" },
  { photo: "gallery4.png", title: "Community Night",  desc: "Mabar, ngobrol, connect" },
  { photo: "gallery5.png", title: "Chill Together",   desc: "Suasana santai, obrolan yang gak ada habisnya" },
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
  try {
    const res = await fetch(
      'https://discord.com/api/guilds/1499129465291407483/widget.json'
    );

    if (!res.ok) throw new Error('Widget not enabled');

    const data = await res.json();

    const members = document.getElementById('stat-members');
    const online  = document.getElementById('stat-online');

    if (members) members.textContent = data.member_count ?? '—';
    if (online)  online.textContent  = data.presence_count ?? '—';

  } catch (err) {
    console.warn('Discord widget tidak aktif:', err.message);

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
  guardian: { bg: 'rgba(30,60,100,0.2)',   color: '#6090d0', border: 'rgba(30,60,100,0.35)' },
  eo:       { bg: 'rgba(140,110,20,0.2)',  color: '#d4a843', border: 'rgba(140,110,20,0.35)' },
  creative: { bg: 'rgba(20,110,105,0.2)',  color: '#45b8b0', border: 'rgba(20,110,105,0.35)' },
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
  const style     = roleStyles[roleType] || roleStyles.guardian;

  // Banner
  document.getElementById('modal-banner').style.background = `linear-gradient(${color})`;

  // Avatar — foto atau inisial
  const avatarEl = document.getElementById('modal-avatar');
  if (photo) {
    avatarEl.innerHTML = `<img src="${photo}" alt="${name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
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

// Inti cards (Founder, Council, Mod)
document.querySelectorAll('.inti-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => openModal(card));
});

// Guardian carousel cards — event delegation
document.addEventListener('click', (e) => {
  const card = e.target.closest('.guardian-card');
  if (card) openModal(card);
});

modalClose.addEventListener('click', () => modal.classList.remove('active'));
modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

// ─── TAMPILKAN FOTO DI INTI CARD ───
document.querySelectorAll('.inti-card').forEach(card => {
  const photo = card.dataset.photo;
  const avatarEl = card.querySelector('.inti-avatar');
  if (photo && avatarEl) {
    avatarEl.innerHTML = `<img src="${photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    avatarEl.style.background = 'transparent';
    avatarEl.style.padding = '0';
  }
});

// ─── STAFF ROLES CAROUSEL — data-driven (tinggal tambah objek baru di array
//     ini untuk menambah staff baru: Moderator, Event Organizer, Creative Team, dll) ───
// roleType yang sudah ada style-nya: "mod", "eo", "creative", "guardian"
const staffRolesData = [
  { name: "Lyn",       username: "@lyn_lyn_0",             discordId: "1248581171936362557",  role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "lilin.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Sheana",   username: "@kyoceans",            discordId: "758841242934050869",  role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "sonya.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Dio",    username: "@rrdio",            discordId: "1384736078816219168", role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "dio.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Lea",         username: "@fllowwiiee2",          discordId: "1303390731427250199", role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "lea.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "Cel",         username: "@blushberrie",         discordId: "1375838007076061376", role: "Moderator", roleType: "mod", bio: "Server moderation & safety", photo: "cel.png", color: "135deg, #1a1a2a, #2a2a4a" },

  { name: "Xionaa",       username: "@l1lacwh1spers",  discordId: "1237957923301490788", role: "Event Organizer", roleType: "eo",       bio: "Mengatur event & acara Westline",     photo: "xiona.png", color: "135deg, #1a1a2a, #2a2a4a" },
  { name: "mercyjane",       username: "@porscheyy",  discordId: "1358065149193486508", role: "Event Organizer", roleType: "eo",       bio: "Mengatur event & acara Westline",     photo: "mj.png", color: "135deg, #1a1a2a, #2a2a4a" },
   { name: "Xjuaa",       username: "@riffletoe",  discordId: "1455933567057268869", role: "Event Organizer", roleType: "eo",       bio: "Mengatur event & acara Westline",     photo: "jua.png", color: "135deg, #1a1a2a, #2a2a4a" },
  // Contoh cara nambah Event Organizer / Creative Team — tinggal isi data asli lalu hapus baris "// " di depan:
  // { name: "Nama EO",       username: "@username",  discordId: "1234567890", role: "Event Organizer", roleType: "eo",       bio: "Mengatur event & acara Westline",     photo: "namafile.png", color: "135deg, #1a1a2a, #2a2a4a" },
  // { name: "Nama Creative", username: "@username",  discordId: "1234567890", role: "Creative Team",   roleType: "creative", bio: "Desain, konten, dan visual Westline", photo: "namafile.png", color: "135deg, #1a1a2a, #2a2a4a" },
];

function renderStaffRoles() {
  const track = document.getElementById('guardian-track');
  if (!track) return;

  const cardHTML = (item, hidden) => `
    <div class="guardian-card"${hidden ? ' aria-hidden="true"' : ''}
         data-name="${item.name}" data-username="${item.username}"
         data-discord-id="${item.discordId}" data-role="${item.role}"
         data-role-type="${item.roleType}" data-bio="${item.bio}"
         data-color="${item.color}" data-photo="${item.photo}">
      <img src="${item.photo}" alt="${hidden ? '' : item.name}" class="guardian-card-photo" loading="lazy">
      <div class="guardian-card-overlay"></div>
      <div class="guardian-card-info">
        <span class="showcase-role ${item.roleType}">${item.role}</span>
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

// ─── ELECTRIC BORDER ───
function createElectricBorder(card, borderColor = '#c9626e') {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: absolute;
    top: 0; left: 0;
    pointer-events: none;
    z-index: 10;
  `;
  card.style.position = 'relative';
  card.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let time = 0, last = 0;
  const chaos = 0.045, speed = 0.45, displacement = 3, borderOffset = 0;

  function noise2D(x, y) {
    const i = Math.floor(x), j = Math.floor(y);
    const fx = x - i, fy = y - j;
    const r = v => (Math.sin(v * 12.9898) * 43758.5453) % 1;
    const a = r(i+j*57), b = r(i+1+j*57), c = r(i+(j+1)*57), d = r(i+1+(j+1)*57);
    const ux = fx*fx*(3-2*fx), uy = fy*fy*(3-2*fy);
    return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
  }

  function octNoise(x, t, seed) {
    let y = 0, amp = chaos, freq = 10;
    for (let i = 0; i < 6; i++) {
      y += amp * noise2D(freq*x + seed*100, t*freq*0.3);
      freq *= 1.6; amp *= 0.7;
    }
    return y;
  }

  function resize() {
    const rect = card.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    if (w === 0 || h === 0) return { w: 200, h: 280 };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { w, h };
  }

  let size = { w: 200, h: 280 };
  setTimeout(() => { size = resize(); }, 100);

  function getPoint(t, left, top, w, h, r) {
    const sw = w-2*r, sh = h-2*r, ca = Math.PI*r/2;
    const perim = 2*sw + 2*sh + 4*ca;
    let d = t * perim, acc = 0;
    const corner = (cx, cy, start, arc, p) => ({
      x: cx + r * Math.cos(start + p*arc),
      y: cy + r * Math.sin(start + p*arc)
    });
    if (d <= acc+sw) { const p=(d-acc)/sw; return {x:left+r+p*sw, y:top}; } acc+=sw;
    if (d <= acc+ca) { return corner(left+w-r, top+r, -Math.PI/2, Math.PI/2, (d-acc)/ca); } acc+=ca;
    if (d <= acc+sh) { const p=(d-acc)/sh; return {x:left+w, y:top+r+p*sh}; } acc+=sh;
    if (d <= acc+ca) { return corner(left+w-r, top+h-r, 0, Math.PI/2, (d-acc)/ca); } acc+=ca;
    if (d <= acc+sw) { const p=(d-acc)/sw; return {x:left+w-r-p*sw, y:top+h}; } acc+=sw;
    if (d <= acc+ca) { return corner(left+r, top+h-r, Math.PI/2, Math.PI/2, (d-acc)/ca); } acc+=ca;
    if (d <= acc+sh) { const p=(d-acc)/sh; return {x:left, y:top+h-r-p*sh}; } acc+=sh;
    return corner(left+r, top+r, Math.PI, Math.PI/2, (d-acc)/ca);
  }

  function draw(now) {
    const delta = (now - last) / 1000;
    time += delta * speed;
    last = now;

    const { w, h } = size;
    if (w === 0) { requestAnimationFrame(draw); return; }

    ctx.clearRect(0, 0, w, h);

    const left = borderOffset, top = borderOffset;
    const bw = w - borderOffset*2, bh = h - borderOffset*2;
    const radius = 8;
    const samples = Math.floor((2*(bw+bh)) / 2);

    [
      { alpha: 0.12, lw: 8,   blur: 20 },
      { alpha: 0.35, lw: 3,   blur: 10 },
      { alpha: 0.7,  lw: 1.5, blur: 4  },
      { alpha: 1,    lw: 0.8, blur: 1  },
    ].forEach(({ alpha, lw, blur }) => {
      ctx.save();
      ctx.shadowBlur = blur * 3;
      ctx.shadowColor = borderColor;
      ctx.strokeStyle = borderColor;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = lw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= samples; i++) {
        const p = i / samples;
        const pt = getPoint(p, left, top, bw, bh, radius);
        const dx = pt.x + octNoise(p*8, time, 0) * displacement;
        const dy = pt.y + octNoise(p*8, time, 1) * displacement;
        i === 0 ? ctx.moveTo(dx, dy) : ctx.lineTo(dx, dy);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  new ResizeObserver(() => { size = resize(); }).observe(card);
  requestAnimationFrame(draw);
}

// Apply electric border sesuai role
const roleColors = {
  founder:  '#c9626e',
  admin:    '#a080d0',
  mod:      '#60b878',
  guardian: '#6090d0',
};

document.querySelectorAll('.inti-card').forEach(card => {
  const roleType = card.dataset.roleType || 'founder';
  createElectricBorder(card, roleColors[roleType] || '#c9626e');
});

// Mouse glow effect
document.querySelectorAll('.inti-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--y', `${e.clientY - rect.top}px`);
  });
});

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
    name:"aksa.",
    username:"@m.diniiii",
    role:"Admin",
    roleClass:"admin",
    image:"council1.png",
    discordId:"781684790164324384",
    bio:"Core management team."
  },

  {
    name:"Karsen",
    username:"@ciggaretsafterincident",
    role:"Admin",
    roleClass:"admin",
    image:"council2.png",
    discordId:"1311787294319186080",
    bio:"Keeping the community active."
  }
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

const counters=
document.querySelectorAll(
".stat-num"
);

counters.forEach(counter=>{

const target=
+counter.innerText;

let count=0;

const update=()=>{

count+=Math.ceil(
target/50
);

if(count<target){

counter.innerText=count;

requestAnimationFrame(update);

}else{

counter.innerText=target;

}

}

update();

});

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


