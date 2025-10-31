/**
 * Generate initial array with elements as objects
 * This array will be extended later with element metadata
 */

export interface ElementObject {
  node: Element;
}

export default (): ElementObject[] => {
  const elements = document.querySelectorAll('[data-aos]');
  return Array.from(elements, node => ({ node }));
};
