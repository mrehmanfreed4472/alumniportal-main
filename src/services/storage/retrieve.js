export async function retrieve(key) {
  if (typeof window === "undefined") return undefined; // Ensure it's client-side

  if (key === null) {
    throw new Error("invalid-key");
  }

  try {
    const data = localStorage.getItem(key);
    if (data !== null && data !== undefined) {
      return JSON.parse(data);
    } else {
      return undefined;
    }
  } catch (error) {
    throw new Error("There was an error retrieving data from localStorage");
  }
}
