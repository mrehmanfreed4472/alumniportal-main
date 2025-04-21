export const setItem = async (key, value) => {
    if (typeof window === "undefined") return false; // Ensure it's running in the browser
  
    if (value === null) {
      throw new Error('invalid-value');
    }
  
    if (key === null) {
      throw new Error('invalid-key');
    }
  
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      throw new Error('There was an error storing data in localStorage');
    }
  };
  