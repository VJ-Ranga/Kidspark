/* Content for the KidSpark homepage.
   When this moves to CodeIgniter, each array becomes a database table. */

export const KS_CURRENCY = 'USD';   // TODO(client): confirm USD or LKR

const ICON = {
  toys:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
  books:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 5v14l8-2 8 2V5l-8 2z"/><path d="M12 7v12"/></svg>',
  stem:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 3h8"/></svg>',
  art:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 0 18c1 0 2-1 2-2s-1-2 0-3 3 0 4-1a9 9 0 0 0-6-12z"/><circle cx="8" cy="10" r="1"/><circle cx="12" cy="7" r="1"/></svg>',
  outdoor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="7" r="3"/><path d="M6 21l3-7h6l3 7M9 14v-3M15 14v-3"/></svg>',
  baby:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M9 10h.01M15 10h.01M9 15c1 1 5 1 6 0"/></svg>'
};

export const KS_CATEGORIES = [
  { id: 'toys',    name: 'Toys & Games',     tone: 'mint',   count: 24, icon: ICON.toys,    href: '/shop?cat=toys' },
  { id: 'books',   name: 'Books & Stories',  tone: 'lilac',  count: 18, icon: ICON.books,   href: '/shop?cat=books' },
  { id: 'stem',    name: 'STEM & Learning',  tone: 'peach',  count: 21, icon: ICON.stem,    href: '/shop?cat=stem' },
  { id: 'art',     name: 'Art & Craft',      tone: 'sky',    count: 15, icon: ICON.art,     href: '/shop?cat=art' },
  { id: 'outdoor', name: 'Outdoor & Active', tone: 'blush',  count: 12, icon: ICON.outdoor, href: '/shop?cat=outdoor' },
  { id: 'baby',    name: 'Baby Essentials',  tone: 'butter', count: 19, icon: ICON.baby,    href: '/shop?cat=baby' }
];

/* TODO(client): replace merchant.url values with real affiliate links,
   and prices with current merchant prices. */
export const KS_PRODUCTS = [
  { id:'p1', slug:'wooden-rainbow-stacker', title:'Wooden Rainbow Stacker',
    image:'assets/images/products/p1-rainbow-stacker.jpg', alt:'Wooden rainbow stacking arches in soft colours',
    blurb:'Open-ended play that grows with them from 1 to 5.', price:24.99, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'toys', badge:null, featured:true, deal:false },

  { id:'p2', slug:'board-book-set', title:'First Words Board Book Set',
    image:'assets/images/products/p2-board-books.jpg', alt:'Stack of colourful chunky board books',
    blurb:'Ten chunky books built to survive real toddlers.', price:19.50, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'books', badge:null, featured:true, deal:false },

  { id:'p3', slug:'magnetic-tile-starter', title:'Magnetic Tile Starter Set',
    image:'assets/images/products/p3-magnetic-tiles.jpg', alt:'Translucent coloured magnetic building tiles',
    blurb:'The one toy our testers kept coming back to.', price:39.99, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:true, deal:false },

  { id:'p4', slug:'washable-paint-set', title:'Washable Toddler Paint Set',
    image:'assets/images/products/p4-paint-set.jpg', alt:'Pots of childrens paint with brushes',
    blurb:'Genuinely washable. We checked, on a sofa.', price:14.75, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'art', badge:null, featured:true, deal:false },

  { id:'p5', slug:'toddler-balance-bike', title:'Toddler Balance Bike',
    image:'assets/images/products/p5-balance-bike.jpg', alt:'Small wooden balance bike for toddlers',
    blurb:'Skips stabilisers entirely. Ages 2 to 5.', price:58.00, wasPrice:72.00,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'outdoor', badge:'Best value', featured:false, deal:true },

  { id:'p6', slug:'suction-bowl-set', title:'Silicone Suction Bowl Set',
    image:'assets/images/products/p6-suction-bowls.jpg', alt:'Silicone toddler bowls in pastel colours',
    blurb:'Stays on the table. Mostly.', price:16.20, wasPrice:21.00,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p7', slug:'soft-activity-cube', title:'Soft Cloth Activity Cube',
    image:'assets/images/products/p7-activity-cube.jpg', alt:'Soft fabric baby activity cube',
    blurb:'Quiet, washable, and good for the pram.', price:12.99, wasPrice:17.50,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p8', slug:'alphabet-puzzle-board', title:'Wooden Alphabet Puzzle Board',
    image:'assets/images/products/p8-alphabet-puzzle.jpg', alt:'Wooden alphabet puzzle with coloured letters',
    blurb:'Letters they can hold while they learn them.', price:18.40, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p9', slug:'counting-bears', title:'Counting Bears & Sorting Cups',
    image:'assets/images/products/p9-counting-bears.jpg', alt:'Colourful counting bears with sorting cups',
    blurb:'Sorting, counting, and one very long car journey.', price:22.00, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p10', slug:'first-science-kit', title:'My First Science Lab Kit',
    image:'assets/images/products/p10-science-kit.jpg', alt:'Child doing a simple colour-mixing science experiment',
    blurb:'Six experiments using things you already own.', price:31.90, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false }
];

export const KS_ARTICLES = [
  { slug:'stem-toys-that-build-focus', title:'Play That Actually Builds Focus',
    excerpt:'Not every "educational" toy earns the label. Here is what to look for, and what to skip.',
    image:'assets/images/blog/a1-stem-play.jpg', alt:'Child concentrating on a building toy',
    category:'STEM & Learning', categoryId:'stem', readMinutes:8, featured:true },

  { slug:'ten-minutes-a-day-reading', title:'Ten Minutes a Day: Reading Habits That Stick',
    excerpt:'A small, repeatable routine beats an ambitious one you abandon by Thursday.',
    image:'assets/images/blog/a2-reading.jpg', alt:'Parent reading a picture book with a child',
    category:'Books & Stories', categoryId:'books', readMinutes:6, featured:false },

  { slug:'rainy-afternoon-rescue', title:'Rainy Afternoon Rescue: 12 Indoor Activities',
    excerpt:'Twelve things to do with what is already in your kitchen drawer.',
    image:'assets/images/blog/a3-indoor-craft.jpg', alt:'Child making a craft project indoors',
    category:'Art & Craft', categoryId:'art', readMinutes:5, featured:false },

  { slug:'sleep-snacks-and-sanity', title:'Sleep, Snacks and Sanity',
    excerpt:'A toddler routine built for real days, not the ones in the parenting books.',
    image:'assets/images/blog/a4-routine.jpg', alt:'Toddler eating calmly at a small table',
    category:'Baby Essentials', categoryId:'baby', readMinutes:7, featured:false }
];

/* TODO(client): PLACEHOLDER testimonials — written copy, not real customers.
   These MUST be replaced with genuine, permissioned quotes before the site
   goes live. Publishing invented testimonials is a real legal and trust risk. */
export const KS_TESTIMONIALS = [
  { name:'Placeholder name', role:'Mum of two, Colombo',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t1.jpg' },
  { name:'Placeholder name', role:'Dad of a 3-year-old',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t2.jpg' },
  { name:'Placeholder name', role:'Mum of three, Kandy',
    quote:'Placeholder testimonial copy awaiting a real, permissioned quote from the client.',
    image:'assets/images/testimonials/t3.jpg' }
];
