export const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('bidtounsi_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export async function fetchVehicles() {
  try {
    const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as HeadersInit;
    const res = await fetch(`${API_BASE}/api/vehicles`, { headers });
    if (!res.ok) throw new Error('Bad response');
    const data = await res.json();
    // Normalize to frontend shape if necessary
    return data.map((v: any) => ({
      id: v._id || v.id,
      title: v.title,
      description: v.description,
      vehicleType: v.vehicleType || v.type || '',
      startingPrice: v.price ?? v.startingPrice ?? 0,
      images: v.images || [],
      sellerId: v.seller?._id || v.seller || v.sellerId,
      sellerName: v.seller?.email || v.sellerName || '',
      status: v.status || 'active',
      endDate: v.endDate,
      createdAt: v.createdAt,
    }));
  } catch (e) {
    // Fallback to localStorage
    const ls = localStorage.getItem('bidtounsi_vehicles') || '[]';
    return JSON.parse(ls);
  }
}

export async function createVehicle(payload: any) {
  try {
    const headers = { 'Content-Type': 'application/json', ...getAuthHeaders() } as HeadersInit;
    const res = await fetch(`${API_BASE}/api/vehicles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Bad response');
    return await res.json();
  } catch (e) {
    // Fallback to localStorage
    const key = 'bidtounsi_vehicles';
    const all = JSON.parse(localStorage.getItem(key) || '[]');
    const newV = { ...payload, id: Date.now().toString(), createdAt: new Date().toISOString() };
    all.push(newV);
    localStorage.setItem(key, JSON.stringify(all));
    return newV;
  }
}
