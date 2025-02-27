import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './QuotationPage.css';

const QuotationPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [quotationNumber] = useState('QT12345');
    const [quotationDate] = useState(new Date().toISOString().split('T')[0]);
    const [quotationTerms] = useState('Payment due within 30 days.');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [shopList, setShopList] = useState([]);
    const [selectedShop, setSelectedShop] = useState('');
    const pdfRef = useRef();

    useEffect(() => {
        fetchShops();
        fetchProducts();
    }, []);

    const fetchShops = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/v1.0/shop/getAllShops');
            setShopList(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching shops:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/v1.0/product/getAllProducts');
            setProducts(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProduct = () => {
        if (!selectedProduct) return;
        const existingProduct = products.find(product => product.id === parseInt(selectedProduct));
        if (!existingProduct) return;

        const total = existingProduct.price * quantity;
        setSelectedProducts([...selectedProducts, {
            productId: existingProduct.id,
            name: existingProduct.name,
            price: existingProduct.price,
            quantity,
            total
        }]);
        setQuantity(1);
    };

    const removeProduct = (index) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const saveQuotation = async () => {
        if (!selectedShop) {
            alert('Please select a shop.');
            return;
        }
        
        if (selectedProducts.length === 0) {
            alert('Please add at least one product.');
            return;
        }
        
        const quotationData = {
            quotationNumber,
            quotationDate,
            quotationTerms,
            shopId: selectedShop,
            products: selectedProducts
        };

        try {
            await axios.post('http://localhost:3002/api/v1.0/quotation/quotation', quotationData);
            alert('Quotation Saved Successfully');
        } catch (error) {
            console.error('Error saving quotation:', error);
        }
    };

    const downloadPDF = () => {
        const input = pdfRef.current;
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
            pdf.save(`Quotation_${quotationNumber}.pdf`);
        });
    };

    return (
        <div className="quotation-container">
            <h2>Quotation Management</h2>
            <div ref={pdfRef} className="quotation-content">
                <div className="shop-selection">
                    <h5>Select Shop</h5>
                    <select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
                        <option value="">-- Select Shop --</option>
                        {shopList.map(shop => (
                            <option key={shop.id} value={shop.id}>{shop.name} - {shop.owner}</option>
                        ))}
                    </select>
                    <ul>
                        {selectedShop && <li>{shopList.find(shop => shop.id === parseInt(selectedShop))?.name}</li>}
                    </ul>
                </div>
                <div className="product-section">
                    <h5>Select Products</h5>
                    <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        <option value="">-- Select Product --</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
                        ))}
                    </select>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                    <button onClick={addProduct}>Add Product</button>
                    <ul>
                        {selectedProducts.map((product, index) => (
                            <li key={index}>
                                {product.name} - {product.quantity} x ${product.price} = ${product.total}
                                <button onClick={() => removeProduct(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="quotation-summary">
                <h4>Summary</h4>
                <p><strong>Subtotal:</strong> ${selectedProducts.reduce((sum, p) => sum + p.total, 0).toFixed(2)}</p>
                <p><strong>Tax (10%):</strong> ${(selectedProducts.reduce((sum, p) => sum + p.total, 0) * 0.10).toFixed(2)}</p>
                <p><strong>Total:</strong> ${(selectedProducts.reduce((sum, p) => sum + p.total, 0) * 1.10).toFixed(2)}</p>
            </div>
            <button onClick={saveQuotation}>Save Quotation</button>
            <button onClick={downloadPDF}>Download PDF</button>
        </div>
    );
};

export default QuotationPage;













































// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
// import './QuotationPage.css';

// const QuotationPage = () => {
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [quotationList, setQuotationList] = useState([]);
//     const [shopList, setShopList] = useState([]);
//     const [selectedShop, setSelectedShop] = useState('');
//     const pdfRef = useRef();

//     const [quotationNumber] = useState('QT12345');
//     const [quotationDate] = useState(new Date().toISOString().split('T')[0]);
//     const [quotationTerms] = useState('Payment due within 30 days.');

//     useEffect(() => {
//         fetchProducts();
//         fetchShops();
//         fetchQuotations();
//     }, []);

//     const fetchShops = async () => {
//         try {
//             const response = await axios.get('http://localhost:3002/api/v1.0/shop/getAllShops');
//             setShopList(Array.isArray(response.data) ? response.data : []);
//         } catch (error) {
//             console.error('Error fetching shops:', error);
//             setShopList([]);
//         }
//     };

//     const fetchProducts = async () => {
//         try {
//             const response = await axios.get('http://localhost:3002/api/v1.0/product/getAllProducts');
//             setProducts(Array.isArray(response.data) ? response.data : []);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//             setProducts([]);
//         }
//     };

//     const fetchQuotations = async () => {
//         try {
//             const response = await axios.get('http://localhost:3002/api/v1.0/quotation/getallquotation');
//             setQuotationList(Array.isArray(response.data) ? response.data : []);
//         } catch (error) {
//             console.error('Error fetching quotations:', error);
//             setQuotationList([]);
//         }
//     };

//     const addProduct = () => {
//         const selectedProductData = products.find(product => product.id === parseInt(selectedProduct));
//         if (!selectedProductData) return;

//         const total = selectedProductData.price * quantity;
//         setProducts([...products, {
//             productId: selectedProductData.id,
//             name: selectedProductData.name,
//             price: selectedProductData.price,
//             quantity,
//             total
//         }]);
//         setQuantity(1);
//     };

//     const removeProduct = (index) => {
//         setProducts(products.filter((_, i) => i !== index));
//     };

//     const saveQuotation = async () => {
//         const selectedShopData = shopList.find(shop => shop.id === parseInt(selectedShop));
//         if (!selectedShopData) {
//             alert('Please select a valid shop.');
//             return;
//         }

//         const quotationData = {
//             quotationNumber,
//             quotationDate,
//             quotationTerms,
//             shopId: selectedShopData.id,
//             shopName: selectedShopData.name,
//             shopOwner: selectedShopData.owner,
//             shopAddress: selectedShopData.address,
//             products
//         };

//         try {
//             await axios.post('http://localhost:3002/api/v1.0/quotation/quotation', quotationData);
//             alert('Quotation Saved Successfully');
//             fetchQuotations();
//         } catch (error) {
//             console.error('Error saving quotation:', error);
//         }
//     };

//     const deleteQuotation = async (id) => {
//         try {
//             await axios.delete(`http://localhost:3002/api/v1.0/quotation/${id}`);
//             alert('Quotation Deleted');
//             fetchQuotations();
//         } catch (error) {
//             console.error('Error deleting quotation:', error);
//         }
//     };

//     const downloadPDF = () => {
//         const input = pdfRef.current;
//         html2canvas(input).then(canvas => {
//             const imgData = canvas.toDataURL('image/png');
//             const pdf = new jsPDF('p', 'mm', 'a4');
//             pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
//             pdf.save(`Quotation_${quotationNumber}.pdf`);
//         });
//     };

//     return (
//         <div className="quotation-container">
//             <h2>Quotation Management</h2>
//             <div ref={pdfRef} className="quotation-content">
//                 <div className="shop-selection">
//                     <h5>Select Shop</h5>
//                     <select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)}>
//                         <option value="">-- Select Shop --</option>
//                         {Array.isArray(shopList) && shopList.length > 0 ? (
//                             shopList.map(shop => (
//                                 <option key={shop.id} value={shop.id}>{shop.name} - {shop.owner}</option>
//                             ))
//                         ) : (
//                             <option disabled>No Shops Available</option>
//                         )}
//                     </select>
//                 </div>
//                 <div className="product-section">
//                     <h5>Select Products</h5>
//                     <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
//                         <option value="">-- Select Product --</option>
//                         {products.map(product => (
//                             <option key={product.id} value={product.id}>{product.name} - ${product.price}</option>
//                         ))}
//                     </select>
//                     <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
//                     <button onClick={addProduct}>Add Product</button>
//                 </div>
//                 <h5>Selected Products</h5>
//                 <ul>
//                     {products.map((product, index) => (
//                         <li key={index}>{product.name} - {product.quantity} x ${product.price} = ${product.total}
//                             <button onClick={() => removeProduct(index)}>Remove</button>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//             <button onClick={saveQuotation}>Save Quotation</button>
//             <button onClick={downloadPDF}>Download PDF</button>
//         </div>
//     );
// };

// export default QuotationPage;












































// import React, { useState } from 'react';
// import './QuotationPage.css';

// const QuotationPage = () => {
//     const [products, setProducts] = useState([]);
//     const [selectedProduct, setSelectedProduct] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [quotationNumber] = useState('QT12345');
//     const [quotationDate] = useState('2024-12-16');
//     const [quotationTerms] = useState('Payment due within 30 days.');

//     const productList = [
//         { id: 1, name: 'Product 1', price: 100 },
//         { id: 2, name: 'Product 2', price: 150 },
//         { id: 3, name: 'Product 3', price: 200 }
//     ];

//     const addProduct = () => {
//         const selectedProductData = productList.find(product => product.id === parseInt(selectedProduct));
//         const total = selectedProductData.price * quantity;

//         setProducts([
//             ...products,
//             {
//                 id: selectedProductData.id,
//                 name: selectedProductData.name,
//                 price: selectedProductData.price,
//                 quantity,
//                 total
//             }
//         ]);
//         setQuantity(1); // Reset quantity input
//     };

//     const removeProduct = (index) => {
//         const updatedProducts = products.filter((_, i) => i !== index);
//         setProducts(updatedProducts);
//     };

//     const getSubtotal = () => {
//         return products.reduce((sum, product) => sum + product.total, 0);
//     };

//     const getTax = () => {
//         return getSubtotal() * 0.10;
//     };

//     const getTotal = () => {
//         return getSubtotal() + getTax();
//     };

//     return (
//         <div className="quotation-container">
//             <div className="shop-info">
//                 <h4>Shop Information</h4>
//                 <p><strong>Shop Name:</strong> ABC Store</p>
//                 <p><strong>Owner:</strong> John Doe</p>
//                 <p><strong>Address:</strong> 123 Main St, City</p>
//             </div>

//             <div className="quotation-details">
//                 <h5>Quotation Details</h5>
//                 <div className="form-group">
//                     <label htmlFor="quotation-number">Quotation Number</label>
//                     <input type="text" id="quotation-number" value={quotationNumber} readOnly />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="quotation-date">Date</label>
//                     <input type="date" id="quotation-date" value={quotationDate} readOnly />
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="quotation-terms">Terms</label>
//                     <textarea id="quotation-terms" rows="4" value={quotationTerms} readOnly></textarea>
//                 </div>
//             </div>

//             <div className="product-section">
//                 <h5>Select Products</h5>
//                 <div className="form-group">
//                     <label htmlFor="product-select">Product</label>
//                     <select id="product-select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
//                         <option value="">-- Select Product --</option>
//                         {productList.map(product => (
//                             <option key={product.id} value={product.id}>
//                                 {product.name} - ${product.price}
//                             </option>
//                         ))}
//                     </select>
//                 </div>
//                 <div className="form-group">
//                     <label htmlFor="quantity">Quantity</label>
//                     <input type="number" id="quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
//                 </div>
//                 <button onClick={addProduct}>Add Product</button>
//             </div>

//             <div className="quotation-products">
//                 <h5>Selected Products</h5>
//                 <table id="product-list">
//                     <thead>
//                         <tr>
//                             <th>Product</th>
//                             <th>Quantity</th>
//                             <th>Price</th>
//                             <th>Total</th>
//                             <th>Action</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {products.map((product, index) => (
//                             <tr key={index}>
//                                 <td>{product.name}</td>
//                                 <td>{product.quantity}</td>
//                                 <td>${product.price}</td>
//                                 <td>${product.total}</td>
//                                 <td><button onClick={() => removeProduct(index)}>Remove</button></td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="quotation-summary">
//                 <h4>Summary</h4>
//                 <p><strong>Subtotal:</strong> ${getSubtotal().toFixed(2)}</p>
//                 <p><strong>Tax (10%):</strong> ${getTax().toFixed(2)}</p>
//                 <p><strong>Total:</strong> ${getTotal().toFixed(2)}</p>
//             </div>

//             <div className="actions quotation">
//                 <button onClick={() => alert('Quotation Saved')}>Save Quotation</button>
//                 <button onClick={() => alert('PDF Generated')}>Generate PDF</button>
//             </div>
//         </div>
//     );
// };

// export default QuotationPage;
