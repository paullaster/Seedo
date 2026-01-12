export const getGeoLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<{ address: string; placeId: string }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real app, fetch from Google Maps / Nominatim here.
  // For prototype, return a mock address based on lat/lng "zone".
  
  const zones = ['Kiambu', 'Eldoret', 'Nakuru', 'Meru', 'Machakos'];
  const randomZone = zones[Math.floor(Math.random() * zones.length)];
  
  return {
    address: `Farm Block ${Math.floor(Math.random() * 100)}, ${randomZone} Road, Kenya`,
    placeId: `PID-${Date.now()}`
  };
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return parseFloat(d.toFixed(1));
};

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
