/**
 * Get inline option with a fallback
 *
 * @param el - DOM element
 * @param key - Option key (without 'data-aos-' prefix)
 * @param fallback - Default (fallback) value
 * @returns Option value from inline attributes or fallback
 */
export default function getOption<T>(el: Element, key: string, fallback: T): T | string | number | boolean {
  const attr = el.getAttribute(`data-aos-${key}`);

  // Return fallback if attribute doesn't exist
  if (attr === null) return fallback;

  // Handle boolean strings
  if (attr === 'true') return true;
  if (attr === 'false') return false;

  // Handle numbers
  const num = Number(attr);
  if (!Number.isNaN(num) && attr !== '') return num;

  // Return string value
  return attr;
}
