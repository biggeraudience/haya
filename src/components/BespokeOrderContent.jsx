// src/components/FeedContent/BespokeOrderContent.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import PropTypes from 'prop-types'; // Keep PropTypes
import { useMensFabricsShop } from "../context/MensFabricsShopContext"; // Adjust path if needed

import '../styles/bespokeordercontent.scss'; // New SCSS file for this component

const BespokeOrderContent = () => { // Removed onFabricSelectForBespoke prop
    const navigate = useNavigate(); // Initialize useNavigate hook
    const { products: mensFabrics, fetchMensFabrics } = useMensFabricsShop(); // Assuming you have fetch function

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch men's fabrics when the component mounts
    useEffect(() => {
        const getFabrics = async () => {
             setIsLoading(true);
             setError(null);
             try {
                 // Assume fetchMensFabrics fetches and updates the context state
                 await fetchMensFabrics(); // Call the fetch function
             } catch (err) {
                  setError("Failed to load fabrics.");
                  console.error("Error fetching men's fabrics:", err);
             } finally {
                 setIsLoading(false);
             }
        };

        // Only fetch if fabrics haven't been loaded yet, or context needs explicit trigger
        if (mensFabrics.length === 0) { // Check if context already has data
             getFabrics();
        } else {
             setIsLoading(false); // Data already available
        }

    }, [fetchMensFabrics, mensFabrics.length]); // Depend on fetch function and fabric count


    // Filter products to ensure they are fabrics and male specific
    const maleFabrics = mensFabrics.filter(product =>
        product.category?.toLowerCase().includes('fabric') &&
        product.gender?.toLowerCase() === 'male'
    );

    // Handler for fabric click - navigates to ProductDetail page
    const handleFabricClick = (fabricId) => {
        // Navigate to the ProductDetail page, passing state to trigger the bespoke form
        navigate(`/product/${fabricId}`, { state: { triggerBespokeForm: true } });
    };


    if (isLoading) {
        return (
            <div className="bespoke-order-container">
                <div className="bespoke-message">Loading fabrics...</div>
            </div>
        );
    }

    if (error) {
         return (
             <div className="bespoke-order-container">
                 <div className="bespoke-message error">Error: {error}</div>
             </div>
         );
    }


    if (maleFabrics.length === 0) {
        return (
            <div className="bespoke-order-container">
                <div className="bespoke-message">No men's fabrics available for bespoke orders at the moment.</div>
            </div>
        );
    }


    return (
        <div className="bespoke-order-container">
            <h2>Select a Fabric for Your Bespoke Order</h2>
            <div className="fabric-grid">
                {maleFabrics.map(fabric => (
                    <div
                        key={fabric._id}
                        className="fabric-item"
                        onClick={() => handleFabricClick(fabric._id)} // Call the navigation handler
                    >
                        <img src={fabric.images?.[0] || "/path/to/placeholder-fabric.jpg"} alt={fabric.name} />
                        <p className="fabric-name">{fabric.name}</p>
                         <p className="fabric-price">${fabric.price?.toFixed(2) || 'N/A'}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default BespokeOrderContent;