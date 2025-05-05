import jewelry1 from "../assets/jewelryproductimages/jewelry1.webp";
import jewelry2 from "../assets/jewelryproductimages/jewelry2.webp";
import jewelry3 from "../assets/jewelryproductimages/jewelry3.webp";
import jewelry4 from "../assets/jewelryproductimages/jewelry4.webp";
import jewelry5 from "../assets/jewelryproductimages/jewelry5.webp";
import jewelry6 from "../assets/jewelryproductimages/jewelry6.webp";
import jewelry7 from "../assets/jewelryproductimages/jewelry7.webp";
import jewelry8 from "../assets/jewelryproductimages/jewelry8.webp";
import jewelry9 from "../assets/jewelryproductimages/jewelry9.webp";
import jewelry10 from "../assets/jewelryproductimages/jewelry10.webp";
import jewelry11 from "../assets/jewelryproductimages/jewelry11.webp";
import jewelry12 from "../assets/jewelryproductimages/jewelry12.webp";
import jewelry13 from "../assets/jewelryproductimages/jewelry13.webp";
import jewelry14 from "../assets/jewelryproductimages/jewelry14.webp";












const JewelryData = [
  {
    id: 1,
    name: "Gold Diamond Necklace",
    category: "jewelry",
    price: 3500.0,
    brand: "Cartier",
    stock: 8,
    attributes: {
      color: ["Gold", "Silver", "Rose Gold", "Platinum"], // Added more color options
      material: ["18K Gold and Diamond", "Platinum and Diamond", "Silver and Sapphire", "White Gold and Diamond"], // Expanded material options
      size: ["Small", "Medium", "Large"], // Added more size options
      weight: "25 g",
      dimensions: "16 inches",
      gemstone: ["Diamond", "Emerald", "Ruby", "Sapphire"], // Added gemstone type
      design: ["Classic", "Modern", "Vintage"], // Added design style options
      occasion: "Special Occasion", // Ideal for different occasions (e.g., Everyday, Casual, Special Occasion)
      gender: "Unisex", // Gender specification for jewelry (e.g., Female, Male, Unisex)
      chainType: "Link", // Type of chain (e.g., Link, Rope, Box, Bead)
    },
    features: ["Elegant design", "High-quality diamonds", "18K gold"],
    careInstructions: [
      "Avoid contact with chemicals",
      "Store in a soft cloth pouch",
    ],
    images: [jewelry1],
    description: "An exquisite gold diamond necklace, perfect for special occasions.",
  },
  
    {
      id: 2,
      name: "Silver Hoop Earrings",
      category: "jewelry",
      price: 150.0,
      brand: "Tiffany & Co.",
      stock: 15,
      attributes: {
        color: ["Silver"],
        material: "Sterling Silver",
        size: "Large",
        weight: "12 g",
        dimensions: "2 inches diameter",
      },
      features: ["Timeless design", "Durable sterling silver"],
      careInstructions: ["Polish with a silver cloth", "Avoid moisture"],
      images: [jewelry2],
      description: "Classic sterling silver hoop earrings for everyday wear.",
    },
    {
      id: 3,
      name: "Pearl Drop Earrings",
      category: "jewelry",
      price: 450.0,
      brand: "Mikimoto",
      stock: 10,
      attributes: {
        color: ["White"],
        material: "Pearls and Gold",
        size: "Small",
        weight: "8 g",
        dimensions: "1.5 inches length",
      },
      features: ["Natural pearls", "Elegant drop design"],
      careInstructions: ["Store separately to avoid scratches", "Clean gently with a damp cloth"],
      images: [jewelry3],
      description: "Graceful pearl drop earrings that add a touch of sophistication.",
    },
    // 12 more jewelry products
    {
      id: 4,
      name: "Rose Gold Charm Bracelet",
      category: "jewelry",
      price: 300.0,
      brand: "Pandora",
      stock: 20,
      attributes: {
        color: ["Rose Gold"],
        material: "14K Rose Gold Plated",
        size: "Adjustable",
        weight: "15 g",
        dimensions: "8 inches",
      },
      features: ["Customizable charm slots", "Rose gold finish"],
      careInstructions: ["Avoid perfumes", "Clean with a soft cloth"],
      images: [jewelry4],
      description: "A charming rose gold bracelet, perfect for showcasing your personality.",
    },
    {
      id: 5,
      name: "Emerald Stud Earrings",
      category: "jewelry",
      price: 550.0,
      brand: "Chopard",
      stock: 7,
      attributes: {
        color: ["Red"],
        material: "Gold and Emerald",
        size: "Small",
        weight: "5 g",
        dimensions: "0.5 inch",
      },
      features: ["Natural emerald stones", "Elegant gold setting"],
      careInstructions: ["Avoid direct sunlight", "Store in a jewelry box"],
      images: [jewelry5],
      description: "Stunning emerald stud earrings with a radiant gold setting.",
    },
    {
      id: 6,
      name: "Platinum Wedding Band",
      category: "jewelry",
      price: 1200.0,
      brand: "De Beers",
      stock: 18,
      attributes: {
        color: ["Platinum"],
        material: "Platinum",
        size: "Various",
        weight: "10 g",
        dimensions: "4 mm width",
      },
      features: ["Timeless design", "Durable platinum material"],
      careInstructions: ["Clean with mild soap", "Polish with a platinum-specific cloth"],
      images: [jewelry6],
      description: "A classic platinum wedding band symbolizing eternal love.",
    },
    {
      id: 7,
      name: "Ruby Pendant Necklace",
      category: "jewelry",
      price: 2500.0,
      brand: "Harry Winston",
      stock: 5,
      attributes: {
        color: ["Red", "Gold"],
        material: "Gold and Ruby",
        size: "Adjustable",
        weight: "18 g",
        dimensions: "18 inches",
      },
      features: ["Vivid ruby centerpiece", "Adjustable chain length"],
      careInstructions: ["Avoid abrasives", "Clean gently with a soft cloth"],
      images: [jewelry7],
      description: "A radiant ruby pendant necklace that commands attention.",
    },
    {
      id: 8,
      name: "Diamond Tennis Bracelet",
      category: "jewelry",
      price: 4000.0,
      brand: "Graff",
      stock: 3,
      attributes: {
        color: ["Silver"],
        material: "White Gold and Diamond",
        size: "Medium",
        weight: "20 g",
        dimensions: "7 inches",
      },
      features: ["Exceptional diamonds", "Secure clasp"],
      careInstructions: ["Store in a box", "Avoid impact"],
      images: [jewelry8],
      description: "A dazzling diamond tennis bracelet for the ultimate luxury.",
    },
    {
      id: 9,
      name: "Amethyst Cocktail Ring",
      category: "jewelry",
      price: 800.0,
      brand: "Bulgari",
      stock: 12,
      attributes: {
        color: ["Purple", "Gold"],
        material: "Gold and Amethyst",
        size: "Various",
        weight: "12 g",
        dimensions: "0.75 inch",
      },
      features: ["Vivid amethyst gemstone", "Unique design"],
      careInstructions: ["Clean with a soft cloth", "Avoid harsh chemicals"],
      images: [jewelry9],
      description: "An eye-catching amethyst cocktail ring for statement-making moments.",
    },
    // Add more products following the same structure...
  ];
  export default JewelryData;