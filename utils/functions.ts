
export function getDeviceType() {
    const userAgent = navigator.userAgent;

    if (/android/i.test(userAgent)) {
        return 'MOBILE';
    }
    // @ts-ignore
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'MOBILE';
    }
    if (/tablet|ipad|playbook|silk|android(?!.*mobi)/i.test(userAgent)) {
        return 'TABLET';
    }
    if (/Mobile|iP(hone|od)|Android.*Mobile|BlackBerry|IEMobile|Silk|Kindle|Opera Mini/i.test(userAgent)) {
        return 'MOBILE';
    }
    return 'DESKTOP';
}


export const showSuccessToast = (message: string | undefined) => {
    const toast = useToast()

    toast.add({id: 'success-message', title: message, color: "orange", icon: "i-heroicons-check-circle-solid"})
}

export const showErrorToast = (message: string | undefined) => {
    const toast = useToast()

    toast.add({id: 'error-message', title: message, color: "red", icon: "i-heroicons-exclamation-circle-solid", timeout: 0})
}


export function formatPhoneNumber(phoneNumber: string) {
    let phoneStr = String(phoneNumber);

    if (phoneStr.startsWith('0')) {
        return phoneStr.substring(1);
    }
    if (phoneStr.startsWith('62')) {
        return phoneStr.substring(2);
    }
    if (phoneStr.startsWith('+62')) {
        return phoneStr.substring(3);
    }
    return phoneStr;
}


export function capitalizeFirstLetter(str: string | null | undefined): string {
    if (str === null || str === undefined) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const currencyIDRFormatter = (value: number | undefined) => {
    return Intl.NumberFormat('ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value ?? 0)
}

export function toKebabCase(str: string): string {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
        .replace(/\s+/g, '-')        // Replace spaces with -
        .replace(/-+/g, '-');        // Replace multiple - with single -
}

