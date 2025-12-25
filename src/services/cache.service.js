const cache = new Map();

export const cacheService = {
  get: (key) => {
    const item = cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      cache.delete(key);
      return null;
    }
    
    return item.data;
  },
  
  set: (key, data, ttlMs = 300000) => { // 5 minutes default
    cache.set(key, {
      data,
      expiry: Date.now() + ttlMs
    });
  },
  
  delete: (key) => {
    cache.delete(key);
  },
  
  clear: () => {
    cache.clear();
  }
};
