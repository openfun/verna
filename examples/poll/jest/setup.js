// Extend jest matchers with jest-dom's
import '@testing-library/jest-dom/extend-expect';

// Used to mock window.scrollTo and avoid console errors
Object.defineProperty(window, 'scrollTo', { value: () => {}, writable: true });
