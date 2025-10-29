/**
 * Generate initial array with elements as objects
 * This array will be extended later with element metadata
 */
export default () => {
  const elements = document.querySelectorAll('[data-aos]');
  return Array.from(elements, node => ({ node }));
};
