const BASKET_KEY="basket";
function readFromLS(key) {
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveToLS(key,object) {
    localStorage.setItem(key, JSON.stringify(object))
}