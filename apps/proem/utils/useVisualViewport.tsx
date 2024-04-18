import { useEffect, useState } from "react"

function getViewports() {
    return {
        viewport: {
            width: Math.max(
                document.documentElement.clientWidth || 0,
                window.innerWidth || 0
            ),
            height: Math.max(
                document.documentElement.clientHeight || 0,
                window.innerHeight || 0
            )
        },
        visualViewport: {
            width: window.visualViewport?.width,
            height: window.visualViewport?.height
        },
    }
}

function getViewportState() {
    const { viewport, visualViewport } = getViewports();
    const keyboardUp = !!(visualViewport.height && visualViewport.height < viewport.height);

    return { viewport, visualViewport, keyboardUp };
}

export function useVisualViewport() {
    const [state, setState] = useState(getViewportState);

    useEffect(() => {
        const handleResize = () => setState(getViewportState);

        window.visualViewport?.addEventListener('resize', handleResize);
        return () =>
            window.visualViewport?.removeEventListener('resize', handleResize);
    }, []);

    return state;
}

export function useDeviceType() {
    const [device, setDevice] = useState('');

    useEffect(() => {
        const handleDeviceDetection = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
            const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

            if (isMobile) {
                setDevice('Mobile');
            } else if (isTablet) {
                setDevice('Tablet');
            } else {
                setDevice('Desktop');
            }
        };

        handleDeviceDetection();
        window.addEventListener('resize', handleDeviceDetection);

        return () => {
            window.removeEventListener('resize', handleDeviceDetection);
        };
    }, []);

    return { device, isMobile: device === 'Mobile', isDesktop: device === 'Desktop' };
};