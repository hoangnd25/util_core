export function setLocal(key: string, value: any): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Do Nothing
  }
}

export function getLocal(key: string): any {
  let value: any = null;

  try {
    value = window.localStorage.getItem(key);
    value = JSON.parse(value);
  } catch (e) {
    // Do Nothing
  }

  return value;
}

export function setSession(key: string, value: any): void {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // Do Nothing
  }
}

export function getSession(key: string): any {
  let value: any = null;

  try {
    value = window.sessionStorage.getItem(key);
    value = JSON.parse(value);
  } catch (e) {
    // Do Nothing
  }

  return value;
}

export function setStorage(key: string, value: any, persist = false): void {
  setSession(key, value);

  if (persist) {
    setLocal(key, value);
  }
}

export function getStorage(key: string): any {
  return getSession(key) || getLocal(key) || null;
}
