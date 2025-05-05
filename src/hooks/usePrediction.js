// src/hooks/usePrediction.js
import { useState, useCallback } from "react";
import axios from "axios";

export const useSalesPrediction = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPrediction = useCallback(async (salesShift) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/predictions/predict-sales",
        { sales_shift: salesShift },
        { withCredentials: true }
      );
      setPrediction(response.data.prediction);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { prediction, loading, error, getPrediction };
};
