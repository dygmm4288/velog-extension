export function select(parent = document) {
  return (selector) => parent.querySelector(selector);
}
export function selectAll(parent = document) {
  return (selector) => parent.querySelectorAll(selector);
}
