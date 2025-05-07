import React, { useContext, useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import namer from "color-namer";
import { toast } from "react-toastify";

// REMOVED: axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

import { ClothingShopContext } from "../context/ClothingShopContext";
import { useShoesShop } from "../context/ShoesShopContext";
import { useBagsShop } from "../context/BagsShopContext";
import { useFragranceShop } from "../context/FragrancesShopContext";
import { useJewelryShop } from "../context/JewelryShopContext";
import { useVeilsShop } from "../context/VeilsShopContext";
import { useWomensFabricsShop } from "../context/WomensFabricsShopContext";

import { useMensAccessoriesShop } from "../context/MensAccessoriesShopContext";
import { useMensCapsShop } from "../context/MensCapsShopContext";
import { useMensClothingShop } from "../context/MensClothingShopContext";
import { useMensFabricsShop } from "../context/MensFabricsShopContext";
import { useMensPerfumesShop } from "../context/MensPerfumesShopContext";
import { useMensShoesShop } from "../context/MensShoesShopContext";
import { useMensBagsShop } from "../context/MensBagsShopContext";
import { useCartContext } from "../context/CartContextContext";

import "../styles/products.scss";
import Navbar from "../components/Navbar";
import useAnalytics, { trackEvent } from "../hooks/useAnalytics";
import ProductFooter from "../components/ProductFooter";

const getFriendlyName = (hex) => {
  if (!hex || typeof hex !== "string" || hex.trim() === "") return "unknown";
  try {
    const names = namer(hex);
    return names.basic[0].name;
  } catch (error) {
    console.error("Invalid color hex:", hex, error);
    return "unknown";
  }
};

const CollapsibleSection = ({ title, children, defaultExpanded = false, icon }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const contentRef = useRef(null);
  const [height, setHeight] = useState(defaultExpanded ? "auto" : "0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(expanded ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [expanded]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="collapsible-section">
      <div className="collapsible-header" onClick={toggleExpanded}>
        <div className="header-content" style={{ display: "flex", alignItems: "center" }}>
          {icon && <span className="section-icon" style={{ marginRight: "8px" }}>{icon}</span>}
          <h3 style={{ fontSize: "20px" }}>{title}</h3>
        </div>
        <div
          className="toggle-button"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#fe5829">
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </div>
      </div>
      <div ref={contentRef} className="collapsible-content" style={{ height, overflow: "hidden", transition: "height 0.3s ease" }}>
        <div style={{ padding: "10px" }}>{children}</div>
      </div>
    </div>
  );
};

CollapsibleSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
  icon: PropTypes.node,
};

const ProductDetail = () => {
  useAnalytics();
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { products: clothingProducts } = useContext(ClothingShopContext);
  const { products: shoesProducts } = useShoesShop();
  const { products: bagsProducts } = useBagsShop();
  const { products: mensBags } = useMensBagsShop();
  const { products: fragranceProducts } = useFragranceShop();
  const { products: jewelryProducts } = useJewelryShop();
  const { products: veilsProducts } = useVeilsShop();
  const { products: womensFabrics } = useWomensFabricsShop();

  const { products: mensAccessories } = useMensAccessoriesShop();
  const { products: mensCaps } = useMensCapsShop();
  const { products: mensClothing } = useMensClothingShop();
  const { products: mensFabrics } = useMensFabricsShop();
  const { products: mensPerfumes } = useMensPerfumesShop();
  const { products: mensShoes } = useMensShoesShop();
  const { addItemToCart } = useCartContext();

  const allProductsFromContext = [
    ...clothingProducts,
    ...shoesProducts,
    ...bagsProducts,
    ...mensBags,
    ...fragranceProducts,
    ...jewelryProducts,
    ...veilsProducts,
    ...womensFabrics,
    ...mensAccessories,
    ...mensCaps,
    ...mensClothing,
    ...mensFabrics,
    ...mensPerfumes,
    ...mensShoes,
  ];

  const [product, setProduct] = useState(
    allProductsFromContext.find((p) => p._id === productId) || null
  );

  useEffect(() => {
    if (product) {
      trackEvent("PRODUCT_VIEWED", { productName: product.name });
    }
  }, [product]);

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || "");
  const [selectedSize, setSelectedSize] = useState(
    product?.attributes?.size ? product.attributes.size.split(",")[0].trim() : ""
  );
  const [selectedLength, setSelectedLength] = useState(
    product?.attributes?.length ? product.attributes.length.split(",")[0].trim() : ""
  );
  const [selectedSleeveLength, setSelectedSleeveLength] = useState(
    product?.attributes?.SleeveLength ? product.attributes.SleeveLength.split(",")[0].trim() : ""
  );


  const [showBespokeForm, setShowBespokeForm] = useState(false);
  const [bespokeMeasurements, setBespokeMeasurements] = useState({});
  const [bespokeNote, setBespokeNote] = useState("");
  const [bespokeFiles, setBespokeFiles] = useState(null);
  const [globalFit, setGlobalFit] = useState([]);

  const [activeImage, setActiveImage] = useState(0);
  const leftColRef = useRef(null);
  const detailsRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite || false);

  const [measurementConfig, setMeasurementConfig] = useState(null);

  const [loading, setLoading] = useState(!product);

  useEffect(() => {
      const fetchProduct = async () => {
          if (!productId) {
              setLoading(false);
              return;
          }
          if (!product || product._id !== productId) {
              setLoading(true);
              try {
                  const BASE_API_URL = import.meta.env.VITE_API_URL;
                  const res = await axios.get(`${BASE_API_URL}/products/public?id=${productId}`);
                  setProduct(res.data);
                  setLoading(false);
              } catch (err) {
                  console.error("Error fetching product:", err);
                  setLoading(false);
              }
          }
      };

      fetchProduct();

  }, [productId, product]);


  useEffect(() => {
    async function fetchMeasurementConfig() {
      try {
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        const res = await axios.get(`${BASE_API_URL}/measurementConfig`, { cache: "no-store" });
        setMeasurementConfig(res.data);
      } catch (error) {
        console.error("Failed to fetch measurement config:", error);
      }
    }
      if (product && product.category?.toLowerCase().includes("fabric")) {
          fetchMeasurementConfig();
      }
  }, [product]);


  useEffect(() => {
    if (location.state?.triggerBespokeForm && product && product.category?.toLowerCase().includes("fabric")) {
        setShowBespokeForm(true);
        navigate(location.pathname, { replace: true });
    }
  }, [location.state, product, navigate, location.pathname]);


  const handleRightColScroll = (e) => {
      if (detailsRef.current) {
          setIsScrolled(detailsRef.current.scrollTop > 10);
      }
    }

  const handleWheelLeftCol = (event) => {
    if (!product?.images || product.images.length === 0 || !leftColRef.current || !detailsRef.current) return;

      event.preventDefault();

      const isResponsive = window.innerWidth < 1200;

      if (isResponsive) {
          if (event.deltaY > 0) {
              if (activeImage < product.images.length - 1) {
                  const newIndex = activeImage + 1;
                  setActiveImage(newIndex);
                  leftColRef.current.scrollTo({ top: newIndex * leftColRef.current.offsetHeight, behavior: "smooth" });
              } else {
                  detailsRef.current.scrollIntoView({ behavior: "smooth" });
              }
          } else if (event.deltaY < 0 && activeImage > 0) {
              const newIndex = activeImage - 1;
              setActiveImage(newIndex);
              leftColRef.current.scrollTo({ top: newIndex * leftColRef.current.offsetHeight, behavior: "smooth" });
          }
      } else {
          if (event.deltaY > 0 && activeImage < product.images.length - 1) {
              const newIndex = activeImage + 1;
              setActiveImage(newIndex);
              leftColRef.current.scrollTo({ top: newIndex * leftColRef.current.offsetHeight, behavior: "smooth" });
          } else if (event.deltaY < 0 && activeImage > 0) {
              const newIndex = activeImage - 1;
              setActiveImage(newIndex);
              leftColRef.current.scrollTo({ top: newIndex * leftColRef.current.offsetHeight, behavior: "smooth" });
          }
      }
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found!</div>;


  const generateOptions = (attrValue) =>
    attrValue ? attrValue.split(",").map((option) => option.trim()).filter(Boolean) : [];


  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedColor,
      selectedSize,
      selectedLength,
      selectedSleeveLength,
      quantity: 1,
    };
    addItemToCart(cartItem);
    toast.success(`${product.name}, it's in your bag!`);
  };

  const handleBespokeAddToCart = () => {
    const bespokeOrder = {
      ...product,
      bespokeMeasurements: {
        ...bespokeMeasurements,
        fit: globalFit,
      },
      bespokeNote,
      bespokeMedia: bespokeFiles,
      isBespoke: true,
      gender: product.gender,
      quantity: 1,
    };
    addItemToCart(bespokeOrder);
    toast.success(`${product.name} bespoke order added to your bag!`);
  };

  const renderMeasurementFields = () => {
    if (!measurementConfig) return <div>Loading measurements...</div>;
    const genderKey = product.gender?.toLowerCase();
    const fields = measurementConfig[genderKey];
    if (!fields || fields.length === 0)
      return <div>No measurement configuration found for {product.gender}</div>;

    return (
      <>
        {fields.map((field) => (
          <div key={field} style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder={field}
              value={bespokeMeasurements[field] ? bespokeMeasurements[field].value : ""}
              onChange={(e) =>
                setBespokeMeasurements((prev) => ({
                  ...prev,
                  [field]: { ...(prev[field] || {}), value: e.target.value },
                }))
              }
              style={{ width: "100%", padding: "8px", fontSize: "16px" }}
            />
          </div>
        ))}
        <div style={{ marginTop: "10px" }}>
          <p style={{ fontSize: "14px", marginBottom: "5px" }}>Fit:</p>
          {["fitted", "regular", "loose"].map((option) => (
            <label key={option} style={{ marginRight: "10px", fontSize: "14px" }}>
              <input
                type="checkbox"
                checked={globalFit.includes(option)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...globalFit, option]
                    : globalFit.filter((o) => o !== option);
                  setGlobalFit(updated);
                }}
              />
              {option}
            </label>
          ))}
        </div>
      </>
    );
  };

  const isFabricProduct = product.category?.toLowerCase().includes("fabric");


  return (
    <>
      <div className="product-detail-page" style={{ position: "relative" }}>
        <Navbar />
        <div className="main-content">
          <div className="left-col" ref={leftColRef} onWheel={handleWheelLeftCol}>
            {product.images?.length > 0 ? (
              product.images.map((img, index) => (
                <div key={index} className="full-image" style={{ position: "relative" }}>
                  <img src={img} alt={`${product.name} ${index + 1}`} />
                </div>
              ))
            ) : (
              <div className="full-image">
                <p>No image available</p>
              </div>
            )}
          </div>
          <div className="right-col" onScroll={handleRightColScroll} ref={detailsRef}>
            <div className="details-container">
              <div className="details-inner">
                <h1 className={`product-name ${isScrolled ? "scrolled" : ""}`}>{product.name}</h1>
                {!showBespokeForm && (
                  <>
                    <div className="price-fav-row">
                      <span className="price">${product.price?.toFixed(2) || "N/A"}</span>
                      <span className="fav-button" onClick={() => setIsFavorite(!isFavorite)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill={isFavorite ? "#fe5829" : "#000"}>
                          <path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
                        </svg>
                      </span>
                    </div>
                    <div className="attribute-selectors" style={{ marginBottom: "20px" }}>
                      {product.colors && product.colors.length > 0 && (
                        <div className="color-selector" style={{ marginBottom: "10px" }}>
                          <label style={{ fontSize: "16px", marginRight: "10px" }}>Color:</label>
                          <div className="color-options" style={{ display: "inline-flex", alignItems: "center" }}>
                            {product.colors.map((color, index) => (
                              <div
                                key={index}
                                className={`color-box ${selectedColor === color.name ? "selected" : ""}`}
                                style={{
                                  backgroundColor: color.name,
                                  width: "24px",
                                  height: "24px",
                                  marginRight: "5px",
                                  cursor: "pointer",
                                  border: selectedColor === color.name ? "2px solid black" : "1px solid #ccc"
                                }}
                                title={getFriendlyName(color.name)}
                                onClick={() => setSelectedColor(color.name)}
                              ></div>
                            ))}
                          </div>
                        </div>
                      )}
                      {product.attributes?.size && (
                        <div className="size-selector" style={{ marginBottom: "10px" }}>
                          <label htmlFor="size-select" style={{ fontSize: "16px", marginRight: "10px" }}>Size:</label>
                          <select
                            id="size-select"
                            className="size-select"
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            style={{ fontSize: "14px", padding: "4px" }}
                          >
                            {generateOptions(product.attributes.size).map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {product.attributes?.length && (
                        <div className="length-selector">
                          <label htmlFor="length-select" style={{ fontSize: "16px", marginRight: "10px" }}>Length:</label>
                          <select
                            id="length-select"
                            className="length-select"
                            value={selectedLength}
                            onChange={(e) => setSelectedLength(e.target.value)}
                            style={{ fontSize: "14px", padding: "4px" }}
                          >
                            {generateOptions(product.attributes.length).map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      {product.attributes?.SleeveLength && (
                        <div className="sleeve-length-selector">
                          <label htmlFor="sleeve-length-select" style={{ fontSize: "16px", marginRight: "10px" }}>Sleeve Length:</label>
                          <select
                            id="sleeve-length-select"
                            className="sleeve-length-selector"
                            value={selectedSleeveLength}
                            onChange={(e) => setSelectedSleeveLength(e.target.value)}
                            style={{ fontSize: "14px", padding: "4px" }}
                          >
                            {generateOptions(product.attributes.SleeveLength).map((option, index) => (
                              <option key={index} value={option}>{option}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>


                    <div className="action-buttons">
                      <button className="buy-button" onClick={handleAddToCart}>Add to bag</button>
                      {isFabricProduct && (
                        <button className="bespoke-order-btn" onClick={() => setShowBespokeForm(true)}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#000">
                            <path d="m280-80v-246h-68.67Q174-326 147-351.67q-27-25.66-27-63 0-27.66 14.33-51.5Q148.67-490 174-501.33L448.67-620v-36.67q-36.67-11-59.67-41.5t-23-68.5Q366-814 399.67-847q33.66-33 81-33 47.33 0 81 33 33.66 33 33.66 80.33h-66.66q0-19.66-14.17-33.16-14.17-13.5-33.83-13.5-19.67 0-33.84 13.5-14.16 13.5-14.16 33.16 0 21 14.16 35.17Q461-717.33 482-717.33q13.67 0 23.5 9.5t9.83 23.16V-620L786-501.33q25.33 11.33 39.67 35.16Q840-442.33 840-414.67q0 37.34-27 63Q786-326 748.67-326H680v246H280Zm-68.67-312.67H280V-440h400v47.33h68.67q9.66 0 17.16-6.66 7.5-6.67 7.5-16.67 0-7.67-4.16-13.5-4.17-5.83-11.17-9.17l-276-124-280 124q-7 3.34-11.17 9.17-4.16 5.83-4.16 12.83 0 10 7.16 17 7.17 7 17.5 7Zm135.34 246h266.66v-226.66H346.67v226.66Zm0-226.66h266.66-266.66Z"/>
                          </svg>
                        </button>
                      )}
                      <button className="checkout-button">Checkout</button>
                    </div>
                    <div className="collapsible-sections">
                      <CollapsibleSection title="Details" defaultExpanded={true} icon={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                          <path d="M160-120q-33 0-56.5-23.5T80-200v-560q0-33 23.5-56.5T160-840h640q33 0 56.5 23.5T880-760v560q0 33-23.5 56.5T800-120H160Zm0-80h640v-560H160v560Zm40-80h200v-80H200v80Zm382-80 198-198-57-57-141 142-57-57-56 57 113 113Zm-382-80h200v-80H200v80Zm0-160h200v-80H200v80Zm-40 400v-560 560Z"/>
                        </svg>
                      }>
                        <p style={{ fontSize: "17px" }}>{product.description || "No details available"}</p>
                      </CollapsibleSection>
                      <CollapsibleSection title="Features" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                          <path d="M120-160q-17 0-28.5-11.5T80-200q0-10 4-18.5T96-232l344-258v-70q0-17 12-28.5t29-11.5q25 0 42-18t17-43q0-25-17.5-42T480-720q-25 0-42.5 17.5T420-660h-80q0-58 41-99t99-41q58 0 99 40.5t41 98.5q0 47-27.5 84T520-526v36l344 258q8 5 12 13.5t4 18.5q0 17-11.5 28.5T840-160H120Zm120-80h480L480-420 240-240Z"/>
                        </svg>
                      }>
                        {product.features?.length > 0 ? (
                          <ul style={{ fontSize: "17px" }}>
                            {product.features.map((feature, index) => (
                              <li key={index}>&#8226; {feature}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>No features available</p>
                        )}
                      </CollapsibleSection>
                      <CollapsibleSection title="Material Composition" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                          <path d="m240-522-40 22q-14 8-30 4t-24-18L66-654q-8-14-4-30t18-24l230-132h70q9 0 14.5 5.5T400-820v20q0 33 23.5 56.5T480-720q33 0 56.5-23.5T560-800v-20q0-9 5.5-14.5T580-840h70l230 132q14 8 18 24t-4 30l-80 140q-8 14-23.5 17.5T760-501l-40-20v361q0 17-11.5 28.5T680-120H280q-17 0-28.5-11.5T240-160v-362Z"/>
                        </svg>
                      }>
                        {product.attributes?.material ? (
                          <ul style={{ fontSize: "17px" }}>
                            {product.attributes.material
                              .split(",")
                              .map(item => item.trim())
                              .filter(Boolean)
                              .map((mat, index) => (
                                <li key={index}>&#8226; {mat}</li>
                              ))
                            }
                          </ul>
                        ) : (
                          <p>Material info not available</p>
                        )}
                      </CollapsibleSection>
                      <CollapsibleSection title="Care" icon={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000">
                          <path d="M216-176q-45-45-70.5-104T120-402q0-63 24-124.5T222-642q35-35 86.5-60t122-39.5Q501-756 591.5-759t202.5 7q8 106 5 195t-16.5 160.5q-13.5 71.5-38 125T684-182q-53 53-112.5 77.5T450-80q-65 0-127-25.5T216-176Zm112-16q29 17 59.5 24.5T450-160q46 0 91-18.5t86-59.5q18-18 36.5-50.5t32-85Q709-426 716-500.5t2-177.5q-49-2-110.5-1.5T485-670q-61 9-116 29t-90 55q-45 45-62 89t-17 85q0 59 22.5 103.5T262-246q42-80 111-153.5T534-520q-72 63-125.5 142.5T328-192Z"/>
                        </svg>
                      }>
                        {product.careInstructions?.length > 0 ? (
                          <ul style={{ fontSize: "17px" }}>
                            {product.careInstructions.map((instruction, index) => (
                              <li key={index}>&#8226; {instruction}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>Care instructions not available</p>
                        )}
                      </CollapsibleSection>
                    </div>
                  </>
                )}
                {showBespokeForm && isFabricProduct && (
                  <div className="bespoke-form">
                    <h3>Bespoke Order Details</h3>
                    <div className="form-content">
                      {renderMeasurementFields()}
                      <div style={{ marginBottom: "10px" }}>
                        <input
                          type="text"
                          placeholder="Additional Notes"
                          value={bespokeNote}
                          onChange={(e) => setBespokeNote(e.target.value)}
                          style={{ width: "100%", padding: "8px", fontSize: "16px" }}
                        />
                      </div>
                      <div style={{ marginBottom: "15px" }}>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={(e) => setBespokeFiles(e.target.files)}
                          style={{ width: "100%" }}
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button className="buy-button" onClick={handleBespokeAddToCart}>Add to bag</button>
                      <button className="checkout-button">Checkout</button>
                      <button className="inline-close-button" onClick={() => setShowBespokeForm(false)}>X</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="you-may-be-interested">
          <h2>You may be interested</h2>
          <div className="interested-grid">
            {product.similar?.length > 0 ? (
              product.similar.map((similar, index) => (
                <div key={index} className="interested-item">
                  <img src={similar.image} alt={similar.name} />
                  <p>{similar.name}</p>
                </div>
              ))
            ) : (
              <p>No similar products available</p>
            )}
          </div>
        </div>
        <ProductFooter />
      </div>
    </>
  );
};

ProductDetail.propTypes = {
};


export default ProductDetail;
