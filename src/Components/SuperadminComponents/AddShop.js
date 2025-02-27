import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import './css/AddShop.css';

function AddShop({ onShopAdded }) {
  const { id} = useParams();  
  console.log("Current User ID:", id);
// State variables for form fields
  const [shopName, setShopName] = useState('');
  const [shopType, setShopType] = useState('');
  const [shopOwnerName, setShopOwnerName] = useState('');
  const [shopEmailId, setShopEmailId] = useState('');
  const [shopMobileNumber, setShopMobileNumber] = useState('');
  const [shopCity, setShopCity] = useState('');
  const [shopCityZipCode, setShopCityZipCode] = useState('');
  const [packageType, setPackageType] = useState('');
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accountId]= useState(id)



  // Format `shopMobileNumber` before sending to backend
  const formatMobileNumber = (number) => {
    return number.replace(/^\+91/, "").trim(); // Remove `+91` if present
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Format the mobile number before sending
    let formattedMobileNumber = formatMobileNumber(shopMobileNumber);

    const shopData = {
      shopName,
      shopType,
      shopOwnerName,
      shopEmailId,
      shopMobileNumber: formattedMobileNumber, //  Send formatted number
      shopCity,
      shopCityZipCode,
      accountId,
      packageType,
    };

    console.log(" Sending shop data:", shopData); // Debug request payload

    // Validate required fields before sending
    if (!shopName || !shopType || !shopOwnerName || !shopEmailId || !formattedMobileNumber || !shopCity || !shopCityZipCode || !packageType) {
      setMessage({ text: "All fields are required. Please fill out the form.", type: "error" });
      console.error(" Missing required fields:", shopData);
      setIsLoading(false);
      return;
    }

    try {
      // Send data to backend
      const response = await axios.post(
        'http://localhost:3002/api/v1.0/shop/shop/addshop',
        shopData
      );

      console.log(" API Response:", response.data);

      if (response.status === 200) {
        setMessage({ text: 'Shop added successfully!', type: 'success' });

        // Pass the new shop data to the parent component (ShopList)
        if (onShopAdded) onShopAdded(response.data);

        // Clear form fields
        setShopName('');
        setShopType('');
        setShopOwnerName('');
        setShopEmailId('');
        setShopMobileNumber('');
        setShopCity('');
        setShopCityZipCode('');
        setPackageType('');
      } else {
        setMessage({ text: 'Error: Could not add shop.', type: 'error' });
      }
    } catch (error) {
      console.error(" API Error:", error.response?.data || error.message);

      if (error.response?.data?.reasons) {
        console.error(" Backend Validation Errors:", error.response.data.reasons);
      }

      setMessage({
        text: error.response?.data?.message || 'Error: Unable to connect to the server.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-shop-wrapper">
      {/* Title Section */}
      <div className="title-section">
        <h2>Register New Shop</h2>
      </div>

      {/* Message Section */}
      {message && (
        <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
          {message.text}
        </div>
      )}

      {/* Form Section */}
      <div className="form-section">
        <form onSubmit={handleSubmit} className="shop-form">
          <div className="row">
            <div className="field-group">
              <label htmlFor="shopName">Shop Name:</label>
              <input
                type="text"
                id="shopName"
                name="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value.trim())}
                disabled={isLoading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="shopType">Shop Type:</label>
              <select
                id="shopType"
                name="shopType"
                value={shopType}
                onChange={(e) => setShopType(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Select Shop Type</option>
                <option value="medical">Medical</option>
                <option value="general">General</option>
                <option value="bakery">Bakery</option>
                <option value="footwear">Footwear</option>
                <option value="electrical">Electrical</option>
              </select>
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="shopOwnerName">Owner Name:</label>
              <input
                type="text"
                id="shopOwnerName"
                name="shopOwnerName"
                value={shopOwnerName}
                onChange={(e) => setShopOwnerName(e.target.value.trim())}
                disabled={isLoading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="shopEmailId">Owner Email:</label>
              <input
                type="email"
                id="shopEmailId"
                name="shopEmailId"
                value={shopEmailId}
                onChange={(e) => setShopEmailId(e.target.value.trim())}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="shopMobileNumber">Contact Number:</label>
              <input
                type="text"
                id="shopMobileNumber"
                name="shopMobileNumber"
                value={shopMobileNumber}
                onChange={(e) => setShopMobileNumber(e.target.value.replace(/\D/g, ''))} // Allow only numbers
                disabled={isLoading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="shopCity">City:</label>
              <input
                type="text"
                id="shopCity"
                name="shopCity"
                value={shopCity}
                onChange={(e) => setShopCity(e.target.value.trim())}
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="field-group">
              <label htmlFor="shopCityZipCode">City Zip Code:</label>
              <input
                type="text"
                id="shopCityZipCode"
                name="shopCityZipCode"
                value={shopCityZipCode}
                onChange={(e) => setShopCityZipCode(e.target.value.trim())}
                disabled={isLoading}
                required
              />
            </div>

            <div className="field-group">
              <label htmlFor="packageType">Package Type:</label>
              <select
                id="packageType"
                name="packageType"
                value={packageType}
                onChange={(e) => setPackageType(e.target.value)}
                disabled={isLoading}
                required
              >
                <option value="">Select Package</option>
                <option value="basic">Basic</option>
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register Shop'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddShop;



































// // import React, { useState, useEffect } from "react";

// // import { useLocation, useParams } from "react-router-dom"; //  Import useLocation
// import axios from "axios";
// import "./css/AddShop.css";

// import React, { useEffect, useState } from "react";
// import { useLocation, useParams, useNavigate } from "react-router-dom";


// function AddShop({ onShopAdded }) {
//   // const location = useLocation();
//   // const { account_id } = useParams(); // Get account_id from URL
//   // const accountId = account_id || location.state?.accountId || "";

//   const location = useLocation();
//   const params = useParams();
//   const navigate = useNavigate();

  

//   // State variables for form fields
//   const [shopName, setShopName] = useState("");
//   const [shopType, setShopType] = useState("");
//   const [shopOwnerName, setShopOwnerName] = useState("");
//   const [shopEmailId, setShopEmailId] = useState("");
//   const [shopMobileNumber, setShopMobileNumber] = useState("");
//   const [shopCity, setShopCity] = useState("");
//   const [shopCityZipCode, setShopCityZipCode] = useState("");
//   const [packageType, setPackageType] = useState("");
//   const [message, setMessage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [accountId, setAccountId] = useState(null);



//   console.log("Params account_id:", params.account_id);
//   console.log("Location state accountId:", location.state?.accountId);
//   console.log("Extracted accountId before validation:", accountId);

//   useEffect(() => {
//     let id = params.account_id || location.state?.accountId; // Get account ID from URL or state
    
//     if (id !== undefined && id !== null) {
//       const numericId = Number(id);
//       if (!isNaN(numericId)) {
//         setAccountId(numericId); // Set valid accountId
//       } else {
//         console.error("Error: accountId is invalid");
//         alert("Account ID must be a number.");
//         navigate("/"); // Redirect if invalid
//       }
//     }
//   }, [params.account_id, location.state, navigate]);


  
//   // Function to format mobile number
//   const formatMobileNumber = (number) => number.replace(/^\+91/, "").trim();

//   // Handler for form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage(null);

//     // Format the mobile number before sending
//     let formattedMobileNumber = formatMobileNumber(shopMobileNumber);


//     const shopData = {
//       shopName,
//       shopOwnerName,
//       shopCity,
//       shopCityZipCode,
//       shopMobileNumber: formattedMobileNumber,
//       shopEmailId,
//       shopType,
//       accountId,
//       // accountId, // Automatically passing accountId
//       packageType,
//     };

//     console.log(" Sending shop data:", shopData);

//     // Validate required fields before sending
//     if (
//       !shopName ||
//       !shopType ||
//       !shopOwnerName ||
//       !shopEmailId ||
//       !formattedMobileNumber ||
//       !shopCity ||
//       !shopCityZipCode ||
//       !packageType
//     ) {
//       setMessage({
//         text: "All fields are required. Please fill out the form.",
//         type: "error",
//       });
//       console.error(" Missing required fields:", shopData);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       // Send data to backend
//       const response = await axios.post(
//         "http://localhost:3002/api/v1.0/shop/shop/addshop",
//         shopData
//       );

//       console.log("API Response:", response.data);

//       if (response.status === 200) {
//         setMessage({ text: "Shop added successfully!", type: "success" });

//         if (onShopAdded) onShopAdded(response.data); // Notify parent component

//         // Clear form fields
//         setShopName("");
//         setShopType("");
//         setShopOwnerName("");
//         setShopEmailId("");
//         setShopMobileNumber("");
//         setShopCity("");
//         setShopCityZipCode("");
//         setPackageType("");
//       } else {
//         setMessage({ text: "Error: Could not add shop.", type: "error" });
//       }
//     } catch (error) {
//       console.error(" API Error:", error.response?.data || error.message);
//       setMessage({
//         text:
//           error.response?.data?.message || "Error: Unable to connect to server.",
//         type: "error",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
 
//  // Handle Save
//  const handleSave = () => {
//   console.log("Shop Details:", { accountId, shopName });
//   alert(`Shop added successfully for Account ID: ${accountId}`);
// };



//   return (
//     <div className="add-shop-wrapper">
//       {/* Title Section */}
//       <div className="title-section">
//         <h2>Register New Shop</h2>
//       </div>

//       {/* Message Section */}
//       {message && (
//         <div className={`message ${message.type === "success" ? "success" : "error"}`}>
//           {message.text}
//         </div>
//       )}

//       {/* Form Section */}
//       <div className="form-section">
//         <form onSubmit={handleSubmit} className="shop-form">
//           <div className="row">
//             <div className="field-group">
//               <label htmlFor="shopName">Shop Name:</label>
//               <input
//                 type="text"
//                 id="shopName"
//                 value={shopName}
//                 onChange={(e) => setShopName(e.target.value.trim())}
//                 disabled={isLoading}
//                 required
//               />
//             </div>

//             <div className="field-group">
//               <label htmlFor="shopType">Shop Type:</label>
//               <select
//                 id="shopType"
//                 value={shopType}
//                 onChange={(e) => setShopType(e.target.value)}
//                 disabled={isLoading}
//                 required
//               >
//                 <option value="">Select Shop Type</option>
//                 <option value="medical">Medical</option>
//                 <option value="general">General</option>
//                 <option value="bakery">Bakery</option>
//                 <option value="footwear">Footwear</option>
//                 <option value="electrical">Electrical</option>
//               </select>
//             </div>
//           </div>

//           <div className="row">
//             <div className="field-group">
//               <label htmlFor="shopOwnerName">Owner Name:</label>
//               <input
//                 type="text"
//                 id="shopOwnerName"
//                 value={shopOwnerName}
//                 onChange={(e) => setShopOwnerName(e.target.value.trim())}
//                 disabled={isLoading}
//                 required
//               />
//             </div>

//             <div className="field-group">
//               <label htmlFor="shopEmailId">Owner Email:</label>
//               <input
//                 type="email"
//                 id="shopEmailId"
//                 value={shopEmailId}
//                 onChange={(e) => setShopEmailId(e.target.value.trim())}
//                 disabled={isLoading}
//                 required
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="field-group">
//               <label htmlFor="shopMobileNumber">Contact Number:</label>
//               <input
//                 type="text"
//                 id="shopMobileNumber"
//                 value={shopMobileNumber}
//                 onChange={(e) => setShopMobileNumber(e.target.value.replace(/\D/g, ""))}
//                 disabled={isLoading}
//                 required
//               />
//             </div>

//             <div className="field-group">
//               <label htmlFor="shopCity">City:</label>
//               <input
//                 type="text"
//                 id="shopCity"
//                 value={shopCity}
//                 onChange={(e) => setShopCity(e.target.value.trim())}
//                 disabled={isLoading}
//                 required
//               />
//             </div>
//           </div>

//           <div className="row">
//             <div className="field-group">
//               <label htmlFor="shopCityZipCode">City Zip Code:</label>
//               <input
//                 type="text"
//                 id="shopCityZipCode"
//                 value={shopCityZipCode}
//                 onChange={(e) => setShopCityZipCode(e.target.value.trim())}
//                 disabled={isLoading}
//                 required
//               />
//             </div>

//             <div className="field-group">
//               <label htmlFor="packageType">Package Type:</label>
//               <select
//                 id="packageType"
//                 value={packageType}
//                 onChange={(e) => setPackageType(e.target.value)}
//                 disabled={isLoading}
//                 required
//               >
//                 <option value="">Select Package</option>
//                 <option value="basic">Basic</option>
//                 <option value="standard">Standard</option>
//                 <option value="premium">Premium</option>
//               </select>
//             </div>
//           </div>

//           <button type="submit" className="submit-button" disabled={isLoading}>
//             {isLoading ? "Registering..." : "Register Shop"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AddShop;












