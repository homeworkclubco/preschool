// Import all styles
import './styles/index.css';

// Import all web components
import './components/dropdown/dropdown.js';
import './components/accordion-item/accordion-item.ts';
import './components/accordion/accordion.ts';

// Import and auto-initialize AOS
// import AOS from './utilities/aos/aos.js';

// // Auto-initialize AOS on DOM ready
// AOS.init({
//     rootMargin: '0px 0px -10% 0px',
// });

// Export components for programmatic use
export { default as AOS } from './utilities/aos/aos.js';
export { Dropdown } from './components/dropdown/dropdown.js';
export { HcAccordion } from './components/accordion/accordion.ts';
export { HcAccordionItem } from './components/accordion-item/accordion-item.ts';
