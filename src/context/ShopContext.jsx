import { createContext, useState, useMemo } from "react";
import ClothingData from "../productdata/ClothingData";
import ShoesData from "../productdata/ShoesData";
import BagsData from "../productdata/BagsData";
import JewelryData from "../productdata/JewelryData";
import FragrancesData from "../productdata/FragrancesData";
import VeilsData from "../productdata/VeilsData";
import { useFilterContext } from "./FilterContext";

// Create the context
export const ShopContext = createContext();

// Provider component
const ShopContextProvider = ({ children }) => {
    const currency = '₦';
    const delivery_fee = 1500; // Sample delivery fee

    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [favorites, setFavorites] = useState([]);
    const [filters, setFilters] = useState({
        name: '',
        brands: [],
        colors: [],
        priceRange: '',
        size: [],
        material: [],
        sleeve: '',
        length: '',
        neck: '',
        texture: '',
        rating: '',
    });
    const [category, setCategory] = useState('clothing'); // Default category

    // Combine product data from all categories
    const allProducts = useMemo(() => {
        const combinedProducts = [
            ...ClothingData,
            ...ShoesData,
            ...BagsData,
            ...JewelryData,
            ...FragrancesData,
            ...VeilsData
        ];

        return combinedProducts;
    }, [ClothingData, ShoesData, BagsData, JewelryData, FragrancesData, VeilsData]);

    // Filter products based on search and filter criteria
    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            // Match category
            const matchesCategory = category === 'all' || product.category === category;

            // Match filters
            const matchesName = !filters.name || product.name.toLowerCase().includes(filters.name.toLowerCase());
            const matchesBrand = !filters.brands.length || filters.brands.includes(product.brand);
            const matchesPrice = !filters.priceRange || product.price <= Number(filters.priceRange);
            const matchesColor = !filters.colors.length || filters.colors.includes(product.color);
            const matchesSize = !filters.size.length || filters.size.includes(product.size);

            return matchesCategory && matchesName && matchesBrand && matchesPrice && matchesColor && matchesSize;
        });
    }, [filters, category, allProducts]);

    const formatPrice = (price) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(price);

    const toggleFavorite = (productId) => {
        setFavorites(prevFavorites => (
            prevFavorites.includes(productId) ? prevFavorites.filter(id => id !== productId) : [...prevFavorites, productId]
        ));
    };

    const addToCart = (itemId, name, color, size, quantity) => {
        // Code for adding items to cart
    };

    const calculateOrderSummary = () => {
        // Code for calculating order summary
    };

    const handleBrandChange = (e) => {
        // Handle brand change
    };

    return (
        <ShopContext.Provider value={{
            currency,
            delivery_fee,
            search,
            setSearch,
            showSearch,
            setShowSearch,
            cartItems,
            setCartItems,
            favorites,
            toggleFavorite,
            addToCart,
            calculateOrderSummary,
            filters,
            setFilters,
            filteredProducts,
            handleBrandChange,
            setCategory // Allow category selection
        }}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
