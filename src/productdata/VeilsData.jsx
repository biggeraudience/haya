import veil1 from "../assets/veilsproductimages/veil1.webp";
import veil2 from "../assets/veilsproductimages/veil2.webp";
import veil3 from "../assets/veilsproductimages/veil3.webp";
import veil4 from "../assets/veilsproductimages/veil4.webp";
import veil5 from "../assets/veilsproductimages/veil5.webp";
import veil6 from "../assets/veilsproductimages/veil6.webp";
import veil7 from "../assets/veilsproductimages/veil7.webp";
import veil8 from "../assets/veilsproductimages/veil8.webp";
























const VeilsData = [
  {
    id: 1,
    name: "Lace Bridal Veil",
    category: "veils",
    price: 150.0,
    brand: "Vera Wang",
    stock: 10,
    attributes: {
      color: ["White", "Ivory", "Champagne", "Blush"], // Added more color options
      material: ["Lace and Tulle", "Silk and Lace", "Organza", "Tulle and Satin"], // Expanded material options
      size: ["Cathedral", "Chapel", "Elbow", "Fingertip"], // Added more size options
      weight: "300 g",
      dimensions: "120 inches",
      design: ["Simple", "Elegant", "Detailed"], // Added design style options
      occasion: "Wedding", // Ideal for occasions (e.g., Wedding, Formal Event)
      length: "Full-Length", // Length of the veil (e.g., Short, Medium, Full-Length)
      shape: ["Round", "Oval", "Straight"], // Shape of the veil
    },
    features: ["Delicate lace edging", "Soft tulle fabric", "Romantic design"],
    careInstructions: ["Dry clean only", "Store in a protective bag"],
    images: [veil1],
    description: "A classic lace bridal veil that adds a touch of elegance to your wedding look.",
  },
  
    {
      id: 2,
      name: "Beaded Edge Veil",
      category: "veils",
      price: 200.0,
      brand: "Pronovias",
      stock: 15,
      attributes: {
        color: ["Ivory"],
        material: "Tulle with Beads",
        size: "Chapel",
        weight: "250 g",
        dimensions: "90 inches",
      },
      features: ["Hand-beaded edges", "Lightweight and breathable"],
      careInstructions: ["Spot clean gently", "Avoid snagging on jewelry"],
      images: [veil2],
      description: "A stunning chapel-length veil featuring hand-beaded edges for added sparkle.",
    },
    {
      id: 3,
      name: "Two-Tier Veil",
      category: "veils",
      price: 120.0,
      brand: "David's Bridal",
      stock: 20,
      attributes: {
        color: ["White"],
        material: "Tulle",
        size: "Shoulder",
        weight: "180 g",
        dimensions: "30 inches",
      },
      features: ["Two-tier design", "Lightweight fabric", "Blusher included"],
      careInstructions: ["Steam to remove wrinkles", "Store flat in a box"],
      images: [veil3],
      description: "A versatile two-tier veil perfect for a modern bridal look.",
    },
    {
      id: 4,
      name: "Cathedral Length Veil",
      category: "veils",
      price: 300.0,
      brand: "Monique Lhuillier",
      stock: 5,
      attributes: {
        color: ["Ivory"],
        material: "Tulle and Lace",
        size: "Cathedral",
        weight: "400 g",
        dimensions: "150 inches",
      },
      features: ["Dramatic length", "Exquisite lace applique"],
      careInstructions: ["Dry clean only", "Store rolled to prevent creases"],
      images: [veil4],
      description: "A dramatic cathedral-length veil with intricate lace appliques for a grand entrance.",
    },
    {
      id: 5,
      name: "Short Birdcage Veil",
      category: "veils",
      price: 80.0,
      brand: "BHLDN",
      stock: 30,
      attributes: {
        color: ["White"],
        material: "Netting",
        size: "Short",
        weight: "50 g",
        dimensions: "12 inches",
      },
      features: ["Vintage-inspired style", "Easy to wear"],
      careInstructions: ["Hand wash gently", "Store in a flat pouch"],
      images: [veil5],
      description: "A chic birdcage veil that offers a retro charm for your big day.",
    },
    {
      id: 6,
      name: "Embroidered Floral Veil",
      category: "veils",
      price: 220.0,
      brand: "Marchesa",
      stock: 7,
      attributes: {
        color: ["Ivory", "Gold"],
        material: "Tulle and Embroidery",
        size: "Waltz",
        weight: "350 g",
        dimensions: "75 inches",
      },
      features: ["Delicate floral embroidery", "Elegant waltz length"],
      careInstructions: ["Spot clean only", "Store in a breathable garment bag"],
      images: [veil6],
      description: "An embroidered veil with golden floral motifs for a truly enchanting look.",
    },
    {
      id: 7,
      name: "Crystal Edge Veil",
      category: "veils",
      price: 250.0,
      brand: "Jenny Packham",
      stock: 12,
      attributes: {
        color: ["White"],
        material: "Tulle and Crystals",
        size: "Chapel",
        weight: "300 g",
        dimensions: "100 inches",
      },
      features: ["Crystal embellishments", "Shimmering edge design"],
      careInstructions: ["Dry clean only", "Handle with care"],
      images: [veil7],
      description: "A sparkling veil with crystal edges to elevate your bridal look.",
    },
    {
      id: 8,
      name: "Mantilla Veil",
      category: "veils",
      price: 280.0,
      brand: "Rosa Clara",
      stock: 6,
      attributes: {
        color: ["Ivory/Black"],
        material: "Lace",
        size: "Chapel",
        weight: "320 g",
        dimensions: "108 inches",
      },
      features: ["Spanish-inspired style", "Luxurious lace fabric"],
      careInstructions: ["Steam to remove wrinkles", "Store flat"],
      images: [veil8],
      description: "A traditional mantilla veil with ornate lace detailing for a romantic touch.",
    },
  ];
  
  export default VeilsData