/**
 * *******************************************************
 * AOS (Animate on scroll) - Modern Intersection Observer
 * Animate elements on scroll in both directions
 * *******************************************************
 */

import { debounce } from 'es-toolkit/function';
import observer from './libs/observer';
import handleIntersection from './helpers/handleIntersection';
import prepare, { AOSOptions, ObserverGroup } from './helpers/prepare';
import elements from './helpers/elements';
import { AOSElement } from './helpers/handleIntersection';

/**
 * Private variables
 */
let observerInstances: IntersectionObserver[] = [];
let resizeObserver: ResizeObserver | null = null;
let initialized = false;

/**
 * Default options
 */
let options: AOSOptions = {
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
const setupResizeObserver = (allElements: Element[]): void => {
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
        resizeObserver!.observe(element);
    });
};

/**
 * Create Intersection Observers for element groups
 */
const createObservers = function (): void {
    // Disconnect existing observers
    observerInstances.forEach(obs => obs.disconnect());
    observerInstances = [];

    // Get elements and prepare them
    const $elements = elements();
    const observerGroups = prepare($elements, options);

    // Collect all elements for ResizeObserver
    const allElements: Element[] = [];

    // Create an observer for each unique configuration
    observerGroups.forEach((config: ObserverGroup) => {
        const { rootMargin, threshold, elements: groupElements } = config;

        const observerOptions: IntersectionObserverInit = {
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
const refresh = (initialize = false): void => {
    if (initialize) initialized = true;
    initialized && createObservers();
};

/**
 * Disable AOS - disconnect all observers and remove classes
 */
const disable = (): void => {
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
        delete (element as AOSElement)._aosMeta;
    });

    initialized = false;
};

/**
 * Initialize AOS
 */
const init = (settings: Partial<AOSOptions> = {}): void => {
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
    const startObserving = (): void => {
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
const eventListeners = new Map<string, Array<() => void>>();

/**
 * Add event listener
 */
const on = (eventName: string, callback: () => void): AOSAPI => {
    if (!eventListeners.has(eventName)) {
        eventListeners.set(eventName, []);
    }
    eventListeners.get(eventName)!.push(callback);
    return api;
};

/**
 * Get current state
 */
const getState = (): {
    initialized: boolean;
    elementCount: number;
    observerCount: number;
    options: AOSOptions;
} => ({
    initialized,
    elementCount: document.querySelectorAll('[data-aos]').length,
    observerCount: observerInstances.length,
    options: { ...options },
});

/**
 * Get all AOS elements
 */
const getElements = (): Element[] =>
    Array.from(document.querySelectorAll('[data-aos]'));

/**
 * Get observer instances
 */
const getObservers = (): IntersectionObserver[] => [...observerInstances];

/**
 * Public API interface
 */
export interface AOSAPI {
    init: (settings?: Partial<AOSOptions>) => AOSAPI;
    refresh: (initialize?: boolean) => AOSAPI;
    disable: () => AOSAPI;
    on: (eventName: string, callback: () => void) => AOSAPI;
    getState: () => {
        initialized: boolean;
        elementCount: number;
        observerCount: number;
        options: AOSOptions;
    };
    getElements: () => Element[];
    getObservers: () => IntersectionObserver[];
}

/**
 * Public API object
 */
const api: AOSAPI = {
    init: (settings?: Partial<AOSOptions>) => {
        init(settings);
        return api;
    },
    refresh: (initialize?: boolean) => {
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
