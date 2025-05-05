// queryOrchestrator.js
const axios = require("axios");

// These helper functions should ideally query real endpoints or databases.
// For demonstration, they return dummy data.
const fetchNewAccountSignups = async (time) => {
  // Replace with actual query logic.
  return { count: 350 };
};

const fetchCustomerLocations = async (time) => {
  // Replace with actual query logic.
  return { US: 140, Europe: 70, Asia: 35 };
};

const fetchProductInteractions = async (time) => {
  // Replace with actual query logic.
  return { viewed: { gadgets: 210 }, add_to_cart: { apparel: 105 } };
};

const formatLocations = (locationData) => {
  // Format as "US: 40%, Europe: 20%, Asia: 15%" etc.
  let total = Object.values(locationData).reduce((sum, val) => sum + val, 0);
  return Object.entries(locationData)
    .map(([region, count]) => `${region}: ${((count / total) * 100).toFixed(1)}%`)
    .join(", ");
};

const formatProductInteractions = (productData) => {
  // Format product interactions into a sentence.
  let viewed = productData.viewed;
  let addToCart = productData.add_to_cart;
  return `viewed gadgets (${viewed.gadgets || 0}) and added apparel to cart (${addToCart.apparel || 0})`;
};

const processComplexQuery = async (parsedQuery) => {
  // For simplicity, assume we always use "this week" as the timeframe.
  const timeframe = "this week";
  const [signupData, locationData, productData] = await Promise.all([
    fetchNewAccountSignups(timeframe),
    fetchCustomerLocations(timeframe),
    fetchProductInteractions(timeframe)
  ]);

  const aggregatedResponse = `This week, ${signupData.count} new customers signed up. 
They are mainly located in: ${formatLocations(locationData)}. 
Also, among these customers, they mostly ${formatProductInteractions(productData)}. 
Maybe it's time to boost that gadget ad budget!`;

  return { message: aggregatedResponse };
};

module.exports = { processComplexQuery };
