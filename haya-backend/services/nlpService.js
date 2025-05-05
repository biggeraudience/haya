// A simple NLP parser using keyword matching.
const parseIntent = async (query) => {
    query = query.toLowerCase();
    if (query.includes("predict") || query.includes("forecast") || query.includes("sales")) {
      // For sales predictions, we return a dummy sales_shift.
      return { intent: "sales_prediction", entities: { sales_shift: 100 } };
    } else if (query.includes("price") || query.includes("pricing")) {
      // Try to extract a cost value (e.g., "$50") using regex.
      const costMatch = query.match(/\$\s?(\d+(\.\d+)?)/);
      const cost = costMatch ? parseFloat(costMatch[1]) : null;
      // Check if quality is mentioned.
      const quality = query.includes("high quality") ? "high" : "medium";
      return { intent: "pricing_advice", entities: { cost, quality } };
    } else {
      return { intent: "unknown", entities: {} };
    }
  };
  
  module.exports = { parseIntent };
  