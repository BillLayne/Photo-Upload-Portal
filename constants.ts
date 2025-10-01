
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgRcVZgCDznG5bBTLpAxun6enA4OP4k6HQhYHYeyq4nkFNKxBkFg3QVQr5n9p9olAlag/exec';
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
export const COMPRESSION_QUALITY = 0.85;
export const MAX_IMAGE_WIDTH = 1600;
export const MAX_RETRIES = 3;

export const ALLOWED_TYPES: { [key: string]: string[] } = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf']
};

export const photoTips = {
    'home': {
        icon: '🏠',
        title: 'How to Photograph Your Property:',
        tips: [
            '<strong>Front of house</strong> - Stand back to capture entire front',
            '<strong>Back of house</strong> - Include deck/patio if present',
            '<strong>All sides</strong> - Show full side from corner to corner',
            '<strong>Roof angle</strong> - Best visible angle showing condition'
        ]
    },
    'vehicle': {
        icon: '🚗',
        title: 'How to Photograph Your Vehicle:',
        tips: [
            '<strong>Front view</strong> - Stand directly in front, include license plate',
            '<strong>Back view</strong> - Stand directly behind, include license plate',
            '<strong>Both sides</strong> - Full side view from front to back',
            '<strong>VIN number</strong> - Dashboard or driver door frame'
        ]
    },
    'forms': {
        icon: '📄',
        title: 'Document Photo Tips:',
        tips: [
            'Place document on flat surface',
            'Ensure good lighting (no shadows)',
            'Capture entire document in frame',
            'Make sure text is readable'
        ]
    },
    'claim': {
        icon: '🚨',
        title: 'How to Document Damage/Claims:',
        tips: [
            '<strong>Overall damage view</strong> - Wide shots showing full extent',
            '<strong>Each damaged area</strong> - Individual close-up photos',
            '<strong>Multiple angles</strong> - Same damage from different perspectives',
            '<strong>Exchange forms</strong> - Clear photo of all insurance documents'
        ]
    }
};
