import shoe1 from "../assets/shoesproductimages/shoe1.webp";
import shoe2 from "../assets/shoesproductimages/shoe2.webp";
import shoe3 from "../assets/shoesproductimages/shoe3.webp";
import shoe4 from "../assets/shoesproductimages/shoe4.webp";
import shoe5 from "../assets/shoesproductimages/shoe5.webp";
import shoe6 from "../assets/shoesproductimages/shoe6.webp";
import shoe7 from "../assets/shoesproductimages/shoe7.webp";
import shoe8 from "../assets/shoesproductimages/shoe8.webp";
import shoe9 from "../assets/shoesproductimages/shoe9.webp";
import shoe10 from "../assets/shoesproductimages/shoe10.webp";
import shoe11 from "../assets/shoesproductimages/shoe11.webp";
import shoe12 from "../assets/shoesproductimages/shoe12.webp";
import shoe13 from "../assets/shoesproductimages/shoe13.webp";
import shoe14 from "../assets/shoesproductimages/shoe14.webp";
import shoe15 from "../assets/shoesproductimages/shoe15.webp";
import shoe16 from "../assets/shoesproductimages/shoe16.webp";
import shoe17 from "../assets/shoesproductimages/shoe17.webp";
import shoe18 from "../assets/shoesproductimages/shoe18.webp";
import shoe19 from "../assets/shoesproductimages/shoe19.webp";
import shoe20 from "../assets/shoesproductimages/shoe20.webp";
import shoe21 from "../assets/shoesproductimages/shoe21.webp";
import shoe22 from "../assets/shoesproductimages/shoe22.webp";
import shoe23 from "../assets/shoesproductimages/shoe23.webp";
import shoe24 from "../assets/shoesproductimages/shoe24.webp";


const ShoesData = [
  {
    id: 1,
    name: "Balenciaga Triple S",
    brand: "Balenciaga",
    category: "shoes",
    price: 895,
    attributes: {
      color: ["Black", "White", "Blue", "Gray", "Red"], // Added more color options
      material: ["Leather", "Suede", "Mesh", "Rubber"], // Added materials
      size: ["36", "37", "38", "39", "40", "41", "42"], // Expanded shoe size options
      shoeType: "Sneakers", // Type of shoe (e.g., Sneakers, Boots, Sandals)
      heelHeight: "Flat", // Heel height (e.g., Flat, Low, Medium, High)
      closureType: "Lace-up", // Closure method (e.g., Lace-up, Slip-on, Velcro)
      cushioning: "Air", // Cushioning type (e.g., Air, Foam, Gel)
      occasion: "Casual", // Occasion (e.g., Casual, Formal, Sports, Party)
      season: "All Season", // Ideal season for the shoes (e.g., Spring, Summer, Fall, Winter, All Season)
      comfortFeatures: ["Breathable", "Lightweight"], // Features that enhance comfort
    },
    images: [shoe1],
    description: "The iconic Triple S sneakers, known for their chunky design and unmatched comfort.",
  },
  
    {
      id: 2,
      name: "Gucci Ace Sneakers",
      brand: "Gucci",
      category: "shoes",
      price: 680,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Suede"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe2],
      description: "A timeless pair of sneakers featuring Gucci’s signature stripe design.",
    },
    {
      id: 3,
      name: "Dolce And Gabbana Cut-Out Slippers",
      brand: "Louis Vuitton",
      category: "shoes",
      price: 950,
      attributes: {
      color: ["Black", "Red", "Blue"],
      material: ["Leather, Monogram Canvas"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe3],
      description: "Luxurious sneakers combining the brand’s signature monogram with modern styling.",
    },
    {
      id: 4,
      name: "Prada Cloudbust Thunder Sneakers",
      brand: "Prada",
      category: "shoes",
      price: 760,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Nylon, Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe4],
      description: "Prada’s Cloudbust Thunder sneakers boast a futuristic design and excellent comfort.",
    },
    {
      id: 5,
      name: "Saint Laurent Wyatt Chelsea Boots",
      brand: "Saint Laurent",
      category: "shoes",
      price: 1195,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe5],
      description: "A sleek and minimalist Chelsea boot from Saint Laurent, perfect for every occasion.",
    },
    {
      id: 6,
      name: "Chanel Classic Slingbacks",
      brand: "Chanel",
      category: "shoes",
      price: 1290,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Tweed"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe6],
      description: "A stylish, classic design featuring the iconic Chanel interlocking C logo.",
    },
    {
      id: 7,
      name: "Bottega Veneta Stretch Sandals",
      brand: "Bottega Veneta",
      category: "shoes",
      price: 750,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe7],
      description: "Comfortable yet fashionable sandals with Bottega’s signature woven leather.",
    },
    {
      id: 8,
      name: "Christian Louboutin So Kate Pumps",
      brand: "Christian Louboutin",
      category: "shoes",
      price: 675,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe8],
      description: "Iconic Christian Louboutin pumps with a signature red sole and ultra-high stiletto heel.",
    },
    {
      id: 9,
      name: "Givenchy Urban Street Sneakers",
      brand: "Givenchy",
      category: "shoes",
      price: 690,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Suede"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe9],
      description: "A fusion of luxury and street style, these sneakers provide comfort with flair.",
    },
    {
      id: 10,
      name: "Fendi Logo Sneakers",
      brand: "Fendi",
      category: "shoes",
      price: 720,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Rubber"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe10],
      description: "The bold Fendi logo on these sneakers makes a statement of high-end street style.",
    },
    {
      id: 11,
      name: "Valentino Rockstud Flats",
      brand: "Valentino",
      category: "shoes",
      price: 850,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Rubber"],
      size:["36", "37", "38", "39", "40"],
      },
      images: [shoe11],
      description: "Elegant and edgy, these flats feature Valentino’s iconic Rockstud detailing.",
    },
    {
      id: 12,
      name: "Hermès Oran Sandals",
      brand: "Hermès",
      category: "shoes",
      price: 630,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe12],
      description: "Luxurious leather sandals that exemplify understated elegance and sophistication.",
    },
    {
      id: 13,
      name: "Tom Ford Alessandro Sneakers",
      brand: "Tom Ford",
      category: "shoes",
      price: 850,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Suede"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe13],
      description: "Tom Ford’s Alessandro sneakers combine refined style and casual comfort.",
    },
    {
      id: 14,
      name: "Celine Combat Boots",
      brand: "Celine",
      category: "shoes",
      price: 1050,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe14],
      description: "Chunky combat boots with a luxe twist, perfect for all-season wear.",
    },
    {
      id: 15,
      name: "Alexander McQueen Oversized Sneakers",
      brand: "Alexander McQueen",
      category: "shoes",
      price: 590,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe15],
      description: "A statement of luxury streetwear, these oversized sneakers are perfect for any wardrobe.",
    },
    {
      id: 16,
      name: "Miu Miu Crystal Ballet Flats",
      brand: "Miu Miu",
      category: "shoes",
      price: 950,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Crystal"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe16],
      description: "Sparkling crystal ballet flats from Miu Miu, adding a touch of glamour to any outfit.",
    },
    {
      id: 17,
      name: "Bally Canvas Sneakers",
      brand: "Bally",
      category: "shoes",
      price: 550,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Canvas, Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe17],
      description: "Comfortable and stylish sneakers with Bally’s signature design.",
    },
    {
      id: 18,
      name: "Loewe Anagram Slides",
      brand: "Loewe",
      category: "shoes",
      price: 560,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe18],
      description: "Luxury slides featuring the iconic Loewe Anagram, offering comfort and style.",
    },
    {
      id: 19,
      name: "Berluti Wingtip Brogues",
      brand: "Berluti",
      category: "shoes",
      price: 1200,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe19],
      description: "Exquisite brogues from Berluti, crafted from the finest leather with hand-crafted detailing.",
    },
    {
      id: 20,
      name: "Dolce & Gabbana Pointed-Toe Pumps",
      brand: "Dolce & Gabbana",
      category: "shoes",
      price: 950,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe20],
      description: "Elegant pointed-toe pumps with a luxurious finish, perfect for evening wear.",
    },
    {
      id: 21,
      name: "Marc Jacobs The Traveler Sandals",
      brand: "Marc Jacobs",
      category: "shoes",
      price: 420,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size:["36", "37", "38", "39", "40"],
      },
      images:[shoe21],
      description: "Simple yet stylish sandals from Marc Jacobs, designed for comfort and style.",
    },
    {
      id: 22,
      name: "Sandro Chelsea Boots",
      brand: "Sandro",
      category: "shoes",
      price: 560,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe22],
      description: "Classic Chelsea boots from Sandro, perfect for transitioning between seasons.",
    },
    {
      id: 23,
      name: "Isabel Marant Bekett Sneakers",
      brand: "Isabel Marant",
      category: "shoes",
      price: 710,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather, Suede"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe23],
      description: "Stylish sneakers with a wedge heel, combining comfort and fashionable design.",
    },
    {
      id: 24,
      name: "Frye Melissa Button Boots",
      brand: "Frye",
      category: "shoes",
      price: 498,
      attributes: {
      color: ["Black", "White", "Blue"],
      material: ["Leather"],
      size: ["36", "37", "38", "39", "40"],
      },
      images: [shoe24],
      description: "A vintage-inspired boot from Frye with a classic design and versatile style.",
    }
  ];
  export default ShoesData