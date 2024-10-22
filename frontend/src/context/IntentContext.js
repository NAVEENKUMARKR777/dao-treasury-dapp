import React, { createContext, useState, useContext } from "react";

// Create Intent Context
const IntentContext = createContext();

// Intent Provider component to wrap the app
export const IntentProvider = ({ children }) => {
  const [intents, setIntents] = useState([]); // State for storing user intents
  const [loading, setLoading] = useState(false); // State to indicate loading status
  const [error, setError] = useState(null); // State for error management

  // Function to add a new intent
  const addIntent = (intent) => {
    setIntents((prevIntents) => [...prevIntents, intent]);
  };

  // Function to remove an intent
  const removeIntent = (intentId) => {
    setIntents((prevIntents) => prevIntents.filter((intent) => intent.id !== intentId));
  };

  // Function to fetch intents (could be from a smart contract or API)
  const fetchIntents = async () => {
    setLoading(true);
    try {
      // Mock fetch: Replace this with actual fetch logic (e.g., call to smart contract)
      const fetchedIntents = [
        { id: 1, name: "Intent A", status: "Scheduled" },
        { id: 2, name: "Intent B", status: "Executed" },
      ];
      setIntents(fetchedIntents);
    } catch (err) {
      setError("Failed to fetch intents.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IntentContext.Provider
      value={{
        intents,
        addIntent,
        removeIntent,
        fetchIntents,
        loading,
        error,
      }}
    >
      {children}
    </IntentContext.Provider>
  );
};

// Custom hook to access intent context
export const useIntent = () => {
  return useContext(IntentContext);
};
 
