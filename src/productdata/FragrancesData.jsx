import fragrance1 from "../assets/fragrancesproductimages/fragrance1.webp";
import fragrance2 from "../assets/fragrancesproductimages/fragrance2.webp";
import fragrance3 from "../assets/fragrancesproductimages/fragrance3.webp";
import fragrance4 from "../assets/fragrancesproductimages/fragrance4.webp";
import fragrance5 from "../assets/fragrancesproductimages/fragrance5.webp";
import fragrance6 from "../assets/fragrancesproductimages/fragrance6.webp";
import fragrance7 from "../assets/fragrancesproductimages/fragrance7.webp";
import fragrance8 from "../assets/fragrancesproductimages/fragrance8.webp";
import fragrance9 from "../assets/fragrancesproductimages/fragrance9.webp";
import fragrance10 from "../assets/fragrancesproductimages/fragrance10.webp";


















const FragranceData = [
  {
    id: 1,
    name: "Chanel Coco Mademoiselle Eau de Parfum",
    category: "fragrance",
    price: 145.0,
    brand: "Chanel",
    stock: 25,
    attributes: {
      scent: ["Citrus", "Floral", "Woody", "Spicy", "Sweet"], // Expanded scent options
      size: ["100 ml", "50 ml", "200 ml"], // Added size options
      weight: "350 g",
      dimensions: "7 x 3 x 11 cm",
      longevity: "Long-lasting", // How long the fragrance lasts (e.g., Light, Moderate, Long-lasting)
      intensity: "Medium", // Fragrance intensity (e.g., Light, Medium, Strong)
      occasion: "Daytime", // Ideal for different occasions (e.g., Daytime, Evening, Night, Casual)
      season: "Spring", // Ideal season for wearing the fragrance (e.g., Spring, Summer, Fall, Winter, All Year)
      gender: "Female", // Gender specification for the fragrance (e.g., Female, Male, Unisex)
      notes: ["Orange", "Jasmine", "Patchouli"], // Main fragrance notes
    },
    features: ["Fresh orange notes", "Sophisticated floral heart", "Elegant and sensual"],
    careInstructions: [
      "Store away from sunlight",
      "Avoid contact with sensitive skin",
    ],
    images: [fragrance1],
    description: "A sophisticated and elegant fragrance for the modern woman.",
  },
  
  {
    id: 2,
    name: "Dior J'adore Eau de Parfum",
    category: "fragrance",
    price: 130.0,
    brand: "Dior",
    stock: 30,
    attributes: {
      scent: ["Floral", "Fruity"],
      size:["100 ml"],
      weight: "360 g",
      dimensions: "8 x 4 x 12 cm",
    },
    features: ["Luxurious floral bouquet", "Lush fruity notes", "Radiant and sensual"],
    careInstructions: [
      "Keep in a cool, dry place",
      "Avoid direct sunlight",
    ],
    images: [fragrance2],
    description: "A glamorous and iconic fragrance for timeless femininity.",
  },
  {
    id: 3,
    name: "Gucci Flora Gorgeous Gardenia",
    category: "fragrance",
    price: 120.0,
    brand: "Gucci",
    stock: 20,
    attributes: {
      scent: ["Floral"],
      size: ["100 ml"],
      weight: "350 g",
      dimensions: "7 x 3 x 12 cm",
    },
    features: ["Delicate gardenia notes", "Sweet red berries", "Youthful and vibrant"],
    careInstructions: [
      "Avoid exposure to heat",
      "Store in a shaded area",
    ],
    images: [fragrance3],
    description: "A cheerful fragrance that captures the joy of blooming flowers.",
  },
  {
    id: 4,
    name: "Lancôme La Vie Est Belle",
    category: "fragrance",
    price: 115.0,
    brand: "Lancôme",
    stock: 22,
    attributes: {
      scent: ["Fruity", "Floral", "Gourmand"],
      size: ["75 ml"],
      weight: "340 g",
      dimensions: "6 x 3 x 11 cm",
    },
    features: ["Iris and patchouli heart", "Vanilla gourmand base", "Radiant and joyful"],
    careInstructions: [
      "Store in original packaging",
      "Avoid exposure to humidity",
    ],
    images: [fragrance4],
    description: "A sweet and sophisticated fragrance celebrating the beauty of life.",
  },
  {
    id: 5,
    name: "YSL Black Opium Eau de Parfum",
    category: "fragrance",
    price: 125.0,
    brand: "Yves Saint Laurent",
    stock: 18,
    attributes: {
      scent: ["Sweet", "Vanilla", "Floral"],
      size: ["90 ml"],
      weight: "380 g",
      dimensions: "8 x 4 x 14 cm",
    },
    features: ["Coffee and vanilla blend", "Rich and sensual aroma", "Bold and captivating"],
    careInstructions: [
      "Keep away from direct heat",
      "Store in a dry place",
    ],
    images: [fragrance5],
    description: "A seductive fragrance for women who dare to stand out.",
  },
  {
    id: 6,
    name: "Marc Jacobs Daisy Love Eau de Parfum",
    category: "fragrance",
    price: 110.0,
    brand: "Marc Jacobs",
    stock: 35,
    attributes: {
      scent: ["Fruity", "Floral"],
      size: ["100 ml"],
      weight: "360 g",
      dimensions: "8 x 4 x 12 cm",
    },
    features: ["Sweet cloudberry", "Warm musk base", "Playful and radiant"],
    careInstructions: [
      "Store upright in a cool, dry place",
      "Avoid exposure to light",
    ],
    images: [fragrance6],
    description: "A radiant fragrance capturing the spirit of love and spontaneity.",
  },
  {
    id: 7,
    name: "Viktor & Rolf Flowerbomb Eau de Parfum",
    category: "fragrance",
    price: 150.0,
    brand: "Viktor & Rolf",
    stock: 14,
    attributes: {
      scent: ["Floral", "Sweet"],
      size: ["100 ml"],
      weight: "400 g",
      dimensions: "9 x 5 x 15 cm",
    },
    features: ["Opulent floral bouquet", "Warm woody base", "Empowering and addictive"],
    careInstructions: [
      "Keep tightly sealed when not in use",
      "Avoid storing in humid conditions",
    ],
    images: [fragrance7],
    description: "An enchanting fragrance that makes a bold statement.",
  },
  {
    id: 8,
    name: "Burberry Her Eau de Parfum",
    category: "fragrance",
    price: 130.0,
    brand: "Burberry",
    stock: 24,
    attributes: {
      scent: ["Fruity", "Gourmand"],
      size: ["100 ml"],
      weight: "350 g",
      dimensions: "7 x 4 x 11 cm",
    },
    features: ["Burst of red berries", "Creamy amber base", "Energetic and modern"],
    careInstructions: [
      "Store upright in a cool area",
      "Avoid excessive light exposure",
    ],
    images: [fragrance8],
    description: "A lively fragrance capturing the spirit of a modern city.",
  },
  {
    id: 9,
    name: "Chloé Eau de Parfum",
    category: "fragrance",
    price: 105.0,
    brand: "Chloé",
    stock: 20,
    attributes: {
      scent: ["Floral", "Powdery"],
      size: ["75 ml"],
      weight: "340 g",
      dimensions: "6 x 3 x 11 cm",
    },
    features: ["Rose and magnolia notes", "Elegant musk base", "Feminine and chic"],
    careInstructions: [
      "Store away from heat",
      "Avoid direct sunlight",
    ],
    images: [fragrance9],
    description: "A fresh and romantic fragrance perfect for everyday elegance.",
  },
  {
    id: 10,
    name: "Estée Lauder Beautiful Belle",
    category: "fragrance",
    price: 120.0,
    brand: "Estée Lauder",
    stock: 15,
    attributes: {
      scent: ["Fruity", "Floral", "Oriental"],
      size: ["100 ml"],
      weight: "370 g",
      dimensions: "8 x 4 x 13 cm",
    },
    features: ["Lychee and rose blend", "Rich oriental base", "Romantic and luminous"],
    careInstructions: [
      "Keep in original packaging",
      "Avoid extreme temperatures",
    ],
    images: [fragrance10],
    description: "A luminous and romantic fragrance for special occasions.",
  },
];

export default FragranceData