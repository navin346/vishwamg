
export const triggerHaptic = (type: 'success' | 'error' | 'light' | 'medium' | 'heavy') => {
    if (!navigator.vibrate) return;

    switch (type) {
        case 'success':
            navigator.vibrate([10, 30, 10, 30]);
            break;
        case 'error':
            navigator.vibrate([50, 30, 50, 30, 50]);
            break;
        case 'light':
            navigator.vibrate(10);
            break;
        case 'medium':
            navigator.vibrate(20);
            break;
        case 'heavy':
            navigator.vibrate(40);
            break;
    }
};
