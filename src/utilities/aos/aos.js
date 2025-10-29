/**
 * *******************************************************
 * AOS (Animate on scroll) - Modern Intersection Observer
 * Animate elements on scroll in both directions
 * *******************************************************
 */

import { debounce } from 'es-toolkit';
import observer from './libs/observer';
import handleIntersection from './helpers/handleIntersection';
import prepare from './helpers/prepare';
import elements from './helpers/elements';

/**
 * Private variables
 */
let observerInstances = [];
let resizeObserver = null;
let initialized = false;

/**
 * Default options
 */
let options = {
    rootMargin: '0px 0px -10% 0px', // Trigger when element is 10% from bottom of viewport
    threshold: 0,
    once: false,
    startEvent: 'DOMContentLoaded',
    animatedClassName: 'aos-animate',
    initClassName: 'aos-init',
    useClassNames: false,
    disableMutationObserver: false,
};

/**
 * Setup ResizeObserver to watch for element size changes
 */
const setupResizeObserver = allElements => {
    // Disconnect existing resize observer
    resizeObserver?.disconnect();

    // Create new ResizeObserver
    resizeObserver = new ResizeObserver(
        debounce(() => {
            if (initialized) createObservers();
        }, 150)
    );

    // Observe all AOS elements
    allElements.forEach(element => {
        resizeObserver.observe(element);
    });
};

/**
 * Create Intersection Observers for element groups
 */
const createObservers = function () {
    // Disconnect existing observers
    observerInstances.forEach(obs => obs.disconnect());
    observerInstances = [];

    // Get elements and prepare them
    const $elements = elements();
    const observerGroups = prepare($elements, options);

    // Collect all elements for ResizeObserver
    const allElements = [];

    // Create an observer for each unique configuration
    observerGroups.forEach(config => {
        const { rootMargin, threshold, elements: groupElements } = config;

        const observerOptions = {
            root: null,
            rootMargin,
            threshold,
        };

        const intersectionObserver = new IntersectionObserver(
            handleIntersection,
            observerOptions
        );

        // Observe all elements in this group
        groupElements.forEach(element => {
            intersectionObserver.observe(element);
            allElements.push(element);
        });

        observerInstances.push(intersectionObserver);
    });

    // Setup ResizeObserver for all elements
    setupResizeObserver(allElements);
};

/**
 * Refresh AOS - recreate observers
 */
const refresh = (initialize = false) => {
    if (initialize) initialized = true;
    initialized && createObservers();
};

/**
 * Disable AOS - disconnect all observers and remove classes
 */
const disable = () => {
    // Disconnect all observers
    observerInstances.forEach(obs => obs.disconnect());
    observerInstances = [];

    // Disconnect ResizeObserver
    resizeObserver?.disconnect();
    resizeObserver = null;

    // Remove classes from all elements
    document.querySelectorAll('[data-aos]').forEach(element => {
        options.initClassName &&
            element.classList.remove(options.initClassName);
        options.animatedClassName &&
            element.classList.remove(options.animatedClassName);
        delete element._aosMeta;
    });

    initialized = false;
};

/**
 * Initialize AOS
 */
const init = (settings = {}) => {
    // Merge options
    options = { ...options, ...settings };

    // Check MutationObserver support
    if (!options.disableMutationObserver && !observer.isSupported()) {
        console.info(
            'AOS: MutationObserver is not supported. ' +
                'Call refresh() manually when adding new elements.'
        );
        options.disableMutationObserver = true;
    }

    // Setup MutationObserver to detect new elements
    !options.disableMutationObserver && observer.ready('[data-aos]', refresh);

    // Handle initialization timing
    const startObserving = () => {
        createObservers();
        initialized = true;
    };

    const { startEvent } = options;
    const isDocReady = ['complete', 'interactive'].includes(
        document.readyState
    );

    if (startEvent === 'DOMContentLoaded' && isDocReady) {
        startObserving();
    } else {
        const eventName = startEvent === 'load' ? 'load' : startEvent;
        const target = startEvent === 'load' ? window : document;
        target.addEventListener(eventName, startObserving);
    }
};

/**
 * Event listeners for AOS events
 */
const eventListeners = new Map();

/**
 * Add event listener
 */
const on = (eventName, callback) => {
    if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
    }
    eventListeners.get(eventName).push(callback);
    return api;
};

/**
 * Get current state
 */
const getState = () => ({
    initialized,
    elementCount: document.querySelectorAll('[data-aos]').length,
    observerCount: observerInstances.length,
    options: { ...options },
});

/**
 * Get all AOS elements
 */
const getElements = () => Array.from(document.querySelectorAll('[data-aos]'));

/**
 * Get observer instances
 */
const getObservers = () => [...observerInstances];

/**
 * Public API object
 */
const api = {
    init: settings => {
        init(settings);
        return api;
    },
    refresh: initialize => {
        refresh(initialize);
        return api;
    },
    disable: () => {
        disable();
        return api;
    },
    on,
    getState,
    getElements,
    getObservers,
};

/**
 * Export Public API
 */
export default api;
