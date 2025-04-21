export const clear = async (key) => {
    try {
      if (typeof window === "undefined") return false; // Ensure it's client-side
  
      if (key === undefined) {
        localStorage.clear();
      } else {
        localStorage.removeItem(key);
      }
      return true;
    } catch (error) {
      throw new Error('There was an error clearing the storage');
    }
  };
  