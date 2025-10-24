// Import all styles
import './styles/index.css';

// Import all web components
import './components/dropdown.js';

// Import and auto-initialize AOS
import AOS from './utilities/aos/aos.js';

// Auto-initialize AOS on DOM ready
AOS.init();

// Export components for programmatic use
export { Dropdown } from './components/dropdown.js';

// Export AOS functions for manual control and Lenis access
// export {
//     init as initAOS,
//     refresh as refreshAOS,
//     getLenis,
//     scrollTo,
//     destroy as destroyAOS,
// } from './components/aos.js';
