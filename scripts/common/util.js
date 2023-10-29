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

export async function setStorage(key, value) {
  await chrome.storage.local.set({ [key]: JSON.stringify(value) });
  return { [key]: value };
}
export async function getStorage(key) {
  return await chrome.storage.local.get([key]);
}

export function create(tag) {
  return document.createElement(tag);
}
