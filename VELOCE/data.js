// ════════════════════════════════════════════════════════════════
//  VELOCE MARKET WATCH — Structured Data Layer
//  Hybrid: Wikipedia API images + curated auction data
//  wikiTitle fields enable automatic image hydration via api.js
// ════════════════════════════════════════════════════════════════

const DATA = {

  // ── FULL MODEL PAGES ──
  models: [
    {
      name: "Ferrari 250 GTO",
      slug: "ferrari-250-gto",
      wikiTitle: "Ferrari_250_GTO",
      years: "1962–1964",
      production: "36 examples",
      engine: "Tipo 168/62 Colombo 3.0L V12, ~300 hp",
      country: "Italy",
      bodyStyle: "Berlinetta by Scaglietti",
      designer: "Giotto Bizzarrini / Mauro Forghieri",
      marketCategory: "Blue-Chip Ferrari",
      estimatedRange: "$40M–$52M",
      trend: "stable",
      trendLabel: "Stable · Blue-Chip",
      summary: "The Ferrari 250 GTO is the most valuable and sought-after automobile in history. Designed by Giotto Bizzarrini, Mauro Forghieri, and Sergio Scaglietti under the direction of Enzo Ferrari, it was built to dominate the FIA World GT Championship — and it did, winning three consecutive titles from 1962 to 1964. Only 36 examples were constructed (33 Series I and 3 Series II), making it the rarest and most fiercely guarded trophy in the collector car world.",
      heroImage: null,  // Will be hydrated from Wikipedia API
      galleryImages: [], // Will be hydrated from Wikipedia API
      auctionSales: [
        { year: "2023", chassis: "3765LM", venue: "RM Sotheby's, New York", price: "$51,705,000", note: "World record for any car at auction." },
        { year: "2026", chassis: "3729GT", venue: "Mecum, Kissimmee", price: "$38,500,000", note: "Bianco Speciale. Replacement engine.", link: "gto-bianco-speciale" },
        { year: "2018", chassis: "3413GT", venue: "RM Sotheby's, Monterey", price: "$48,405,000", note: "Held auction record for 5 years." },
        { year: "2014", chassis: "3851GT", venue: "Bonhams, Quail Lodge", price: "$38,115,000", note: "First 250 GTO to cross $35M publicly." },
        { year: "2014", chassis: "5111GT", venue: "Private Sale", price: "$52,000,000 (est.)", note: "Unconfirmed. Highest rumored GTO price." }
      ],
      similarModels: [
        { name: "Ferrari 250 LM", value: "$14M–$18M", production: "32 built", wikiTitle: "Ferrari_250_LM" },
        { name: "Ferrari 250 GT SWB", value: "$7M–$10M", production: "165 built", wikiTitle: "Ferrari_250_GT_SWB" },
        { name: "Ferrari 275 GTB/4", value: "$3M–$4M", production: "330 built", wikiTitle: "Ferrari_275_GTB" },
        { name: "Ferrari 288 GTO", value: "$3.5M–$4.5M", production: "272 built", wikiTitle: "Ferrari_288_GTO" }
      ]
    }
  ],

  // ── MARKET SECTIONS (Home) — wikiTitle enables auto-thumbnail fetching ──
  marketSections: [
    {
      id: "blue-chip-ferrari",
      title: "Blue-Chip Ferrari",
      subtitle: "The cornerstone of the collector market",
      entries: [
        { name: "Ferrari 250 GTO", years: "1962–1964", production: "36 built", value: "$48M–$52M", trend: "stable", trendLabel: "Stable · Blue-Chip", slug: "ferrari-250-gto", wikiTitle: "Ferrari_250_GTO", thumb: null },
        { name: "Ferrari 250 GT SWB", years: "1959–1962", production: "165 built", value: "$7M–$10M", trend: "up", trendLabel: "↑ Appreciating", slug: null, wikiTitle: "Ferrari_250_GT_SWB", thumb: null },
        { name: "Ferrari 275 GTB/4", years: "1966–1968", production: "330 built", value: "$3M–$4M", trend: "up", trendLabel: "↑ Strong Demand", slug: null, wikiTitle: "Ferrari_275_GTB", thumb: null },
        { name: "Ferrari 288 GTO", years: "1984–1987", production: "272 built", value: "$3.5M–$4.5M", trend: "up", trendLabel: "↑ Accelerating", slug: null, wikiTitle: "Ferrari_288_GTO", thumb: null },
        { name: "Ferrari F40", years: "1987–1992", production: "1,315 built", value: "$2.5M–$3.5M", trend: "up", trendLabel: "↑ Strong", slug: null, wikiTitle: "Ferrari_F40", thumb: null },
        { name: "Ferrari 250 LM", years: "1963–1966", production: "32 built", value: "$14M–$18M", trend: "stable", trendLabel: "Stable · Ultra-Rare", slug: null, wikiTitle: "Ferrari_250_LM", thumb: null }
      ]
    },
    {
      id: "air-cooled-porsche",
      title: "Air-Cooled Porsche",
      subtitle: "The engine-behind-the-axle faithful",
      entries: [
        { name: "Porsche 911 Carrera RS 2.7", years: "1973", production: "1,580 built", value: "$1.2M–$1.8M", trend: "up", trendLabel: "↑ Appreciating", slug: null, wikiTitle: "Porsche_911_Carrera_RS", thumb: null },
        { name: "Porsche 356 Speedster", years: "1954–1958", production: "~4,145 built", value: "$400K–$700K", trend: "stable", trendLabel: "Stable · Collector Staple", slug: null, wikiTitle: "Porsche_356", thumb: null },
        { name: "Porsche 911 RSR 3.0", years: "1974", production: "~49 built", value: "$3M–$5M", trend: "up", trendLabel: "↑ Trophy Asset", slug: null, wikiTitle: "Porsche_911_RSR", thumb: null },
        { name: "Porsche 930 Turbo", years: "1975–1989", production: "~21,000 built", value: "$150K–$300K", trend: "up", trendLabel: "↑ Rising Fast", slug: null, wikiTitle: "Porsche_930", thumb: null },
        { name: "Porsche 959", years: "1986–1993", production: "337 built", value: "$1.5M–$2.5M", trend: "up", trendLabel: "↑ Breaking Out", slug: null, wikiTitle: "Porsche_959", thumb: null }
      ]
    },
    {
      id: "british-icons",
      title: "British Icons",
      subtitle: "Grace, pace, and provenance",
      entries: [
        { name: "Jaguar E-Type Series 1", years: "1961–1968", production: "~15,000 built", value: "$250K–$400K", trend: "up", trendLabel: "↑ Steady Growth", slug: null, wikiTitle: "Jaguar_E-Type", thumb: null },
        { name: "Aston Martin DB5", years: "1963–1965", production: "1,023 built", value: "$800K–$1.5M", trend: "stable", trendLabel: "Stable · Cultural Icon", slug: null, wikiTitle: "Aston_Martin_DB5", thumb: null },
        { name: "Aston Martin DB4 GT Zagato", years: "1960–1963", production: "19 built", value: "$10M–$15M", trend: "stable", trendLabel: "Stable · Ultra-Rare", slug: null, wikiTitle: "Aston_Martin_DB4_GT_Zagato", thumb: null },
        { name: "McLaren F1", years: "1992–1998", production: "106 built", value: "$20M–$28M", trend: "up", trendLabel: "↑ Record Territory", slug: null, wikiTitle: "McLaren_F1", thumb: null }
      ]
    },
    {
      id: "analog-supercars",
      title: "Analog Supercars",
      subtitle: "The last era before electronics took over",
      entries: [
        { name: "Lamborghini Miura SV", years: "1966–1973", production: "764 built", value: "$3M–$4M", trend: "up", trendLabel: "↑ Surging", slug: null, wikiTitle: "Lamborghini_Miura", thumb: null },
        { name: "Mercedes-Benz 300SL Gullwing", years: "1954–1957", production: "1,400 built", value: "$1.3M–$2M", trend: "up", trendLabel: "↑ Appreciating", slug: null, wikiTitle: "Mercedes-Benz_300_SL", thumb: null },
        { name: "Lancia Stratos", years: "1973–1978", production: "492 built", value: "$500K–$800K", trend: "up", trendLabel: "↑ Rally Heritage", slug: null, wikiTitle: "Lancia_Stratos", thumb: null },
        { name: "BMW 507", years: "1956–1959", production: "252 built", value: "$2M–$2.8M", trend: "stable", trendLabel: "Stable · Rare Roadster", slug: null, wikiTitle: "BMW_507", thumb: null },
        { name: "De Tomaso Mangusta", years: "1967–1971", production: "401 built", value: "$250K–$450K", trend: "up", trendLabel: "↑ Undervalued", slug: null, wikiTitle: "De_Tomaso_Mangusta", thumb: null }
      ]
    }
  ],

  // ── EXAMPLE SALE: Bianco Speciale ──
  sales: {
    "gto-bianco-speciale": {
      title: "1962 Ferrari 250 GTO",
      subtitle: "Bianco Speciale",
      auctionHouse: "Mecum Auctions",
      event: "Kissimmee 2026",
      saleDate: "January 2026",
      price: "$38,500,000",
      priceNum: 38500000,
      chassis: "3729GT",
      color: "Bianco Speciale (White)",
      buyer: "David S.K. Lee (reported)",
      sourceUrl: "https://www.mecum.com",
      notability: "The only Ferrari 250 GTO finished in Bianco Speciale (white) from the factory — making it one of the most visually distinctive of all 36 examples.",
      historicalContext: "Chassis 3729GT was completed in late 1962 and delivered new in Bianco Speciale over a red leather interior — the only 250 GTO to leave the Maranello factory in white. The car was campaigned in period European GT races before passing through a succession of prominent collectors. Its white finish made it immediately identifiable on the concours circuit and in 250 GTO registries. In 2023, the car was involved in a high-profile incident at the Goodwood Revival, resulting in damage to the original engine. The engine was subsequently replaced with a correct-specification Colombo V12.",
      marketContext: "The $38.5M result reflects several intersecting factors. While the 250 GTO remains the most valuable model in the collector car world, 3729GT's sale price was tempered by the replacement engine — a critical factor for concours judges and originality-focused collectors. Nonetheless, $38.5 million for a car with a non-original engine underscores the near-indestructible demand for the 250 GTO nameplate. The current auction record remains the $51.7M achieved by chassis 3765LM at RM Sotheby's New York in November 2023.",
      whyCollectorsCare: [
        "One of only 36 Ferrari 250 GTOs ever built — the most celebrated automobile in history.",
        "The sole example finished in Bianco Speciale from the factory, making it visually unique.",
        "Three consecutive FIA World GT Championship titles (1962–1964) cemented the model's racing legend.",
        "250 GTO ownership is an invitation-only circle; buying one is as much about social access as capital.",
        "Even with a replacement engine, the 250 GTO's value floor is effectively $35M+ in any condition."
      ],
      riskFactors: [
        "Original Tipo 168/62 engine was replaced after 2023 Goodwood Revival incident — reduces originality score significantly.",
        "Non-matching engine is a major deduction for concours eligibility and purist collectors.",
        "Highly illiquid asset; resale depends on finding the next ultra-high-net-worth buyer.",
        "Insurance, storage, and security costs can exceed $200,000 annually.",
        "Public awareness of the Goodwood damage may create lasting narrative risk for this chassis."
      ],
      comparableSales: [
        { car: "1962 Ferrari 250 GTO (3765LM)", venue: "RM Sotheby's, New York 2023", price: "$51,705,000", note: "Matching numbers. Current world record." },
        { car: "1962 Ferrari 250 GTO (3413GT)", venue: "RM Sotheby's, Monterey 2018", price: "$48,405,000", note: "Matching numbers. Clean provenance." },
        { car: "1963 Ferrari 250 GTO (3851GT)", venue: "Bonhams, Quail Lodge 2014", price: "$38,115,000", note: "Matching numbers." },
        { car: "1963 Ferrari 250 LM (6045)", venue: "RM Sotheby's, Monterey 2015", price: "$17,600,000", note: "Different model but adjacent market." }
      ],
      images: []  // Will be hydrated from Wikipedia API for the GTO article
    }
  },

  // ── Data accessors (designed for future API replacement) ──
  getModel(slug) { return this.models.find(m => m.slug === slug) || null; },
  getSale(slug) { return this.sales[slug] || null; },
  getAllEntries() { return this.marketSections.flatMap(s => s.entries); }
};
