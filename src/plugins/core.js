export function debounce(callback, wait = 500, immediate = false) {
  let timeout = null;
  return function () {
    const callNow = immediate && !timeout;
    const next = () => callback.apply(this, arguments);
    clearTimeout(timeout);
    timeout = setTimeout(next, wait);
    if (callNow) next();
  };
}

export function storage(key, value, append) {
  if (key === null) localStorage.clear();
  else if (value === undefined) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (err) {
      console.log("error", "Unable to parse storage item");
      return null;
    }
  } else if (value === null) {
    return localStorage.removeItem(key);
  } else {
    if (append) {
      let oldVal = storage(key, undefined) || [];
      if (oldVal.indexOf(value) != -1) return false;
      return localStorage.setItem(key, JSON.stringify([value, ...oldVal]));
    } else {
      return localStorage.setItem(key, JSON.stringify(value));
    }
  }
}
