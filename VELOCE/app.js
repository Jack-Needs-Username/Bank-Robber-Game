// ════════════════════════════════════════════════════════════════
//  VELOCE MARKET WATCH — App Logic + Wikipedia API Integration
// ════════════════════════════════════════════════════════════════

// ── Sanitize HTML from Wikipedia captions ──
function sanitize(str) {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').replace(/"/g, '&quot;').replace(/'/g, '&#39;').substring(0, 200);
}

// ── Image Helpers ──
function pickHero(heroImg, gallery) {
  if (heroImg && heroImg.url && heroImg.orientation === 'landscape') return heroImg;
  if (heroImg && heroImg.url) return heroImg;
  if (gallery && gallery.length) {
    const landscape = gallery.find(i => i.orientation === 'landscape');
    if (landscape) return landscape;
    return gallery[0];
  }
  return null;
}

// ── Router ──
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page).classList.add('active');
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const link = document.querySelector(`.nav-links a[data-page="${page}"]`);
  if (link) link.classList.add('active');
  window.scrollTo(0, 0);
}

// ═══ HOME PAGE ═══
function renderHome() {
  const el = document.getElementById('marketSections');
  el.innerHTML = DATA.marketSections.map(section => `
    <div class="market-section" data-section="${section.id}">
      <div class="section-head container">
        <h3>${section.title}</h3>
        <span class="sub">${section.subtitle}</span>
      </div>
      <div class="container">
        <table class="model-table">
          <thead><tr>
            <th style="width:40%">Model</th><th>Production</th><th>Est. Value</th><th>Trend</th><th style="text-align:right"></th>
          </tr></thead>
          <tbody>${section.entries.map(e => renderMarketRow(e)).join('')}</tbody>
        </table>
      </div>
    </div>
  `).join('');
}

function renderMarketRow(entry) {
  const trendCls = entry.trend === 'up' ? 'up' : entry.trend === 'down' ? 'down' : 'stable';
  const hasPage = entry.slug === 'ferrari-250-gto';
  const rowClick = hasPage ? `onclick="navigate('modelPage')"` : '';
  const rowClass = hasPage ? 'clickable' : '';
  const thumbId = `thumb-${(entry.wikiTitle || entry.name).replace(/\W/g, '')}`;
  const thumbHTML = entry.thumb && entry.thumb.url
    ? `<img class="model-thumb" id="${thumbId}" src="${entry.thumb.url}" alt="${sanitize(entry.name)}" loading="lazy"
        onerror="this.style.display='none'">`
    : `<div class="thumb-placeholder" id="${thumbId}">…</div>`;
  const btnHTML = hasPage
    ? `<button class="btn-view" onclick="event.stopPropagation();navigate('modelPage')">View Model →</button>`
    : `<button class="btn-view disabled">Coming Soon</button>`;

  return `
    <tr class="${rowClass}" ${rowClick}>
      <td><div class="model-cell">${thumbHTML}<div class="model-name-col"><div class="name">${entry.name}</div><div class="year">${entry.years}</div></div></div></td>
      <td class="td-production">${entry.production}</td>
      <td class="td-value">${entry.value}</td>
      <td><span class="trend-badge ${trendCls}">${entry.trendLabel}</span></td>
      <td>${btnHTML}</td>
    </tr>`;
}

// ═══ MODEL PAGE ═══
function renderModelPage() {
  const m = DATA.getModel('ferrari-250-gto');
  if (!m) return;
  const el = document.getElementById('modelContent');

  const hero = pickHero(m.heroImage, m.galleryImages);
  let heroImgHTML, heroCap;

  if (hero && hero.url) {
    heroImgHTML = `<img class="model-hero-img" src="${hero.url}" alt="${sanitize(hero.alt)}"
      onerror="this.className='model-hero-placeholder';this.outerHTML='<div class=model-hero-placeholder>Image unavailable</div>'">`;
    heroCap = `<div class="hero-caption">${sanitize(hero.caption)} — ${hero.source || ''}</div>`;
  } else {
    heroImgHTML = `<div class="model-hero-placeholder">Loading images from Wikipedia…</div>`;
    heroCap = '';
  }

  // Gallery strip — only show images we actually have
  const galleryImgs = (m.galleryImages || []).filter(img => img && img.url);
  const stripSlots = Math.max(3, galleryImgs.length);
  const galleryHTML = Array.from({length: 3}, (_, i) => {
    const img = galleryImgs[i];
    if (img) {
      return `<div class="image-strip-item">
        <img src="${img.url}" alt="${sanitize(img.alt)}" loading="lazy"
          onerror="this.parentElement.innerHTML='<div style=display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-3)>Image unavailable</div>'">
        <div class="img-caption">${sanitize(img.caption)}<span class="img-source">${img.source || ''}</span></div>
      </div>`;
    }
    return `<div class="image-strip-placeholder"><span>Image pending</span></div>`;
  }).join('');

  const facts = [
    ['Produced', m.years], ['Production', m.production], ['Engine', m.engine],
    ['Body Style', m.bodyStyle], ['Designer', m.designer],
    ['Country', m.country], ['Market Status', m.estimatedRange]
  ];
  const factsHTML = facts.map(([l,v]) => `<div class="key-fact"><div class="label">${l}</div><div class="val">${v}</div></div>`).join('');

  const auctionRows = m.auctionSales.map(a => {
    const hasLink = !!a.link;
    const click = hasLink ? `onclick="navigate('salePage')"` : '';
    const linkIcon = hasLink ? `<span class="link-indicator">→</span>` : '';
    return `<tr class="${hasLink ? 'has-link' : ''}" ${click}>
      <td class="year-cell">${a.year}</td>
      <td style="font-family:var(--mono);font-size:0.78rem;color:var(--text-2)">${a.chassis}</td>
      <td class="venue-cell">${a.venue}</td>
      <td class="price-cell">${a.price}</td>
      <td class="note-cell">${a.note}${linkIcon}</td>
    </tr>`;
  }).join('');

  const similarHTML = m.similarModels.map(s => `
    <div class="similar-card">
      <div class="name">${s.name}</div>
      <div class="detail">Est. Value: <span>${s.value}</span></div>
      <div class="detail">Production: <span>${s.production}</span></div>
    </div>`).join('');

  el.innerHTML = `
    <div class="model-hero" id="modelHeroContainer">
      ${heroImgHTML}${heroCap}
      <div class="model-hero-overlay">
        <span class="back" onclick="navigate('home')">← Back to Market Watch</span>
        <h2>${m.name}</h2>
        <div class="meta">${m.years} · ${m.production} · ${m.engine.split(',')[0]} · ${m.bodyStyle}</div>
      </div>
    </div>
    <div class="model-body container">
      <p class="model-overview">${m.summary}</p>
      <div class="subsection-title">Gallery</div>
      <div class="image-strip" id="modelGalleryStrip">${galleryHTML}</div>
      <div class="subsection-title">Key Facts</div>
      <div class="key-facts">${factsHTML}</div>
      <div class="subsection-title">Auction History</div>
      <table class="auction-table">
        <thead><tr><th>Year</th><th>Chassis</th><th>Venue</th><th>Price</th><th>Notes</th></tr></thead>
        <tbody>${auctionRows}</tbody>
      </table>
      <div class="subsection-title">Similar Models</div>
      <div class="similar-grid">${similarHTML}</div>
    </div>`;
}

// ═══ SALE PAGE ═══
function renderSalePage() {
  const s = DATA.getSale('gto-bianco-speciale');
  if (!s) return;
  const el = document.getElementById('saleContent');

  // Find images - use landscape for main, others for side
  const images = (s.images || []).filter(i => i && i.url);
  const mainImg = images.find(i => i.orientation === 'landscape') || images[0] || null;
  const sideImages = images.filter(i => i !== mainImg);
  const sideLabels = ['Detail View', 'Interior', 'Auction Moment'];

  let mainHTML;
  if (mainImg) {
    mainHTML = `<div class="sale-gallery-main">
      <img src="${mainImg.url}" alt="${sanitize(mainImg.alt)}" loading="lazy"
        onerror="this.style.display='none';this.nextElementSibling.style.paddingTop='80px'">
      <div class="img-caption">${sanitize(mainImg.caption)}<span class="img-source">${mainImg.source || ''}</span></div>
    </div>`;
  } else {
    mainHTML = `<div class="sale-gallery-main" style="display:flex;align-items:center;justify-content:center;color:var(--text-3);flex-direction:column;gap:8px">
      <span style="font-size:0.7rem;text-transform:uppercase;letter-spacing:1px">Hero Image</span>
      <span style="font-size:0.55rem">Image Pending</span>
    </div>`;
  }

  const sideHTML = sideLabels.map((label, i) => {
    const img = sideImages[i];
    if (img) {
      return `<div class="sale-gallery-slot">
        <img src="${img.url}" alt="${sanitize(img.alt)}" loading="lazy"
          onerror="this.style.display='none'">
      </div>`;
    }
    return `<div class="sale-gallery-slot"><span class="slot-label">${label}</span><span>Image Pending</span></div>`;
  }).join('');

  el.innerHTML = `
    <div class="sale-hero container">
      <span class="back" onclick="navigate('modelPage')">← Back to Ferrari 250 GTO</span>
      <h2>${s.title}</h2>
      <div class="subtitle">${s.subtitle}</div>
      <div class="sale-topline">
        <div class="sale-price">${s.price}</div>
        <div class="sale-topline-detail">
          <strong>${s.auctionHouse}</strong> · ${s.event} · ${s.saleDate}<br>
          Chassis <strong>${s.chassis}</strong> · Finish: <strong>${s.color}</strong><br>
          Buyer: <strong>${s.buyer}</strong>
        </div>
      </div>
    </div>
    <div class="sale-body container">
      <div class="sale-image-gallery" id="saleGallery">${mainHTML}<div class="sale-gallery-side">${sideHTML}</div></div>
      <div class="sale-section"><div class="sale-section-title">Notability</div><p class="sale-text">${s.notability}</p></div>
      <div class="sale-section"><div class="sale-section-title">Historical Context &amp; Provenance</div><p class="sale-text">${s.historicalContext}</p></div>
      <div class="sale-section"><div class="sale-section-title">Market Context</div><p class="sale-text">${s.marketContext}</p></div>
      <div class="sale-section"><div class="sale-section-title">Why Collectors Care</div><ul class="sale-list">${s.whyCollectorsCare.map(r=>`<li>${r}</li>`).join('')}</ul></div>
      <div class="sale-section"><div class="sale-section-title">Risk Factors</div><ul class="sale-list risk">${s.riskFactors.map(r=>`<li>${r}</li>`).join('')}</ul></div>
      <div class="sale-section"><div class="sale-section-title">Comparable Sales</div>
        <table class="comp-table">
          <thead><tr><th>Vehicle</th><th>Venue</th><th>Price</th><th>Notes</th></tr></thead>
          <tbody>${s.comparableSales.map(c=>`<tr><td>${c.car}</td><td>${c.venue}</td><td class="price-cell">${c.price}</td><td style="color:var(--text-2);font-size:0.78rem">${c.note}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>`;
}

// ═══ SEARCH ═══
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.market-section').forEach(section => {
      const rows = section.querySelectorAll('tbody tr');
      let anyVisible = false;
      rows.forEach(row => {
        const match = !q || row.textContent.toLowerCase().includes(q);
        row.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      section.style.display = anyVisible ? '' : 'none';
    });
  });
}

// ═══ WIKIPEDIA API HYDRATION ═══
async function hydrateAllImages() {
  console.log('⏳ Veloce: Starting image hydration from Wikipedia API...');

  // 1. Hydrate thumbnails for all market rows in parallel
  const allEntries = DATA.getAllEntries();
  const thumbPromises = allEntries.map(async (entry) => {
    await WikiAPI.hydrateThumb(entry);
    const id = `thumb-${(entry.wikiTitle || entry.name).replace(/\W/g, '')}`;
    const el = document.getElementById(id);
    if (el && entry.thumb && entry.thumb.url) {
      const img = document.createElement('img');
      img.className = 'model-thumb';
      img.src = entry.thumb.url;
      img.alt = entry.name;
      img.loading = 'lazy';
      img.onerror = function() { this.style.display = 'none'; };
      el.replaceWith(img);
    }
  });
  await Promise.all(thumbPromises);
  console.log('✓ Veloce: All thumbnails hydrated');

  // 2. Hydrate GTO model page
  const gto = DATA.getModel('ferrari-250-gto');
  if (gto) {
    await WikiAPI.hydrateModel(gto);
    renderModelPage();
    console.log('✓ Veloce: GTO model page hydrated — hero:', !!gto.heroImage?.url, 'gallery:', gto.galleryImages.length);
  }

  // 3. Hydrate sale page from GTO gallery
  const sale = DATA.getSale('gto-bianco-speciale');
  if (sale && gto && gto.galleryImages.length > 0) {
    // Only populate if sale has no images yet
    if (!sale.images || sale.images.length === 0) {
      sale.images = gto.galleryImages.slice(0, 4).map(img => ({...img}));
    }
    renderSalePage();
    console.log('✓ Veloce: Sale page hydrated with', sale.images.length, 'images');
  }

  console.log('✓ Veloce: All images hydrated from Wikipedia API');
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  renderHome();
  renderModelPage();
  renderSalePage();
  initSearch();
  navigate('home');
  document.querySelector('.nav-brand').addEventListener('click', () => navigate('home'));

  // Hydrate images from Wikipedia (non-blocking)
  hydrateAllImages().catch(err => {
    console.warn('Veloce: Image hydration error:', err);
  });
});
