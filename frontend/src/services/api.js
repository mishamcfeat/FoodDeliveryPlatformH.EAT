const BASE_URL = 'http://localhost:8000';

export const fetchOrders = async () => {
  const response = await fetch(`${BASE_URL}orders`);
  return response.json();
};
