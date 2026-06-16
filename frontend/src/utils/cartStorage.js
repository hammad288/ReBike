/**
 * Strips heavy base64 image data from a bike object before saving to localStorage.
 * Only keeps the first image (and only if it's a URL, not a base64 string).
 * Full bike objects stay in React state; only slim data goes to localStorage.
 */
export const slimCartItem = (bike) => ({
  _id: bike._id,
  brand: bike.brand,
  model: bike.model,
  year: bike.year,
  price: bike.price,
  condition: bike.condition,
  kmDriven: bike.kmDriven,
  location: bike.location,
  // Only keep first image, and skip it if it's a huge base64 string (>10KB)
  images: bike.images?.[0] && bike.images[0].length < 10000
    ? [bike.images[0]]
    : [],
});

/**
 * Save cart to localStorage with slim data to avoid QuotaExceededError.
 */
export const saveCartToStorage = (cartItems) => {
  try {
    const slim = cartItems.map(slimCartItem);
    localStorage.setItem('cart', JSON.stringify(slim));
  } catch (e) {
    console.warn('Cart could not be saved to localStorage:', e.message);
  }
};
