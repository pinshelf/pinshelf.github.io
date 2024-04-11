import Device from 'svelte-device-info';

export function isDesktop(): boolean {
    return !Device.isPhone && !Device.isTablet && !Device.isMobile;
}

export function isPWA () {
    return window.matchMedia('(display-mode: standalone)').matches;
}
