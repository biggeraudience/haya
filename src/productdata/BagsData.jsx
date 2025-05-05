import bag1 from "../assets/bagsproductimages/bag1.webp";
import bag2 from "../assets/bagsproductimages/bag2.webp";
import bag3 from "../assets/bagsproductimages/bag3.webp";
import bag4 from "../assets/bagsproductimages/bag4.webp";
import bag5 from "../assets/bagsproductimages/bag5.webp";
import bag6 from "../assets/bagsproductimages/bag6.webp";
import bag7 from "../assets/bagsproductimages/bag7.webp";
import bag8 from "../assets/bagsproductimages/bag8.webp";
import bag9 from "../assets/bagsproductimages/bag9.webp";
import bag10 from "../assets/bagsproductimages/bag10.webp";
import bag10i from "../assets/bagsproductimages/bag10i.webp";
import bag10ii from "../assets/bagsproductimages/bag10ii.webp";
import bag10iii from "../assets/bagsproductimages/bag10iii.webp";

import bag11 from "../assets/bagsproductimages/bag11.webp";
import bag12 from "../assets/bagsproductimages/bag12.webp";
import bag13 from "../assets/bagsproductimages/bag13.webp";
import bag14 from "../assets/bagsproductimages/bag14.webp";
import bag15 from "../assets/bagsproductimages/bag15.webp";
import bag16 from "../assets/bagsproductimages/bag16.webp";
import bag17 from "../assets/bagsproductimages/bag17.webp";
import bag18 from "../assets/bagsproductimages/bag18.webp";
import bag19 from "../assets/bagsproductimages/bag19.webp";
import bag20 from "../assets/bagsproductimages/bag20.webp";
import bag21 from "../assets/bagsproductimages/bag21.webp";
import bag22 from "../assets/bagsproductimages/bag22.webp";
import bag23 from "../assets/bagsproductimages/bag23.webp";





const BagsData = [
  {
    id: 1,
    name: "Monogram Canvas Tote",
    category: "bags",
    price: 1500.0,
    brand: "Louis Vuitton",
    stock: 12,
    attributes: {
      color: ["Brown", "Beige", "Black", "Red", "Blue"],
      material: "Canvas and Leather",
      size: "Large", // Filter by size: Small, Medium, Large
      weight: "1.4 kg", // Filter by weight
      dimensions: "40 x 30 x 18 cm", // Filter by bag dimensions
      strapType: "Leather Handle", // Type of strap (e.g., Leather Handle, Chain Strap)
      closureType: "Zipper", // Closure mechanism (e.g., Zipper, Magnetic, Button)
      interior: "Spacious", // Interior description (e.g., Spacious, Divided)
      occasion: "Casual", // Occasion (e.g., Casual, Formal, Evening)
      season: "All Season", // Ideal season for the bag (e.g., Spring, Summer, Fall, Winter, All Season)
      careInstructions: ["Wipe clean with a soft cloth", "Avoid contact with water"],
    },
    features: [
      "Signature monogram canvas",
      "Spacious interior",
      "Gold-tone hardware",
    ],
    images: [bag1],
    description:
      "A timeless tote with Louis Vuitton's signature monogram design. Perfect for everyday elegance.",
  },
  
    {
      id: 2,
      name: "Lady Dior Bag",
      category: "bags",
      price: 4000.0,
      brand: "Dior",
      stock: 8,
      attributes: {
        color: ["Black", "Grey", "Pink"],
        material: "Quilted Leather",
        size: "Medium",
        weight: "1.2 kg",
        dimensions: "32 x 25 x 13 cm",
      },
      features: [
        "Cannage stitching",
        "Adjustable strap",
        "Iconic Dior charms",
      ],
      careInstructions: [
        "Store in its dust bag",
        "Clean with leather conditioner",
      ],
      images: [bag2],
      description:
        "An iconic bag with Cannage stitching and elegant charms. A statement of sophistication.",
    },
    {
      id: 3,
      name: "Birkin 25",
      category: "bags",
      price: 10000.0,
      brand: "Hermès",
      stock: 5,
      attributes: {
        color: ["Orange", "Black", "Gold"],
        material: "Togo Leather",
        size: "Small",
        weight: "1.6 kg",
        dimensions: "25 x 20 x 13 cm",
      },
      features: [
        "Handcrafted luxury",
        "Palladium hardware",
        "Iconic lock and key",
      ],
      careInstructions: [
        "Avoid direct sunlight",
        "Store in a cool, dry place",
      ],
      images: [bag3],
      description:
        "A symbol of luxury, the Birkin 25 is handcrafted with exquisite attention to detail.",
    },
    {
      id: 4,
      name: "Prada Nylon Backpack",
      category: "bags",
      price: 950.0,
      brand: "Prada",
      stock: 20,
      attributes: {
        color: ["Black", "Blue"],
        material: "Nylon",
        size: "Medium",
        weight: "1.1 kg",
        dimensions: "30 x 25 x 12 cm",
      },
      features: [
        "Durable nylon fabric",
        "Adjustable straps",
        "Iconic Prada triangle logo",
      ],
      careInstructions: [
        "Spot clean with mild detergent",
        "Avoid rough surfaces",
      ],
      images: [bag4],
      description:
        "Functional and stylish, this Prada backpack is perfect for urban adventures.",
    },
    {
      id: 5,
      name: "Antigona Mini Bag",
      category: "bags",
      price: 1850.0,
      brand: "Givenchy",
      stock: 10,
      attributes: {
        color: ["White", "Black"],
        material: "Grained Leather",
        size: "Small",
        weight: "1.3 kg",
        dimensions: "23 x 20 x 10 cm",
      },
      features: [
        "Structured silhouette",
        "Detachable strap",
        "Silver-tone hardware",
      ],
      careInstructions: [
        "Avoid exposure to oils",
        "Store in a dust bag",
      ],
      images: [bag5],
      description:
        "The Antigona Mini Bag combines elegance with practicality in a structured design.",
    },
    
    {
        id: 6,
        name: "GG Marmont Matelassé",
        category: "bags",
        price: 2500.0,
        brand: "Gucci",
        stock: 15,
        attributes: {
          color: ["Black", "Red"],
          material: "Matelassé Leather",
          size: "Medium",
          weight: "1.2 kg",
          dimensions: "28 x 19 x 8 cm",
        },
        features: [
          "Double G hardware",
          "Sliding chain strap",
          "Quilted leather design",
        ],
        careInstructions: [
          "Avoid direct contact with water",
          "Store in a dust bag when not in use",
        ],
        images: [bag6],
        description:
          "A sophisticated shoulder bag featuring quilted leather and Gucci's signature Double G hardware.",
      },
      {
        id: 7,
        name: "Cabas Phantom Tote",
        category: "bags",
        price: 2300.0,
        brand: "Celine",
        stock: 9,
        attributes: {
          color: ["Beige", "Black"],
          material: "Calfskin Leather",
          size: "Large",
          weight: "1.5 kg",
          dimensions: "35 x 30 x 17 cm",
        },
        features: [
          "Minimalist design",
          "Soft calfskin leather",
          "Expandable side ties",
        ],
        careInstructions: [
          "Clean with a soft, dry cloth",
          "Avoid exposure to oils and creams",
        ],
        images: [bag7],
        description:
          "A minimalist tote crafted from soft calfskin leather, offering understated luxury.",
      },
      {
        id: 8,
        name: "Bobby Bag",
        category: "bags",
        price: 3200.0,
        brand: "Dior",
        stock: 7,
        attributes: {
          color: ["Tan", "Black", "White"],
          material: "Smooth Leather",
          size: "Medium",
          weight: "1.3 kg",
          dimensions: "27 x 20 x 8 cm",
        },
        features: [
          "CD clasp",
          "Adjustable shoulder strap",
          "Classic saddle shape",
        ],
        careInstructions: [
          "Clean with a leather balm",
          "Store in its original box",
        ],
        images: [bag8],
        description:
          "The Bobby Bag is a modern interpretation of the saddle silhouette, complete with iconic Dior details.",
      },
      {
        id: 9,
        name: "City Classic Bag",
        category: "bags",
        price: 1950.0,
        brand: "Balenciaga",
        stock: 12,
        attributes: {
          color: ["Grey", "Black", "Blue"],
          material: "Lambskin",
          size: "Medium",
          weight: "1.4 kg",
          dimensions: "31 x 24 x 10 cm",
        },
        features: [
          "Iconic studded details",
          "Removable shoulder strap",
          "Zippered top closure",
        ],
        careInstructions: [
          "Use a leather cleaner",
          "Avoid prolonged sun exposure",
        ],
        images: [bag9],
        description:
          "A Balenciaga icon, the City Classic Bag features signature studded details and a modern silhouette.",
      },
      {
        id: 10,
        name: "Sicily Island Handbag",
        category: "bags",
        price: 4200.0,
        brand: "Fendi",
        stock: 6,
        attributes: {
          color: ["Yellow", "Black"],
          material: "Nappa Leather",
          size: "Small",
          weight: "1.1 kg",
          dimensions: "23 x 19 x 11 cm",
        },
        features: [
          "Twist-lock closure",
          "Dual interior compartments",
          "Gold-tone hardware",
        ],
        careInstructions: [
          "Wipe with a damp cloth",
          "Store with stuffing to maintain shape",
        ],
        images: [bag10,bag10i,bag10ii,bag10iii],
        description:
          "The Peekaboo Mini offers a luxurious design with playful proportions and iconic Fendi details.",
      },
      {
        id: 11,
        name: "VSLING Shoulder Bag",
        category: "bags",
        price: 2700.0,
        brand: "Valentino",
        stock: 11,
        attributes: {
          color: ["Black", "Blush"],
          material: "Smooth Leather",
          size: "Medium",
          weight: "1.2 kg",
          dimensions: "28 x 20 x 10 cm",
        },
        features: [
          "Adjustable strap",
          "Signature VLogo clasp",
          "Magnetic closure",
        ],
        careInstructions: [
          "Store in its dust bag",
          "Avoid exposure to harsh chemicals",
        ],
        images: [bag11],
        description:
          "A chic shoulder bag with Valentino's signature VLogo clasp, ideal for modern elegance.",
      },
      {
        id: 12,
        name: "Twist MM Bag",
        category: "bags",
        price: 4200.0,
        brand: "Louis Vuitton",
        stock: 5,
        attributes: {
          color: ["White", "Black"],
          material: "Epi Leather",
          size: "Medium",
          weight: "1.3 kg",
          dimensions: "23 x 17 x 9 cm",
        },
        features: [
          "Twist-lock closure",
          "Sliding chain strap",
          "Iconic LV twist hardware",
        ],
        careInstructions: [
          "Avoid scratches on hardware",
          "Clean with a damp cloth",
        ],
        images: [bag12],
        description:
          "The Twist MM Bag combines modern functionality with timeless Louis Vuitton craftsmanship.",
      },
      
      {
        id: 13,
        name: "Lady Dior Bag",
        category: "bags",
        price: 4900.0,
        brand: "Dior",
        stock: 8,
        attributes: {
          color: ["Pink", "Black", "Beige"],
          material: "Lambskin",
          size: "Medium",
          weight: "1.4 kg",
          dimensions: "24 x 20 x 11 cm",
        },
        features: [
          "Iconic Cannage stitching",
          "Removable shoulder strap",
          "Charm embellishments",
        ],
        careInstructions: [
          "Clean with a soft, dry cloth",
          "Avoid moisture and humidity",
        ],
        images: [bag13],
        description:
          "An iconic Dior piece, the Lady Dior Bag features the brand's signature Cannage stitching and charm embellishments.",
      },
      {
        id: 14,
        name: "Birkin 30",
        category: "bags",
        price: 15000.0,
        brand: "Hermès",
        stock: 3,
        attributes: {
          color: ["Orange", "Taupe", "Black"],
          material: "Togo Leather",
          size: "Medium",
          weight: "1.8 kg",
          dimensions: "30 x 22 x 16 cm",
        },
        features: [
          "Handcrafted with precision",
          "Signature lock and key",
          "Timeless design",
        ],
        careInstructions: [
          "Use a specialized leather conditioner",
          "Keep away from direct sunlight",
        ],
        images: [bag14],
        description:
          "A coveted classic, the Hermès Birkin 30 is a timeless icon of elegance and craftsmanship.",
      },
      {
        id: 15,
        name: "Nile Bracelet Bag",
        category: "bags",
        price: 2000.0,
        brand: "Chloé",
        stock: 12,
        attributes: {
          color: ["Brown", "Beige"],
          material: "Calfskin Leather",
          size: "Small",
          weight: "1.1 kg",
          dimensions: "19 x 15 x 7 cm",
        },
        features: [
          "Gold-tone bracelet handle",
          "Adjustable crossbody strap",
          "Elegant and compact design",
        ],
        careInstructions: [
          "Store with padding inside",
          "Avoid water exposure",
        ],
        images: [bag15],
        description:
          "The Chloé Nile Bracelet Bag combines elegance with versatility, featuring a unique gold-tone handle.",
      },
      {
        id: 16,
        name: "Speedy 30",
        category: "bags",
        price: 1500.0,
        brand: "Louis Vuitton",
        stock: 10,
        attributes: {
          color: ["Red", "Black"],
          material: "Coated Canvas and Leather",
          size: "Medium",
          weight: "1.5 kg",
          dimensions: "30 x 21 x 17 cm",
        },
        features: [
          "Iconic LV Monogram",
          "Zippered closure",
          "Versatile design",
        ],
        careInstructions: [
          "Wipe with a damp cloth",
          "Keep away from abrasive surfaces",
        ],
        images: [bag16],
        description:
          "The Speedy 30 is a timeless Louis Vuitton handbag that combines classic design with everyday practicality.",
      },
      {
        id: 17,
        name: "Puzzle Bag",
        category: "bags",
        price: 2600.0,
        brand: "Loewe",
        stock: 7,
        attributes: {
          color: ["Tan", "Black", "Blue"],
          material: "Calfskin Leather",
          size: "Medium",
          weight: "1.4 kg",
          dimensions: "29 x 19 x 12 cm",
        },
        features: [
          "Asymmetrical design",
          "Adjustable shoulder strap",
          "Versatile carrying options",
        ],
        careInstructions: [
          "Clean with a leather conditioner",
          "Store in a cool, dry place",
        ],
        images: [bag17],
        description:
          "The Puzzle Bag by Loewe is a contemporary icon, featuring innovative design and exceptional craftsmanship.",
      },
      {
        id: 18,
        name: "Capucines BB",
        category: "bags",
        price: 4700.0,
        brand: "Louis Vuitton",
        stock: 5,
        attributes: {
          color: ["Pink", "Black", "White"],
          material: "Full-Grain Leather",
          size: "Small",
          weight: "1.3 kg",
          dimensions: "27 x 18 x 9 cm",
        },
        features: [
          "Monogram flower accents",
          "Structured silhouette",
          "Top handle and shoulder strap",
        ],
        careInstructions: [
          "Store with care in its dust bag",
          "Avoid sharp objects",
        ],
        images: [bag18],
        description:
          "The Capucines BB is a true symbol of Louis Vuitton sophistication, blending elegance and functionality.",
      },
      {
        id: 19,
        name: "Trapeze Bag",
        category: "bags",
        price: 2500.0,
        brand: "Celine",
        stock: 6,
        attributes: {
          color: ["Grey", "Black"],
          material: "Calfskin and Suede",
          size: "Medium",
          weight: "1.5 kg",
          dimensions: "30 x 22 x 15 cm",
        },
        features: [
          "Winged sides",
          "Top handle and shoulder strap",
          "Secure zip closure",
        ],
        careInstructions: [
          "Wipe with a soft cloth",
          "Avoid exposure to harsh elements",
        ],
        images: [bag19],
        description:
          "A structured masterpiece, the Trapeze Bag combines modern aesthetics with timeless appeal.",
      },
      {
        id: 20,
        name: "Coach Maxi Handbag",
        category: "bags",
        price: 7500.0,
        brand: "Chanel",
        stock: 4,
        attributes: {
          color: ["Black", "Beige"],
          material: "Quilted Leather",
          size: "Medium",
          weight: "1.4 kg",
          dimensions: "26 x 16 x 7 cm",
        },
        features: [
          "Double C turn-lock",
          "Chain and leather strap",
          "Quilted design",
        ],
        careInstructions: [
          "Clean with a dry, soft cloth",
          "Avoid overloading",
        ],
        images: [bag20],
        description:
          "The Chanel Classic Flap Bag is an enduring icon, representing timeless luxury and craftsmanship.",
      },
      {
        id: 21,
        name: "Panthère de Cartier Bag",
        category: "bags",
        price: 3900.0,
        brand: "Cartier",
        stock: 8,
        attributes: {
          color: ["Gold", "Black"],
          material: "Metal and Leather",
          size: "Small",
          weight: "1.1 kg",
          dimensions: "20 x 13 x 5 cm",
        },
        features: [
          "Panther emblem clasp",
          "Chain strap",
          "Exquisite detailing",
        ],
        careInstructions: [
          "Handle with care",
          "Clean metal parts with a soft cloth",
        ],
        images: [bag21],
        description:
          "An elegant clutch with Cartier's signature panther motif, perfect for evening occasions.",
      },
      {
        id: 22,
        name: "Marcie Saddle Bag",
        category: "bags",
        price: 1500.0,
        brand: "Chloé",
        stock: 12,
        attributes: {
          color: ["Brown", "Beige", "Black"],
          material: "Grained Calfskin",
          size: "Medium",
          weight: "1.2 kg",
          dimensions: "25 x 20 x 9 cm",
        },
        features: [
          "Curved flap design",
          "Adjustable strap",
          "Textured leather finish",
        ],
        careInstructions: [
          "Store in its dust bag",
          "Avoid excessive moisture",
        ],
        images: [bag22],
        description:
          "The Marcie Saddle Bag is a boho-chic crossbody that exudes effortless elegance.",
      },
      {
        id: 23,
        name: "Le Chiquito Moyen",
        category: "bags",
        price: 800.0,
        brand: "Jacquemus",
        stock: 20,
        attributes: {
          color: ["Pink", "Beige", "Black"],
          material: "Smooth Leather",
          size: "Small",
          weight: "600 g",
          dimensions: "18 x 13 x 8 cm",
        },
        features: [
          "Miniature top handle design",
          "Magnetic closure",
          "Adjustable strap",
        ],
        careInstructions: [
          "Keep in a cool, dry place",
          "Clean with a damp cloth",
        ],
        images: [bag23],
        description:
          "The Jacquemus Le Chiquito Moyen bag is an Instagram-worthy accessory with bold style.",
      },
    
    
    
  ];
  export default BagsData;
  