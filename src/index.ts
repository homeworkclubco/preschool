/**
 * Preschool Component Library
 *
 * Tree-shakeable exports - components auto-register when imported
 *
 * @example
 * // Import only what you need:
 * import { Dropdown } from 'preschool';
 * // Now <hc-dropdown> is available in your HTML
 *
 * @example
 * // Import multiple components:
 * import { Dropdown, HcAccordion, HcAccordionItem } from 'preschool';
 *
 * @example
 * // Import everything (not recommended unless you need all):
 * import * as Preschool from 'preschool';
 */

// Export components - they auto-register when imported
export { Dropdown } from './components/dropdown/dropdown.ts';
export { HcAccordion } from './components/accordion/accordion.ts';
export { HcAccordionItem } from './components/accordion-item/accordion-item.ts';
export { HcDrawer } from './components/drawer/drawer.ts';
export { PsShare } from './components/share/ps-share.ts';

// Export utilities
export { default as AOS } from './utilities/aos/aos.ts';
