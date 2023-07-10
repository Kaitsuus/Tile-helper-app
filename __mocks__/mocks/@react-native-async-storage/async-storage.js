let cache = {};
export default {
  setItem: (key, value) => {
    return new Promise((resolve, reject) => {
      return (typeof key !== 'string' || typeof value !== 'string')
        ? reject(new Error('key and value must be string'))
        : resolve(cache[key] = value);
    });
  },
  getItem: (key, value) => {
    return new Promise((resolve) => {
      return cache.hasOwnProperty(key)
        ? resolve(cache[key])
        : resolve(null)
    });
  },
};
