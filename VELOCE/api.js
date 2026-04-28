// ════════════════════════════════════════════════════════════════
//  VELOCE — Wikipedia/Wikimedia Image API Module
//  Fetches real images via the free MediaWiki API
//  Can be replaced with a commercial API later
// ════════════════════════════════════════════════════════════════

const WikiAPI = {

  // Base endpoints (CORS-enabled with origin=*)
  WIKI_API: 'https://en.wikipedia.org/w/api.php',
  COMMONS_API: 'https://commons.wikimedia.org/w/api.php',

  /**
   * Fetch the main page image for a Wikipedia article
   * @param {string} wikiTitle - e.g. "Ferrari_250_GTO"
   * @param {number} size - thumbnail width in px
   * @returns {Promise<{url, alt, caption, source, orientation}>}
   */
  async fetchPageImage(wikiTitle, size = 1200) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        titles: wikiTitle,
        prop: 'pageimages|pageterms',
        format: 'json',
        pithumbsize: size,
        origin: '*'
      });
      const res = await fetch(`${this.WIKI_API}?${params}`);
      const data = await res.json();
      const pages = data.query.pages;
      const page = Object.values(pages)[0];

      if (page && page.thumbnail) {
        return {
          url: page.thumbnail.source,
          alt: page.title,
          caption: page.terms?.description?.[0] || page.title,
          source: 'Wikipedia',
          orientation: page.thumbnail.width > page.thumbnail.height ? 'landscape' : 'portrait'
        };
      }
      return null;
    } catch (err) {
      console.warn(`WikiAPI: Failed to fetch image for "${wikiTitle}"`, err);
      return null;
    }
  },

  /**
   * Fetch gallery images using Commons search (more reliable than article image lists)
   */
  async fetchGalleryImages(wikiTitle, maxImages = 4, thumbSize = 800) {
    try {
      // Strategy: use Commons search for the car name to find real photos
      const searchTerm = wikiTitle.replace(/_/g, ' ');
      const params = new URLSearchParams({
        action: 'query',
        generator: 'search',
        gsrsearch: `${searchTerm} car`,
        gsrnamespace: '6', // File namespace
        gsrlimit: String(maxImages + 4),
        prop: 'imageinfo',
        iiprop: 'url|size|extmetadata',
        iiurlwidth: thumbSize,
        format: 'json',
        origin: '*'
      });
      const res = await fetch(`${this.COMMONS_API}?${params}`);
      const data = await res.json();
      if (!data.query || !data.query.pages) return [];

      const results = Object.values(data.query.pages)
        .filter(p => p.imageinfo && p.imageinfo[0])
        .filter(p => {
          const info = p.imageinfo[0];
          // Only keep actual photos (landscape-ish, decent size, JPEG/PNG)
          const isPhoto = info.width > 400 && info.height > 300;
          const isJpg = /\.(jpg|jpeg|png)$/i.test(p.title);
          const notIcon = !/(logo|icon|flag|symbol|map|diagram|chart|svg)/i.test(p.title);
          return isPhoto && isJpg && notIcon;
        })
        .slice(0, maxImages)
        .map(p => {
          const info = p.imageinfo[0];
          const meta = info.extmetadata || {};
          const desc = meta.ImageDescription?.value?.replace(/<[^>]*>/g, '') || p.title.replace('File:', '');
          return {
            url: info.thumburl || info.url,
            alt: desc.substring(0, 120),
            caption: desc.substring(0, 200),
            source: 'Wikimedia Commons',
            orientation: info.width > info.height ? 'landscape' : 'portrait'
          };
        });

      return results;
    } catch (err) {
      console.warn(`WikiAPI: Gallery search failed for "${wikiTitle}"`, err);
      return [];
    }
  },

  /**
   * Fetch a single image's URL and metadata from Wikimedia Commons
   */
  async fetchCommonsImage(fileName, thumbSize = 800) {
    try {
      const params = new URLSearchParams({
        action: 'query',
        titles: fileName,
        prop: 'imageinfo',
        iiprop: 'url|extmetadata|size',
        iiurlwidth: thumbSize,
        format: 'json',
        origin: '*'
      });
      const res = await fetch(`${this.COMMONS_API}?${params}`);
      const data = await res.json();
      const pages = Object.values(data.query.pages);
      const info = pages[0]?.imageinfo?.[0];

      if (!info) return null;

      const meta = info.extmetadata || {};
      const desc = meta.ImageDescription?.value?.replace(/<[^>]*>/g, '') || fileName.replace('File:', '');

      return {
        url: info.thumburl || info.url,
        alt: desc.substring(0, 120),
        caption: desc.substring(0, 200),
        source: 'Wikimedia Commons',
        orientation: info.width > info.height ? 'landscape' : 'portrait'
      };
    } catch (err) {
      return null;
    }
  },

  /**
   * Fetch a Wikipedia article extract (summary paragraph)
   */
  async fetchSummary(wikiTitle) {
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`,
        { headers: { 'Api-User-Agent': 'VeloceMarketWatch/1.0' } }
      );
      const data = await res.json();
      return {
        summary: data.extract || '',
        image: data.originalimage ? {
          url: data.originalimage.source,
          alt: data.title,
          caption: data.description || data.title,
          source: 'Wikipedia',
          orientation: data.originalimage.width > data.originalimage.height ? 'landscape' : 'portrait'
        } : null
      };
    } catch (err) {
      console.warn(`WikiAPI: Failed to fetch summary for "${wikiTitle}"`, err);
      return { summary: '', image: null };
    }
  },

  /**
   * Hydrate a model object with Wikipedia images
   * Replaces placeholder images with real fetched ones
   */
  async hydrateModel(model) {
    if (!model.wikiTitle) return model;

    // 1. Fetch hero image via MediaWiki pageimages API (most reliable)
    if (!model.heroImage || !model.heroImage.url) {
      const heroImg = await this.fetchPageImage(model.wikiTitle, 1200);
      if (heroImg) {
        model.heroImage = heroImg;
        console.log(`✓ Hero image loaded for ${model.name}: ${heroImg.url.substring(0, 80)}...`);
      }
    }

    // 2. Fallback: try REST summary API for hero
    if (!model.heroImage || !model.heroImage.url) {
      const summaryData = await this.fetchSummary(model.wikiTitle);
      if (summaryData.image) {
        model.heroImage = summaryData.image;
      }
      if (!model.summary && summaryData.summary) {
        model.summary = summaryData.summary;
      }
    }

    // 3. Fetch gallery images from Commons
    if (!model.galleryImages || model.galleryImages.length === 0) {
      model.galleryImages = await this.fetchGalleryImages(model.wikiTitle, 6);
      console.log(`✓ Gallery loaded for ${model.name}: ${model.galleryImages.length} images`);
    }

    return model;
  },

  /**
   * Hydrate a market section entry with a thumbnail
   */
  async hydrateThumb(entry) {
    if (entry.thumb && entry.thumb.url) return entry; // already has image
    if (!entry.wikiTitle) return entry;

    const img = await this.fetchPageImage(entry.wikiTitle, 400);
    if (img) {
      entry.thumb = img;
    }
    return entry;
  }
};
