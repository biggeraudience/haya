// src/pages/MensLandingPage.jsx
import React, { useState } from 'react';
import '../styles/menslandingpage.scss';
import AnnouncementBar from '../components/AnnouncementBar.jsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CategoryDisplaySection from '../components/CategoryDisplaySection.jsx';
import FeedSection from '../components/FeedSection.jsx';
import Navbar from '../components/Navbar.jsx';
import ProductFooter from '../components/ProductFooter.jsx';

// Import hero images for carousel items
import imgClothing from '../assets/images/d6234e07-e00e-438c-9aa2-9ad2c47001f4_removalai_preview.png';
import imgBags from '../assets/images/c71b21b5-3d6d-4433-96ed-fefab5b25cc7_removalai_preview.png';
import imgShoes from '../assets/images/5ccf5bf3-0674-49a8-a4d9-f0d6a7738d25_removalai_preview.png'; // Corrected import based on previous code
import imgPerfumes from '../assets/images/11e10f53-1601-4798-b6eb-120fb3decf5a_removalai_preview.png';
import imgAccessories from '../assets/images/0df32245-9335-4572-857c-b5937711a3b8_removalai_preview.png';
import imgCaps from '../assets/images/c251788e-86a2-4850-a048-6e3176235b6b_removalai_preview.png';
import imgFabrics from '../assets/images/624d07f9-09e0-41ec-a755-e7ebe4529208_removalai_preview.png';

// Import sub-category images
import imgKandoor from '../assets/images/02e76747-f92a-466c-8465-7e58694ef34c_removalai_preview.png';
import imgKaftan from '../assets/images/da233f56-0b70-447d-9713-109ab1ce8638_removalai_preview.png';
import imgAgbada from '../assets/images/baf874f9-bdb5-4433-b027-b17e735c8f26_removalai_preview.png';
import imgLuxury from '../assets/images/888d0df2-df37-4b37-a12d-eb05f11c78d8_removalai_preview.png';
import imgTravel from '../assets/images/de4ff3a6-2a7e-4e7a-8411-558b00162cf6_removalai_preview.png';
import imgFormal from '../assets/images/e4908e22-6cbf-4c31-b4c9-543c38dd20cb_removalai_preview.png';
import imgCasual from '../assets/images/016949d1-a88a-4df9-a1a6-8f9a0ee80426_removalai_preview.png';
import imgOriental from '../assets/images/71d89d79-cf4c-402a-891a-296c5d49078a_removalai_preview.png';
import imgWoody from '../assets/images/2bd44ebb-5b11-411d-896b-f1af087dd194_removalai_preview.png';
import imgCufflinks from '../assets/images/aa620d38-3ec4-4660-a98e-93a0b41c3387_removalai_preview.png';
import imgWatches from '../assets/images/3ebb9060-3f21-45c3-960f-c0286bccdc54_removalai_preview.png';
import imgTraditional from '../assets/images/3ebb9060-3f21-45c3-960f-c0286bccdc54_removalai_preview.png';
import imgModern from '../assets/images/3ebb9060-3f21-45c3-960f-c0286bccdc54_removalai_preview.png';
import imgPlain from '../assets/images/27399cpurewoolzegna_800x.jpg';
import imgPattern from '../assets/images/20934d_800x.jpg';

// Import the specific background image for the Men's page
import menBgImage from '../assets/images/7000779836White-7000779836WhiteYY22CP110222_01-2100.webp'; // Replace with your actual men's background image

const ITEM_WIDTH = 200;
const ITEM_MARGIN = 16;
const EXTRA_MARGIN = 48;

// Define categories data for Men's Landing Page
const categoriesData = [
  {
    name: 'Clothing',
    imageLeft: imgClothing, // Using imported image directly
    heading: 'Explore Our Clothing Collection',
    content:
      'Discover impeccably tailored Kaftans, comfortable Kandooras, and majestic Agbadas...',
    shopLink: '/clothing',
    boxItems: [
      {
        image: imgKaftan,
        title: 'Kaftan',
        content:
          'Elegant and modern kaftans crafted from premium fabric.',
        shopLink: '/clothing/kaftans',
      },
      {
        image: imgKandoor,
        title: 'Kandoor',
        content:
          'Traditional Kandooras with a contemporary twist.',
        shopLink: '/clothing/kandooras',
      },
      {
        image: imgAgbada,
        title: 'Agbada',
        content: 'Majestic Agbadas for your most special ceremonies.',
        shopLink: '/clothing/agbadas',
      },
    ],
  },
  {
    name: 'Bags',
    imageLeft: imgBags, // Using imported image directly
    heading: 'Discover Our Stylish Bags',
    content:
      'Carry your essentials in style with our range of sophisticated bags...',
    shopLink: '/bags',
    boxItems: [
      {
        image: imgLuxury,
        title: 'Luxury Bags',
        content: 'Handcrafted leather bags for the discerning gentleman.',
        shopLink: '/bags/luxury',
      },
      {
        image: imgTravel,
        title: 'Travel Bags',
        content: 'Spacious, durable travel bags for every adventure.',
        shopLink: '/bags/travel',
      },
    ],
  },
  {
    name: 'Shoes',
    imageLeft: imgShoes, // Using imported image directly
    heading: 'Step Out in Our Quality Footwear',
    content: 'Find the perfect pair of shoes for every occasion...',
    shopLink: '/shoes',
    boxItems: [
      {
        image: imgFormal,
        title: 'Formal Shoes',
        content: 'Polished leather oxfords and loafers.',
        shopLink: '/shoes/formal',
      },
      {
        image: imgCasual,
        title: 'Casual Shoes',
        content: 'Comfort meets style in our casual collection.',
        shopLink: '/shoes/casual',
      },
    ],
  },
  {
    name: 'Perfumes',
    imageLeft: imgPerfumes, // Using imported image directly
    heading: 'Indulge in Exquisite Fragrances',
    content: 'Discover our collection of captivating perfumes for men...',
    shopLink: '/perfumes',
    boxItems: [
      {
        image: imgOriental,
        title: 'Oriental Scents',
        content: 'Rich, spicy, and long-lasting.',
        shopLink: '/perfumes/oriental',
      },
      {
        image: imgWoody,
        title: 'Woody Notes',
        content: 'Earthy, warm, and sophisticated.',
        shopLink: '/perfumes/woody',
      },
    ],
  },
  {
    name: 'Accessories',
    imageLeft: imgAccessories, // Using imported image directly
    heading: 'Elevate Your Look with Accessories',
    content:
      'Complete your style with our range of premium accessories...',
    shopLink: '/accessories',
    boxItems: [
      {
        image: imgCufflinks,
        title: 'Cufflinks',
        content: 'Distinctive designs in sterling silver and enamel.',
        shopLink: '/accessories/cufflinks',
      },
      {
        image: imgWatches,
        title: 'Watches',
        content: 'Stand out in our eye-catching time pieces',
        shopLink: '/accessories/watches',
      },
    ],
  },
  {
    name: 'Caps',
    imageLeft: imgCaps, // Using imported image directly
    heading: 'Top Off Your Style with Our Caps',
    content: 'Explore our collection of stylish and comfortable caps...',
    shopLink: '/caps',
    boxItems: [
      {
        image: imgTraditional,
        title: 'Traditional Caps',
        content: 'Classic embroidered designs.',
        shopLink: '/caps/traditional',
      },
      {
        image: imgModern,
        title: 'Modern Caps',
        content: 'Sleek silhouettes in contemporary fabrics.',
        shopLink: '/caps/modern',
      },
    ],
  },
  {
    name: 'Fabrics',
  imageLeft: imgFabrics,  
  heading: 'Discover Our Premium Fabrics',
  content:
    'Hand-picked textiles in classic plains and bold patterns—perfect for bespoke tailoring or ready-made looks.',
  shopLink: '/fabrics',
  boxItems: [
    {
      image: imgPlain,
      title: 'Plain Wool & Cotton',
      content:
        'Sumptuous pure-wool serges, crisp Egyptian cottons, and breathable linens in timeless solids.',
      shopLink: '/fabrics/plain',
    },
    {
      image: imgPattern,
      title: 'Patterned Weaves',
      content:
        'From herringbone and checks to pinstripes and jacquards—bring a dash of character to every suit or shirt.',
      shopLink: '/fabrics/pattern',
    },
  ],
},
];

// Map hero images to categories for the carousel
const originalItems = categoriesData.map((cat, i) => ({
  ...cat,
  heroImage: [imgClothing, imgBags, imgShoes, imgPerfumes, imgAccessories, imgCaps, imgFabrics][i],
}));

export default function MensLandingPage() {
  const [items, setItems] = useState(originalItems);
  const activeItem = items[0]; // The currently active category for display

  // Function to move to the next slide in the carousel
  const nextSlide = () => {
    setItems(prev => {
      const [first, ...rest] = prev;
      return [...rest, first]; // Move the first item to the end
    });
  };

  // Function to move to the previous slide in the carousel
  const prevSlide = () => {
    setItems(prev => {
      const arr = [...prev];
      const last = arr.pop(); // Remove the last item
      return [last, ...arr]; // Add the last item to the beginning
    });
  };

  return (
    <>
      {/* Announcement bar and Navbar */}
      <AnnouncementBar />
      <Navbar />

      {/* Main container for the men's landing page */}
      <div className="mens-landing-page">
        {/* Carousel section */}
        <div className="carousel-wrapper">
          <section className="carousel-section">
            {/* Fixed decorative bulbs */}
            <div className="fixed-bulb top" />
            <div className="fixed-bulb bottom" />

            {/* Previous slide button */}
            <button className="carousel-arrow left" onClick={prevSlide} aria-label="Previous category">
              <FaChevronLeft />
            </button>

            {/* Carousel track displaying category items */}
            <div className="carousel-track">
              {items.map((item, idx) => {
                const isActive = idx === 0; // Check if this is the active item
                const distance = idx; // Distance from the active item
                const scale = isActive ? 1 : 1 - distance * 0.1; // Scale based on distance
                const opacity = isActive ? 1 : 1 - distance * 0.15; // Opacity based on distance

                return (
                  <div
                    key={item.name}
                    className={`carousel-item ${isActive ? 'active' : ''}`}
                    style={{
                      transform: `scale(${scale})`,
                      opacity,
                      width: `${ITEM_WIDTH}px`,
                      marginRight: isActive
                        ? `calc(${ITEM_MARGIN}px + ${EXTRA_MARGIN}px)` // Extra margin for active item
                        : `${ITEM_MARGIN}px`, // Standard margin for other items
                    }}
                  >
                    {/* Display the hero image for the category */}
                    <img src={item.heroImage} alt={item.name} />
                  </div>
                );
              })}
            </div>

            {/* Next slide button */}
            <button className="carousel-arrow right" onClick={nextSlide} aria-label="Next category">
              <FaChevronRight />
            </button>
          </section>
        </div>

        {/* Category display section - shows details of the active category */}
        <div className="category-wrapper">
          {/* Pass the active category data and the specific background image for men */}
          {/* Also pass the gender prop */}
          <CategoryDisplaySection categoryData={activeItem} backgroundImage={menBgImage} gender="men" />
        </div>

        {/* Feed section */}
        <div className="feed-wrapper">
          {/* Assuming FeedSection component is used here */}
          <FeedSection />
        </div>
      </div>

      {/* Product Footer */}
      <ProductFooter />
    </>
  );
}
