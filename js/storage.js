export const BASKET_KEY="basket";
export function readFromLS(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

export function saveToLS(key,object) {
    localStorage.setItem(key, JSON.stringify(object))
}
