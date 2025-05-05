/* src/components/ProductSideBar.jsx */
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Link } from 'react-router-dom';
import '../styles/productsidebar.scss';

const womenCategories = [
  {
    name: 'Clothing',
    subcategories: [

      'Abaya',
      'Jalabiya',
    ]
  },
  {
    name: 'Shoes',
    subcategories: [
      'Slippers',
      'Heels'
    ]
  },
  {
    name: 'Bags',
    subcategories: [
      'Handbag',
      'Clutch',
      'Tote'
    ]
  },
  {
    name: 'Fragrances',
    subcategories: [
      'Eau de Parfum',
      'Oud',
      'Musk'
    ]
  },
  {
    name: 'Jewelry',
    subcategories: [
      'Necklaces',
      'Bracelets',
      'Earrings'
    ]
  },
  {
    name: 'Veils',
    subcategories: [
      'Hijab',
      'Niqab',
      'Shayla'
    ]
  },
  {
    name: 'Fabrics',
    subcategories: [
      'Cotton',
      'Silk',
      'Chiffon'
    ]
  },
];

const menCategories = [
  {
    name: 'Clothing',
    subcategories: [
      'Agbada',
      'Thobe',
      'Kaftan',
      'Kandoora'
    ]
  },
  {
    name: 'Shoes',
    subcategories: [
      'Sandals',
      'Derby',
      'Oxford'
    ]
  },
  {
    name: 'Bags',
    subcategories: [
      'Backpack',
      'Messenger Bag',
      'Wallet',
      'Grooming Bag'
    ]
  },
  {
    name: 'Caps',
    subcategories: [
      'Kufi',
      'Tangaran',
      'Kindai',
      'Fez'
    ]
  },
  {
    name: 'Accessories',
    subcategories: [
      'Belts',
      'Watches',
      'Cufflinks'
    ]
  },
  {
    name: 'Perfumes',
    subcategories: [
      'Eau de Toilette',
      'Oud',
      'Cologne'
    ]
  },
  {
    name: 'Fabrics',
    subcategories: [
      'Cotton',
      'Linen',
      'Voile'
    ]
  },
];

const normalizeCategory = (cat) => {
  if (!cat) return '';
  switch (cat.toLowerCase()) {
    case 'bag':
    case 'bags':
      return 'bags';
    case 'jewellery':
    case 'jewelry':
      return 'jewelry';
    default:
      return cat.toLowerCase();
  }
};

const normalizeGender = (gender) => {
  if (!gender) return "";
  const lower = gender.toLowerCase();
  if (lower === "male" || lower === "men") return "men";
  if (lower === "female" || lower === "women") return "women";
  return lower;
};

// These are the new nav links you asked for
const navItems = [
  'Home',
  'Account',
  'Track Order',
  'Bespoke Order',
  'Report',
  'Policy',
  'Contact',
  'Settings'
];

const ProductSideBar = ({
  sidebarOpen,
  activeGender,
  selectedCategory,
  selectedSubcategory,
  setSelectedGender,
  setSelectedCategory,
  setSelectedSubcategory,
  onFilterSelect,
  showNavItems // prop to toggle them on - Ensure parent passes this as true
}) => {
  const effectiveGender = normalizeGender(activeGender);
  const categories = effectiveGender === 'men' ? menCategories : womenCategories;
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const match = categories.find(
      (c) => normalizeCategory(c.name) === normalizeCategory(selectedCategory)
    );
    setOpenAccordion(match ? match.name : null);
  }, [selectedCategory, categories]);

  const handleGenderClick = (gender) => {
    const gen = normalizeGender(gender);
    setSelectedGender?.(gen);
    setSelectedCategory?.('all');
    setSelectedSubcategory?.('all');
    setOpenAccordion(null);
    onFilterSelect?.(gen, 'all', 'all');
  };

  const handleCategoryClick = (catName) => {
    const norm = catName.toLowerCase();
    setSelectedCategory?.(norm);
    setSelectedSubcategory?.('all');
    onFilterSelect?.(normalizeGender(activeGender), norm, 'all');
  };

  const handleSubClick = (sub) => {
    setSelectedSubcategory?.(sub);
    onFilterSelect?.(normalizeGender(activeGender), selectedCategory, sub);
  };

  const toggleAccordion = (catName) => {
    setOpenAccordion((prev) => (prev === catName ? null : catName));
  };

  return (
    <div
      className={`sidebar ${sidebarOpen ? 'open' : ''}`}
      style={{
        backgroundColor: "rgba(18, 18, 18, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(8px)"
      }}
    >
      <div className="gender-toggle">
        <button
          className={`gender-button ${normalizeGender(activeGender) === 'men' ? 'active' : ''}`}
          onClick={() => handleGenderClick('men')}
        >
          Men
        </button>
        <button
          className={`gender-button ${normalizeGender(activeGender) === 'women' ? 'active' : ''}`}
          onClick={() => handleGenderClick('women')}
        >
          Women
        </button>
      </div>

      <div className="categories">
        {categories.map((cat, idx) => (
          <div key={idx} className="category-item">
            <div className="category-header">
              <span
                className={`category-text ${
                  normalizeCategory(cat.name) === normalizeCategory(selectedCategory)
                    ? 'active'
                    : ''
                }`}
                onClick={() => handleCategoryClick(cat.name)}
              >
                {cat.name}
              </span>
              <button
                className="accordion-toggle"
                onClick={() => toggleAccordion(cat.name)}
                aria-label="Toggle accordion"
              >
                {openAccordion === cat.name ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </button>
            </div>
            <div
              className={`subcategory-list ${openAccordion === cat.name ? 'open' : ''}`}
              style={{ maxHeight: openAccordion === cat.name ? `${cat.subcategories.length * 40}px` : 0 }}
            >
              {cat.subcategories.map((sub, i) => (
                <div
                  key={i}
                  className={`subcategory-item ${sub === selectedSubcategory ? 'active' : ''}`}
                  onClick={() => handleSubClick(sub)}
                >
                  {sub}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Render Nav Items section below categories if showNavItems is true */}
      {/* This block is now correctly conditionally rendered based on the showNavItems prop */}
      {showNavItems && (
        <>
          <div className="nav-gap" /> {/* Adds margin from the categories */}
          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <Link
                key={item}
                to={`/feed/${encodeURIComponent(item)}`}
                className="sidebar-nav-link"
                // Optional: Add onClick to close sidebar when a link is clicked
                // onClick={() => setSidebarOpen(false)}
              >
                {item}
              </Link>
            ))}
          </nav>
        </>
      )}
    </div>
  );
};

export default ProductSideBar;