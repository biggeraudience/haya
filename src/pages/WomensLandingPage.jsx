// src/pages/WomensLandingPage.jsx
import React, { useState } from 'react';
import '../styles/womenslandingpage.scss'; // Import styles for the women's landing page
import AnnouncementBar from '../components/AnnouncementBar.jsx';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CategoryDisplaySection from '../components/CategoryDisplaySection.jsx';
import FeedSection from '../components/FeedSection.jsx'; // Assuming FeedSection is gender-neutral or handles content based on context
import Navbar from '../components/Navbar.jsx';
import ProductFooter from '../components/ProductFooter.jsx';

// Placeholder images for Women's Landing Page carousel
// Replace these with your actual image imports for women's categories
import imgWomensClothing from '../assets/images/d3244b0e-ddc5-4d6b-8e36-d9488df9ead0_removalai_preview.png'; // Placeholder
import imgWomensBags from '../assets/images/0e0bacc7-a05a-47a3-b3ba-59fdaeeb1a57_removalai_preview.png';       // Placeholder
import imgWomensShoes from '../assets/images/a687f390-766c-49f6-9d79-17b873887d99_removalai_preview.png';     // Placeholder
import imgWomensPerfumes from '../assets/images/7571b793-e6c8-4892-979f-fcd636b4875e_removalai_preview.png'; // Placeholder
import imgWomensAccessories from '../assets/images/cbd36c88-cf54-4c7d-9624-eb2fa3d54141_removalai_preview.png'; // Placeholder
import imgWomensJewelry from '../assets/images/4ea5574e-edc8-4b1a-8c92-1ba87f92788d_removalai_preview.png';   // Placeholder
import imgWomensFabrics from '../assets/images/27204dembroideredcotton_800x.webp';

// Placeholder images for sub-categories within Women's Landing Page
// Replace these with your actual image imports for women's sub-categories
import imgCasual from '../assets/images/7f77c3e9-596b-4c9a-8994-177e788e4b37_removalai_preview.png';   // Placeholder
import imgFormal from '../assets/images/49d86bca-32d4-4a3a-b289-6b6e27697ae2_removalai_preview.png';   // Placeholder
import imgHandbagTote from '../assets/images/c352085b-fcfb-4331-b45f-09365b082b2b_removalai_preview.png';   // Placeholder
import imgHandbagClutch from '../assets/images/ac66b33b-d732-40c7-bd8f-d896939891ab_removalai_preview.png'; // Placeholder
import imgShoeHeels from '../assets/images/f208f531-03b5-44c0-beea-ff4f08436931_removalai_preview.png';       // Placeholder
import imgShoeFlats from '../assets/images/f9e07e00-cdcc-49f0-b6e3-5636c6df05bb_removalai_preview.png';       // Placeholder
import imgPerfumeFloral from '../assets/images/87765a6a-05f5-41ce-aa2f-d30481ea693d_removalai_preview.png'; // Placeholder
import imgPerfumeSweet from '../assets/images/7ac0a455-e209-4f75-b913-1ec4cf801034_removalai_preview.png'; // Placeholder
import imgAccessoryScarf from '../assets/images/84abc794-0d32-4832-b8b1-b66f397aceaa_removalai_preview.png'; // Placeholder
import imgAccessoryWatches from '../assets/images/cbd36c88-cf54-4c7d-9624-eb2fa3d54141_removalai_preview.png'; // Placeholder
import imgJewelryNecklace from '../assets/images/20f6507f-9903-4f99-92fc-83019b066945_removalai_preview.png'; // Placeholder
import imgJewelryEarrings from '../assets/images/53334036-0464-44df-857b-b389db5c1adc_removalai_preview.png'; // Placeholder
import imgPlain from '../assets/images/23772c_silk_crepe_de_chine_800x.jpg';
import imgPattern from '../assets/images/27210dembroideredcotton_800x.webp';

// Import the specific background image for the Women's page
import womenBgImage from '../assets/images/pexels-tima-miroshnichenko-5973764.jpg'; // Replace with your actual women's background image

const ITEM_WIDTH = 200;
const ITEM_MARGIN = 16;
const EXTRA_MARGIN = 48;

// Define categories data for Women's Landing Page
// Replace content and links with actual women's data
const categoriesData = [
  // Updated “Clothing” entry for Women's Landing Page
{
  name: 'Clothing',
  imageLeft: imgWomensClothing,  // hero image for the clothing category
  heading: 'Explore Our Traditional Clothing',
  content:
    'Discover our curated collection of abayas, kaftans, skirts and blouses—each piece crafted in premium fabrics with exquisite embroidery and timeless silhouettes.',
  shopLink: '/womens/clothing',
  boxItems: [
    {
      image: imgFormal,  // import this at top of your file
      title: 'Formal Abayas',
      content:
        'Flowing abayas in luxe crepe and silk blends, featuring modern cuts and delicate embellishments.',
      shopLink: '/womens/clothing/abayas',
    },
    {
      image: imgCasual,  // import this at top of your file
      title: 'Casual Abayas',
      content:
        'Comfortable yet elegant abayas in vibrant prints and rich solids, perfect for leisure and special occasions.',
      shopLink: '/womens/clothing/kaftans',
    },
  ],
},

  {
    name: 'Handbags',
    imageLeft: imgWomensBags, // Using imported image directly
    heading: "Discover Our Women's Handbags",
    content:
      'Find the perfect handbag to complement your style...',
    shopLink: '/womens/handbags',
    boxItems: [
      {
        image: imgHandbagTote,
        title: 'Tote Bags',
        content: 'Spacious and versatile tote bags.',
        shopLink: '/womens/handbags/totes',
      },
      {
        image: imgHandbagClutch,
        title: 'Clutches',
        content: 'Elegant clutches for evening wear.',
        shopLink: '/womens/handbags/clutches',
      },
      // Add more handbag sub-categories as needed
    ],
  },
  {
    name: 'Shoes',
    imageLeft: imgWomensShoes, // Using imported image directly
    heading: 'Step Out in Style with Our Footwear',
    content: "Explore our collection of women's shoes for any look...",
    shopLink: '/womens/shoes',
    boxItems: [
      {
        image: imgShoeHeels,
        title: 'Heels',
        content: 'Elevate your look with our range of heels.',
        shopLink: '/womens/shoes/heels',
      },
      {
        image: imgShoeFlats,
        title: 'Flats',
        content: 'Comfortable and stylish flats for everyday.',
        shopLink: '/womens/shoes/flats',
      },
      // Add more shoe sub-categories as needed
    ],
  },
  {
    name: 'Perfumes',
    imageLeft: imgWomensPerfumes, // Using imported image directly
    heading: 'Find Your Signature Scent',
    content: "Discover our collection of captivating perfumes for women...",
    shopLink: '/womens/perfumes',
    boxItems: [
      {
        image: imgPerfumeFloral,
        title: 'Floral Scents',
        content: 'Light and refreshing floral fragrances.',
        shopLink: '/womens/perfumes/floral',
      },
      {
        image: imgPerfumeSweet,
        title: 'Sweet Scents',
        content: 'Sweet and inviting fragrances.',
        shopLink: '/womens/perfumes/sweet',
      },
      // Add more perfume sub-categories as needed
    ],
  },
  {
    name: 'Accessories',
    imageLeft: imgWomensAccessories, // Using imported image directly
    heading: 'Accessorize Your Outfit',
    content:
      'Complete your look with our range of beautiful accessories...',
    shopLink: '/womens/accessories',
    boxItems: [
      {
        image: imgAccessoryScarf,
        title: 'Scarves',
        content: 'Stylish scarves in various patterns and fabrics.',
        shopLink: '/womens/accessories/scarves',
      },
      {
        image: imgAccessoryWatches,
        title: 'Watches',
        content: 'Sophisticated timepieces in rose-gold, stainless steel, and leather straps—designed to elevate both day and evening ensembles.',
        shopLink: '/womens/accessories/watches',
      },
      
      // Add more accessory sub-categories as needed
    ],
  },
  {
    name: 'Jewelry',
    imageLeft: imgWomensJewelry, // Using imported image directly
    heading: 'Sparkle with Our Jewelry Collection',
    content: "Add a touch of glamour with our exquisite women's jewelry...",
    shopLink: '/womens/jewelry',
    boxItems: [
      {
        image: imgJewelryNecklace,
        title: 'Necklaces',
        content: 'Elegant necklaces for any neckline.',
        shopLink: '/womens/jewelry/necklaces',
      },
      {
        image: imgJewelryEarrings,
        title: 'Earrings',
        content: 'From studs to chandeliers, find your perfect pair.',
        shopLink: '/womens/jewelry/earrings',
      },
    ],
  },
  {
    name: 'Fabrics',
    imageLeft: imgWomensFabrics,
    heading: 'Explore Our Luxe Textiles',
    content:
      'Elegant blends and vibrant prints—our curated fabrics let you craft everything from flowy dresses to tailored separates.',
    shopLink: '/womens/fabrics',
    boxItems: [
      {
        image: imgPlain,
        title: 'Silks & Satins',
        content:
          'Delicate charmeuse silks, glossy satins, and soft crepes in solid hues for dresses, blouses, and eveningwear.',
        shopLink: '/womens/fabrics/plain',
      },
      {
        image: imgPattern,
        title: 'Printed Voiles & Chiffons',
        content:
          'Lightweight voiles, floaty chiffons, and artisan prints—from florals to geometrics—for your signature style.',
        shopLink: '/womens/fabrics/printed',
      },
    ],
    },
];

// Map hero images to categories for the carousel (using placeholder images)
const originalItems = categoriesData.map((cat, i) => ({
  ...cat,
  heroImage: [imgWomensClothing, imgWomensBags, imgWomensShoes, imgWomensPerfumes, imgWomensAccessories, imgWomensJewelry, imgWomensFabrics][i],
}));


export default function WomensLandingPage() {
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

      {/* Main container for the women's landing page */}
      <div className="womens-landing-page">
        {/* Carousel section */}
        <div className="carousel-wrapper">
          <section className="carousel-section">
            {/* Fixed decorative bulbs - keep these */}
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
          {/* Pass the active category data and the specific background image for women */}
          {/* Also pass the gender prop */}
          <CategoryDisplaySection categoryData={activeItem} backgroundImage={womenBgImage} gender="women" />
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
