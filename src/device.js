// utils/device.js
export function detectDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/android/i.test(userAgent)) {
        return 'mobile';
    }

    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'mobile';
    }

    return 'desktop';
}