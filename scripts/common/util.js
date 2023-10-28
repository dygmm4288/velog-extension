export function select(parent = document) {
  return (selector) => parent.querySelector(selector);
}
export function selectAll(parent = document) {
  return (selector) => parent.querySelectorAll(selector);
}
export function append(parent, childs) {
  if (Array.isArray(childs)) {
    childs.forEach((child) => parent.appendChild(child));
    return parent;
  }
  parent.appendChild(childs);
  return parent;
}

export function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return { [key]: value };
}
export function getStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function create(tag) {
  return document.createElement(tag);
}
