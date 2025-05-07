import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';
import '../styles/admin.scss';
import { useUser } from '../context/UserContext';
import { IoIosColorPalette } from "react-icons/io";
import Navbar from "../components/Navbar"
import ProductFooter from "../components/ProductFooter"

// REMOVED: axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const CustomColorPicker = forwardRef(({ onColorSelect, disabled, initialColor = null }, ref) => {
  const inputRef = useRef(null);
  const [tempColor, setTempColor] = useState(initialColor);
  const debounceTimer = useRef(null);

  useImperativeHandle(ref, () => ({
    openPicker: () => {
      if (!disabled && inputRef.current) {
        inputRef.current.click();
      }
    }
  }));

  const handleChange = (e) => {
    const selectedColor = e.target.value;
    setTempColor(selectedColor);
  };

  useEffect(() => {
    if (tempColor) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        onColorSelect(tempColor);
        setTempColor(null);
      }, 300);
    }
    return () => clearTimeout(debounceTimer.current);
  }, [tempColor, onColorSelect]);

  return (
    <div className="custom-color-picker">
      <button
  type="button"
  className="color-picker-button"
  onClick={() => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  }}
  disabled={disabled}
>
<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#fff"><path d="M480-144q-125 0-212.5-86.5T180-440q0-60 22.5-112.5T264-645l216-219 217 220q38 40 60.5 92T780-440q0 123-87.5 209.5T480-144ZM253-432h454q0-48-13.5-87T646-593L480-761 315-594q-35 35-48.5 74.5T253-432Z"/></svg>
Color
</button>

      <input
        ref={inputRef}
        type="color"
        onChange={handleChange}
        className="hidden-color-input"
        defaultValue={initialColor || "#000000"}
      />
    </div>
  );
});

const AdminProductsPage = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
    gender: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    features: '',
    careInstructions: '',
    brand: '',
    attributes: {},
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryFields, setCategoryFields] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeOverlayProductId, setActiveOverlayProductId] = useState(null);
  const [colors, setColors] = useState([]);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  const colorPickerRef = useRef(null);
  const { user } = useUser();

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      const params = {};
      if (newProduct.category && newProduct.category !== 'all') {
        params.category = newProduct.category;
      }
      const response = await axios.get(`${BASE_API_URL}/products`, { params });
      setProducts(response.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryFields = (category) => {
    const categoryFieldsMap = {
      'bags': [ 'material', 'size', 'weight', 'dimensions'],
      'clothing': [ 'material', 'size', 'fit', 'sleeveLength', 'occasion', 'texture', 'season', 'length'],
      'fragrance': ['scent', 'size', 'longevity', 'intensity', 'occasion', 'season', 'gender', 'notes'],
      'jewelry': [ 'material', 'size', 'weight', 'gemstone', 'design', 'occasion', 'chainType'],
      'shoes': [ 'material', 'size', 'shoeType', 'heelHeight', 'closureType', 'cushioning', 'occasion', 'season', 'comfortFeatures'],
      'veils': [ 'material', 'size', 'design', 'occasion', 'length', 'shape'],
      'womensfabrics': [ 'material', 'pattern', 'weight'],
      'mensclothing': [ 'material', 'size', 'fit', 'sleeveLength', 'occasion', 'texture', 'season', 'length'],
      'mensbags': [ 'material', 'pockets', 'dimensions', 'color', 'weight', 'closing', 'occasion', 'texture', 'handle'],
      'mensaccessories': [ 'material', 'design', 'occasion'],
      'menscaps': [ 'material', 'size', 'style'],
      'mensperfumes': ['scent', 'size', 'longevity', 'intensity', 'occasion', 'season', 'notes'],
      'mensfabrics': [ 'material', 'pattern', 'weight'],
      'mensshoes': [ 'material', 'size', 'shoeType', 'heelHeight', 'closureType', 'cushioning', 'occasion', 'season', 'comfortFeatures']
    };
    return categoryFieldsMap[category] || [];
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setNewProduct({ ...newProduct, category });
    setCategoryFields(getCategoryFields(category));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('attributes.')) {
      const attrKey = name.split('.')[1];
      setNewProduct((prev) => ({
        ...prev,
        attributes: { ...prev.attributes, [attrKey]: value },
      }));
    } else {
      setNewProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFiles(filesArray);
    setError('');
  };

  const handleRemoveSelectedImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const standardizeCategory = (gender, category) => {
    if (gender && gender.toLowerCase() === 'men') {
      if (category.toLowerCase().includes('accessori')) {
        return 'mensaccessories';
      }
    }
    return category;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanedAttributes = {};
    Object.entries(newProduct.attributes).forEach(([key, value]) => {
      if (value.trim()) cleanedAttributes[key] = value;
    });

    const productData = { ...newProduct, attributes: cleanedAttributes };
    productData.category = standardizeCategory(newProduct.gender, productData.category);

    const formData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, key === "attributes" ? JSON.stringify(value) : value);
    });
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("colors", colors.join(','));

    try {
      const BASE_API_URL = import.meta.env.VITE_API_URL;
      if (editMode && currentProductId) {
        await axios.put(`${BASE_API_URL}/products/${currentProductId}`, formData);
        alert("Product updated successfully!");
      } else {
        await axios.post(`${BASE_API_URL}/products`, formData);
        alert("Product created successfully!");
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Failed to save product. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleEdit = (product) => {
    setActiveTab("upload");
    setEditMode(true);
    setCurrentProductId(product._id);
    setNewProduct({
      gender: product.gender || '',
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      stock: product.stock || '',
      description: product.description || '',
      features: product.features.join(', ') || '',
      careInstructions: product.careInstructions.join(', ') || '',
      brand: product.brand || '',
      attributes: product.attributes || {},
    });
    setSelectedFiles([]);
    setCategoryFields(getCategoryFields(product.category));
    if (product.colors) {
      setColors(product.colors.map(c => c.name));
    } else {
      setColors([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const BASE_API_URL = import.meta.env.VITE_API_URL;
        await axios.delete(`${BASE_API_URL}/products/${id}`);
        fetchProducts();
        alert('Product deleted successfully.');
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product.');
      }
    }
  };

  const resetForm = () => {
    setEditMode(false);
    setCurrentProductId(null);
    setNewProduct({
      gender: '',
      name: '',
      category: '',
      price: '',
      stock: '',
      description: '',
      features: '',
      careInstructions: '',
      brand: '',
      attributes: {},
    });
    setSelectedFiles([]);
    setCategoryFields([]);
    setColors([]);
    setEditingColorIndex(null);
  };

  const handleColorSelect = (selectedColor) => {
    if (editingColorIndex !== null) {
      setColors(prev => prev.map((col, idx) => idx === editingColorIndex ? selectedColor : col));
      setEditingColorIndex(null);
    } else {
      if (colors.length < 7) {
        setColors(prev => [...prev, selectedColor]);
      } else {
        alert("Maximum of 7 colors reached.");
      }
    }
  };

  const handleEditColor = (index) => {
    setEditingColorIndex(index);
    if (colorPickerRef.current) {
      colorPickerRef.current.openPicker();
    }
  };

  const handleDeleteColor = (index, e) => {
    e.stopPropagation();
    setColors(prev => prev.filter((_, idx) => idx !== index));
  };

  return (
    <>

    <div className="main-container">
      <div className="admin-container">
        <div className="admin-content-wrapper">
          <div className="admin-products-page">
            <div className="admin-toggle-buttons">
              <button
                className={`admin-toggle-button ${activeTab === "upload" ? "active" : ""}`}
                onClick={() => setActiveTab("upload")}
              >
                Upload Product
              </button>
              <button
                className={`admin-toggle-button ${activeTab === "products" ? "active" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                Products
              </button>
            </div>

            {activeTab === "upload" && (
              <div className="form-container">
                <h2>Upload Products</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" value={newProduct.gender} onChange={handleInputChange} required>
                      <option value="">Select Gender</option>
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <select name="category" value={newProduct.category} onChange={handleCategoryChange} required>
                      <option value="">Select a category</option>
                      <option value="bags">Women’s Bags</option>
                      <option value="clothing">Women’s Clothing</option>
                      <option value="fragrance">Women’s Fragrance</option>
                      <option value="jewelry">Women’s Jewelry</option>
                      <option value="shoes">Women’s Shoes</option>
                      <option value="veils">Women’s Veils</option>
                      <option value="womensfabrics">Women’s Fabrics</option>
                      <option value="mensclothing">Men’s Clothing</option>
                      <option value="mensbags">Men’s Bags</option>
                      <option value="mensaccessories">Men’s Accessories</option>
                      <option value="menscaps">Men’s Caps</option>
                      <option value="mensperfumes">Men’s Perfumes</option>
                      <option value="mensfabrics">Men’s Fabrics</option>
                      <option value="mensshoes">Men’s Shoes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Product Name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Price:</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="Price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock:</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      value={newProduct.stock}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input
                      type="text"
                      name="description"
                      placeholder="Description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Features:</label>
                    <input
                      type="text"
                      name="features"
                      placeholder="Features"
                      value={newProduct.features}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Care Instructions:</label>
                    <input
                      type="text"
                      name="careInstructions"
                      placeholder="Care Instructions"
                      value={newProduct.careInstructions}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Brand:</label>
                    <input
                      type="text"
                      name="brand"
                      placeholder="Brand"
                      value={newProduct.brand}
                      onChange={handleInputChange}
                    />
                  </div>
                  {categoryFields.map((field) => (
                    <div className="form-group" key={field}>
                      <label>{field}:</label>
                      <input
                        type="text"
                        name={`attributes.${field}`}
                        placeholder={field}
                        value={newProduct.attributes[field] || ''}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                  <div className="form-group">
                    <label>Colors:</label>
                    <div className="color-picker-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <CustomColorPicker
                        ref={colorPickerRef}
                        onColorSelect={handleColorSelect}
                        disabled={colors.length >= 7 && editingColorIndex === null}
                        initialColor={editingColorIndex !== null ? colors[editingColorIndex] : "#000000"}
                      />
                      <div className="selected-colors" style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        {colors.map((color, index) => (
                          <div
                            key={index}
                            className="color-box"
                            style={{ backgroundColor: color, position: 'relative', cursor: 'pointer', marginLeft: '0.5rem' }}
                            title={color}
                            onClick={() => handleEditColor(index)}
                          >
                            <button
                              type="button"
                              className="delete-color-btn"
                              onClick={(e) => handleDeleteColor(index, e)}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                background: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                lineHeight: '14px',
                                padding: 0,
                                cursor: 'pointer',
                                color: 'red',
                              }}
                            >
                              –
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Images:</label>
                    <input type="file" multiple onChange={handleFileChange} />
                  </div>
                  {selectedFiles.length > 0 && (
                    <div className="selected-images-wrapper">
                      <div className="selected-images-preview">
                        {selectedFiles.map((file, index) => {
                          const imageUrl = URL.createObjectURL(file);
                          return (
                            <div key={index} className="selected-image-box">
                              <img src={imageUrl} alt={`preview-${index}`} />
                              <button type="button" className="remove-btn" onClick={() => handleRemoveSelectedImage(index)}>X</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <button type="submit" disabled={isLoading}>
                    {editMode ? 'Update Product' : 'Create Product'}
                  </button>
                  {error && <div className="error">{error}</div>}
                </form>
              </div>
            )}
            {activeTab === "products" && (
              <div className="products-container">
                <h3>Products</h3>
                {isLoading ? (
                  <p>Loading...</p>
                ) : (
                  <div className="products-wrapper">
                    <div className="products-grid">
                      {products.map((product) => (
                        <div key={product._id} className="product-card">
                          <div className="image-container">
                            <div className="slider">
                              {product.images && product.images.length > 0 ? (
                                product.images.map((img, idx) => (
                                  <img key={idx} src={img} alt={product.name} />
                                ))
                              ) : (
                                <img src="https://via.placeholder.com/150" alt={product.name} />
                              )}
                            </div>
                            <button className="edit-btn" onClick={() => handleEdit(product)}>✎</button>
                            <button className="delete-btn" onClick={() => handleDelete(product._id)}>🗑</button>
                            <button className="info-btn" onClick={() => setActiveOverlayProductId(product._id)}>i</button>
                            {activeOverlayProductId === product._id && (
                              <div className="product-overlay" onClick={() => setActiveOverlayProductId(null)}>
                                <p>ID: {product._id}</p>
                                <p>Name: {product.name}</p>
                                <p>Price: ${product.price}</p>
                                <p>Stock: {product.stock}</p>
                                <button className="close-overlay" onClick={() => setActiveOverlayProductId(null)}>X</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    </>
  );
};

export default AdminProductsPage;
