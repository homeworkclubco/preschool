/**
 * Preschool AOS (Animate on Scroll)
 * Standalone entry point for scroll animations
 */

// Import AOS styles
import './aos.css';

import AOS from './utilities/aos/aos.js';

// Auto-initialize AOS on DOM ready
AOS.init();

// Export AOS API for manual control
export default AOS;

// Named exports for convenience
export const {
    init,
    refresh,
    disable,
    on,
    getState,
    getElements,
    getObservers
} = AOS;
