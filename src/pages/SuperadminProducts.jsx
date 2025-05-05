// src/pages/AdminProductsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/adminproduct.scss';

import { BagsShopContext } from '../context/BagsShopContext';
import { ClothingShopContext } from '../context/ClothingShopContext';
import { FragranceShopContext } from '../context/FragrancesShopContext';
import { JewelryShopContext } from '../context/JewelryShopContext';
import { ShoesShopContext } from '../context/ShoesShopContext';
import { VeilsShopContext } from '../context/VeilsShopContext';

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const SuperadminProducts = () => {
  // Tab state: "upload" for the upload form, "products" for the products grid.
  const [activeTab, setActiveTab] = useState("upload");
  
  // State variables for upload/edit form
  const [editMode, setEditMode] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [newProduct, setNewProduct] = useState({
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
  // State to track which product's info overlay is active
  const [activeOverlayProductId, setActiveOverlayProductId] = useState(null);

  // Use the respective contexts for category filtering
  const { products: bags } = useContext(BagsShopContext);
  const { products: clothing } = useContext(ClothingShopContext);
  const { products: fragrance } = useContext(FragranceShopContext);
  const { products: jewelry } = useContext(JewelryShopContext);
  const { products: shoes } = useContext(ShoesShopContext);
  const { products: veils } = useContext(VeilsShopContext);

  useEffect(() => {
    fetchProducts();
  }, [newProduct.category]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      let categoryProducts = [];
      switch (newProduct.category) {
        case 'bags':
          categoryProducts = bags.filter(product => product.category === 'bags');
          break;
        case 'clothing':
          categoryProducts = clothing.filter(product => product.category === 'clothing');
          break;
        case 'fragrance':
          categoryProducts = fragrance.filter(product => product.category === 'fragrance');
          break;
        case 'jewelry':
          categoryProducts = jewelry.filter(product => product.category === 'jewelry');
          break;
        case 'shoes':
          categoryProducts = shoes.filter(product => product.category === 'shoes');
          break;
        case 'veils':
          categoryProducts = veils.filter(product => product.category === 'veils');
          break;
        default:
          const response = await axios.get('/products', { params: { category: newProduct.category } });
          categoryProducts = response.data || [];
      }
      setProducts(categoryProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setNewProduct({ ...newProduct, category });
    setCategoryFields(getCategoryFields(category));
  };

  const getCategoryFields = (category) => {
    const categoryFieldsMap = {
      'bags': ['color', 'material', 'size', 'weight', 'dimensions'],
      'clothing': ['color', 'material', 'size', 'fit', 'sleeveLength', 'occasion', 'texture', 'season', 'length'],
      'fragrance': ['scent', 'size', 'longevity', 'intensity', 'occasion', 'season', 'gender', 'notes'],
      'jewelry': ['color', 'material', 'size', 'weight', 'gemstone', 'design', 'occasion', 'chainType'],
      'shoes': ['color', 'material', 'size', 'shoeType', 'heelHeight', 'closureType', 'cushioning', 'occasion', 'season', 'comfortFeatures'],
      'veils': ['color', 'material', 'size', 'design', 'occasion', 'length', 'shape']
    };
    return categoryFieldsMap[category] || [];
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Clean up attributes to remove empty values
    const cleanedAttributes = {};
    Object.entries(newProduct.attributes).forEach(([key, value]) => {
      if (value.trim()) cleanedAttributes[key] = value;
    });

    const formData = new FormData();
    Object.entries({ ...newProduct, attributes: cleanedAttributes }).forEach(([key, value]) => {
      formData.append(key, key === "attributes" ? JSON.stringify(value) : value);
    });
    selectedFiles.forEach((file) => formData.append("images", file));

    try {
      if (editMode && currentProductId) {
        await axios.put(`/products/${currentProductId}`, formData);
        alert("Product updated successfully!");
      } else {
        await axios.post("/products", formData);
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
    setEditMode(true);
    setCurrentProductId(product._id);
    setNewProduct({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      stock: product.stock || '',
      description: product.description || '',
      features: product.features || '',
      careInstructions: product.careInstructions || '',
      brand: product.brand || '',
      attributes: product.attributes || {},
    });
    setSelectedFiles([]);
    setCategoryFields(getCategoryFields(product.category));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/products/${id}`);
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
  };

  return (
    <div className="main-container">
      <div className="admin-container">
        <div className="admin-content-wrapper">
          <div className="admin-products-page">
            {/* Tab Toggle Buttons */}
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

            {/* Render Upload Form */}
            {activeTab === "upload" && (
              <div className="form-container">
                <h2>Upload Products</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                  <div className="">
                    <label>Category:</label>
                    <select name="category" value={newProduct.category} onChange={handleCategoryChange} required>
                      <option value="">Select a category</option>
                      <option value="bags">Bags</option>
                      <option value="clothing">Clothing</option>
                      <option value="fragrance">Fragrance</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="shoes">Shoes</option>
                      <option value="veils">Veils</option>
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

                  <button  type="submit" disabled={isLoading}>
                    {editMode ? 'Update Product' : 'Create Product'}
                  </button>

                  {error && <div className="error">{error}</div>}
                </form>
              </div>
            )}

            {/* Render Products Grid */}
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
                            <button className="info-btn" onClick={() => setActiveOverlayProductId(product._id)}>
                              i
                            </button>
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
  );
};

export default SuperadminProducts;
