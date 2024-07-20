document.addEventListener('DOMContentLoaded', () => {
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const updateLineCount = debounce((element) => {
        const lineCount = Math.floor(element.scrollHeight / parseFloat(getComputedStyle(element).lineHeight));
        element.style.setProperty('--line-count', lineCount);

        if (element.hasAttribute('data-hide-until-load')) {
            element.setAttribute('data-hide-until-load', 'true');
            setTimeout(() => {
                element.removeAttribute('data-hide-until-load');
            }, 200);
        }
    }, 200);

    const processElements = () => {
        document.querySelectorAll('[data-line-count]').forEach((element) => {
            updateLineCount(element);
        });
    };

    // Initial line count update
    processElements();

    // Mutation observer to watch for changes in the DOM
    const observer = new MutationObserver(processElements);
    observer.observe(document.body, { childList: true, subtree: true });

    // Event listener for viewport resize
    window.addEventListener('resize', processElements);
});
