/* Content for the KidSpark homepage.
   When this moves to CodeIgniter, each array becomes a database table. */

export const KS_CURRENCY = 'USD';   // TODO(client): confirm USD or LKR

const ICON = {
  toys:    'assets/icons/blocks.svg',
  books:   'assets/icons/book-open.svg',
  stem:    'assets/icons/flask-conical.svg',
  art:     'assets/icons/palette.svg',
  outdoor: 'assets/icons/bike.svg',
  baby:    'assets/icons/baby.svg'
};

export const KS_CATEGORIES = [
  { id: 'toys',    name: 'Toys & Games',     tone: 'mint',   count: 24, icon: ICON.toys,    href: 'shop.html?cat=toys' },
  { id: 'books',   name: 'Books & Stories',  tone: 'lilac',  count: 18, icon: ICON.books,   href: 'shop.html?cat=books' },
  { id: 'stem',    name: 'STEM & Learning',  tone: 'peach',  count: 21, icon: ICON.stem,    href: 'shop.html?cat=stem' },
  { id: 'art',     name: 'Art & Craft',      tone: 'sky',    count: 15, icon: ICON.art,     href: 'shop.html?cat=art' },
  { id: 'outdoor', name: 'Outdoor & Active', tone: 'blush',  count: 12, icon: ICON.outdoor, href: 'shop.html?cat=outdoor' },
  { id: 'baby',    name: 'Baby Essentials',  tone: 'butter', count: 19, icon: ICON.baby,    href: 'shop.html?cat=baby' }
];

/* TODO(client): replace merchant.url values with real affiliate links,
   and prices with current merchant prices. */
export const KS_PRODUCTS = [
  { id:'p1', age:'6+ months', slug:'wooden-rainbow-stacker', title:'Wooden Rainbow Stacker',
    image:'assets/images/products/p1-rainbow-stacker.jpg', alt:'Wooden rainbow stacking arches in soft colours',
    blurb:'Open-ended play that grows with them from 1 to 5.', price:24.99, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'toys', badge:null, featured:true, deal:false },

  { id:'p2', age:'6+ months', slug:'board-book-set', title:'First Words Board Book Set',
    image:'assets/images/products/p2-board-books.jpg', alt:'Stack of colourful chunky board books',
    blurb:'Ten chunky books built to survive real toddlers.', price:19.50, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'books', badge:null, featured:true, deal:false },

  { id:'p3', age:'3+ years', slug:'magnetic-tile-starter', title:'Magnetic Tile Starter Set',
    image:'assets/images/products/p3-magnetic-tiles.jpg', alt:'Translucent coloured magnetic building tiles',
    blurb:'The one toy our testers kept coming back to.', price:39.99, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:true, deal:false },

  { id:'p4', age:'2+ years', slug:'washable-paint-set', title:'Washable Toddler Paint Set',
    image:'assets/images/products/p4-paint-set.jpg', alt:'Pots of childrens paint with brushes',
    blurb:'Genuinely washable. We checked, on a sofa.', price:14.75, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'art', badge:null, featured:true, deal:false },

  { id:'p5', age:'2-5 years', slug:'toddler-balance-bike', title:'Toddler Balance Bike',
    image:'assets/images/products/p5-balance-bike.jpg', alt:'Small wooden balance bike for toddlers',
    blurb:'Skips stabilisers entirely. Ages 2 to 5.', price:58.00, wasPrice:72.00,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'outdoor', badge:'Best value', featured:false, deal:true },

  { id:'p6', age:'6+ months', slug:'suction-bowl-set', title:'Silicone Suction Bowl Set',
    image:'assets/images/products/p6-suction-bowls.jpg', alt:'Silicone toddler bowls in pastel colours',
    blurb:'Stays on the table. Mostly.', price:16.20, wasPrice:21.00,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p7', age:'3+ months', slug:'soft-activity-cube', title:'Soft Cloth Activity Cube',
    image:'assets/images/products/p7-activity-cube.jpg', alt:'Soft fabric baby activity cube',
    blurb:'Quiet, washable, and good for the pram.', price:12.99, wasPrice:17.50,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'baby', badge:'Best value', featured:false, deal:true },

  { id:'p8', age:'2+ years', slug:'alphabet-puzzle-board', title:'Wooden Alphabet Puzzle Board',
    image:'assets/images/products/p8-alphabet-puzzle.jpg', alt:'Wooden alphabet puzzle with coloured letters',
    blurb:'Letters they can hold while they learn them.', price:18.40, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p9', age:'18+ months', slug:'counting-bears', title:'Counting Bears & Sorting Cups',
    image:'assets/images/products/p9-counting-bears.jpg', alt:'Colourful counting bears with sorting cups',
    blurb:'Sorting, counting, and a lifesaver on car journeys.', price:22.00, wasPrice:null,
    merchant:{ name:'Daraz', url:'https://www.daraz.lk/' }, category:'stem', badge:null, featured:false, deal:false },

  { id:'p10', age:'4+ years', slug:'first-science-kit', title:'My First Science Lab Kit',
    image:'assets/images/products/p10-science-kit.jpg', alt:'Child doing a simple colour-mixing science experiment',
    blurb:'Six experiments using things you already own.', price:31.90, wasPrice:null,
    merchant:{ name:'Amazon', url:'https://www.amazon.com/' }, category:'stem', badge:null, featured:false, deal:false }
];

/* TODO(client): body paragraphs below are placeholder editorial copy written
   to give the detail pages real content to show. Replace with the real
   articles before launch. */
export const KS_ARTICLES = [
  { slug:'stem-toys-that-build-focus', title:'Play That Actually Builds Focus',
    excerpt:'Not every "educational" toy earns the label. Here is what to look for, and what to skip.',
    image:'assets/images/blog/a1-stem-play.jpg', alt:'Child concentrating on a building toy',
    category:'STEM & Learning', categoryId:'stem', readMinutes:8, featured:true,
    body:[
      'Not every toy labelled "educational" earns the label. We spent a term watching which ones held attention past the first afternoon, and which went quietly into the cupboard.',
      'The pattern was consistent: toys with fewer built-in outcomes held attention longer than toys with more of them. A set of blocks can become a tower, a wall, a ramp or a sorting game. A toy that only does one thing, however cleverly, gets solved once and set aside.',
      'Look for open-ended construction pieces, materials that can be combined in more than one way, and anything that survives being used "wrong." A stacking toy used as a drum is still doing its job.',
      'What to skip: anything that narrates its own instructions out loud, anything with a single correct outcome, and anything that needs batteries to be interesting. Batteries usually mean the toy is doing the playing, not the child.'
    ] },

  { slug:'ten-minutes-a-day-reading', title:'Ten Minutes a Day: Reading Habits That Stick',
    excerpt:'A small, repeatable routine beats an ambitious one you abandon by Thursday.',
    image:'assets/images/blog/a2-reading.jpg', alt:'Parent reading a picture book with a child',
    category:'Books & Stories', categoryId:'books', readMinutes:6, featured:false,
    body:[
      'A small, repeatable routine beats an ambitious one you abandon by Thursday. Ten minutes, same time, same chair, most days, does more than an hour once a fortnight.',
      'Pick a time that already exists in the day rather than inventing a new one. After bath and before lights-out works for most households because nothing else is competing for it.',
      'Let your child choose the book, even if it is the same one every night for three weeks. Repetition is how the language sticks, and boredom is a you problem, not a them problem.',
      'If ten minutes feels impossible some nights, five is still the routine. The habit survives on consistency, not duration.'
    ] },

  { slug:'rainy-afternoon-rescue', title:'Rainy Afternoon Rescue: 12 Indoor Activities',
    excerpt:'Twelve things to do with what is already in your kitchen drawer.',
    image:'assets/images/blog/a3-indoor-craft.jpg', alt:'Child making a craft project indoors',
    category:'Art & Craft', categoryId:'art', readMinutes:5, featured:false,
    body:[
      'Twelve things to do with what is already in your kitchen drawer, for the afternoons when going outside is not an option.',
      'Masking tape roads across the living room floor, a laundry basket obstacle course, a "find five blue things" scavenger hunt, sock puppets from the odd-sock pile, a pillow fort with a torch for reading inside it.',
      'Pasta necklaces, a washing-up bowl of water and cups for pouring practice, a cardboard box turned into anything at all, shadow puppets against a lamp, a simple obstacle course of cushions to step over.',
      'None of these need buying anything. The point is not the activity itself, it is having a short list ready before the whining starts.'
    ] },

  { slug:'sleep-snacks-and-sanity', title:'Sleep, Snacks and Sanity',
    excerpt:'A toddler routine built for real days, not the ones in the parenting books.',
    image:'assets/images/blog/a4-routine.jpg', alt:'Toddler eating calmly at a small table',
    category:'Baby Essentials', categoryId:'baby', readMinutes:7, featured:false,
    body:[
      'A toddler routine built for real days, not the ones in the parenting books where nobody is ever late for anything.',
      'The three anchors that actually matter are a consistent wake time, a predictable pattern before naps, and a wind-down before bed that does not depend on a specific location. If the wind-down only works in one room, it stops working the day you are somewhere else.',
      'Snacks on a schedule save more arguments than snacks on demand, not because grazing is wrong, but because a toddler who knows food is coming at a predictable time asks for it less in between.',
      'None of this needs to be rigid. The goal is a shape to the day your child can predict, not a timetable you defend to the minute.'
    ] }
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
