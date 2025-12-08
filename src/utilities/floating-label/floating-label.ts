/**
 * Floating Label Enhancement
 *
 * Provides progressive enhancement for floating label forms:
 * - Adds .has-content class when input has value (fallback for :has() selector)
 * - Adds .is-focused class for better focus indication
 * - Works with both .floating-label-field and .floating-label-container structures
 *
 * @example
 * // Import and initialize
 * import FloatingLabel from 'preschool/utilities/floating-label';
 * FloatingLabel.init();
 *
 * @example
 * // Regular HTML markup
 * <div class="floating-label-field">
 *   <input type="text" class="input" placeholder=" " />
 *   <label>Label text</label>
 * </div>
 *
 * @example
 * // Contact Form 7 markup
 * <label class="floating-label-container">
 *   <span class="floating-label">Label text</span>
 *   [text* field-name class:input placeholder " "]
 * </label>
 */

export interface FloatingLabelAPI {
    init: () => FloatingLabelAPI;
    refresh: () => FloatingLabelAPI;
    destroy: () => FloatingLabelAPI;
}

/**
 * Private state
 */
let initialized = false;
const containers: Map<
    Element,
    {
        input: HTMLInputElement | HTMLTextAreaElement;
        handleFocus: () => void;
        handleBlur: () => void;
        handleInput: () => void;
    }
> = new Map();

/**
 * Check if input has content and update class
 */
function updateContentState(
    container: Element,
    input: HTMLInputElement | HTMLTextAreaElement
): void {
    if (input.value.trim() !== '') {
        container.classList.add('has-content');
    } else {
        container.classList.remove('has-content');
    }
}

/**
 * Add focus class for better visual feedback
 */
function createFocusHandler(container: Element): () => void {
    return function handleFocus() {
        container.classList.add('is-focused');
    };
}

/**
 * Remove focus class and update content state
 */
function createBlurHandler(
    container: Element,
    input: HTMLInputElement | HTMLTextAreaElement
): () => void {
    return function handleBlur() {
        container.classList.remove('is-focused');
        updateContentState(container, input);
    };
}

/**
 * Update content state on input
 */
function createInputHandler(
    container: Element,
    input: HTMLInputElement | HTMLTextAreaElement
): () => void {
    return function handleInput() {
        updateContentState(container, input);
    };
}

/**
 * Setup event listeners for a single container
 */
function setupContainer(container: Element): void {
    // Skip if already setup
    if (containers.has(container)) return;

    // Find the input within this container
    const input = container.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        '.input'
    );
    if (!input) return;

    // Create event handlers
    const handleFocus = createFocusHandler(container);
    const handleBlur = createBlurHandler(container, input);
    const handleInput = createInputHandler(container, input);

    // Initialize content state on page load
    updateContentState(container, input);

    // Add event listeners
    input.addEventListener('focus', handleFocus);
    input.addEventListener('blur', handleBlur);
    input.addEventListener('input', handleInput);

    // Store handlers for cleanup
    containers.set(container, {
        input,
        handleFocus,
        handleBlur,
        handleInput,
    });
}

/**
 * Initialize floating labels for all containers
 */
const init = (): FloatingLabelAPI => {
    if (initialized) return api;

    // Find all floating label containers
    const elements = document.querySelectorAll(
        '.floating-label-field, .floating-label-container'
    );

    elements.forEach(setupContainer);

    initialized = true;
    return api;
};

/**
 * Refresh - find and setup any new containers
 */
const refresh = (): FloatingLabelAPI => {
    const elements = document.querySelectorAll(
        '.floating-label-field, .floating-label-container'
    );

    elements.forEach(setupContainer);

    return api;
};

/**
 * Destroy - remove all event listeners and cleanup
 */
const destroy = (): FloatingLabelAPI => {
    containers.forEach((data, container) => {
        const { input, handleFocus, handleBlur, handleInput } = data;

        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
        input.removeEventListener('input', handleInput);

        container.classList.remove('is-focused', 'has-content');
    });

    containers.clear();
    initialized = false;

    return api;
};

/**
 * Public API object
 */
const api: FloatingLabelAPI = {
    init,
    refresh,
    destroy,
};

/**
 * Export Public API
 */
export default api;
