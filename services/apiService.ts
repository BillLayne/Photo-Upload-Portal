
import { SubmissionData, SubmissionResult } from '../types';
import { MAX_RETRIES } from '../constants';

const generateReferenceNumber = (): string => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `BLI-${year}${month}${day}-${random}`;
};

const getSelectedType = (selection: SubmissionData['selection']) => {
    return ['home', 'forms'].includes(selection) ? 'HOME' : 'VEHICLE';
};

const getSelectedPurpose = (selection: SubmissionData['selection']) => {
    return ['forms', 'claim'].includes(selection) ? selection : 'property';
};

export const uploadWithRetry = async (
    url: string,
    submissionData: SubmissionData,
    onProgress: (status: string, progress: number) => void,
    retryCount = 0
): Promise<SubmissionResult> => {
    const referenceNumber = generateReferenceNumber();
    const { selection, formData, uploadedImages } = submissionData;

    const payload = {
        type: getSelectedType(selection),
        purpose: getSelectedPurpose(selection),
        selection: selection,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zip: formData.zip,
        vehicleInfo: formData.vehicleInfo,
        notes: formData.notes,
        images: uploadedImages.map(img => ({ ...img, data: img.data.split(',')[1] })), // Send only base64 part
        referenceNumber: referenceNumber,
        submittedAt: new Date().toISOString(),
        deviceInfo: {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
        },
    };

    try {
        onProgress(`Uploading... ${retryCount > 0 ? `(Retry ${retryCount}/${MAX_RETRIES})` : ''}`, 10);
        
        // Simulate upload progress
        for (let i = 0; i < uploadedImages.length; i++) {
            await new Promise(res => setTimeout(res, 200));
            const progress = 10 + Math.floor(((i + 1) / uploadedImages.length) * 80);
            onProgress(`Uploading photo ${i + 1} of ${uploadedImages.length}...`, progress);
        }

        const response = await fetch(url, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Scripts
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        
        // Since it's no-cors, we can't read the response. We assume success if fetch doesn't throw.
        onProgress('Finalizing upload...', 95);
        await new Promise(res => setTimeout(res, 500));
        onProgress('Upload complete!', 100);
        
        return { success: true, referenceNumber };

    } catch (error) {
        console.error('Upload error:', error);
        if (retryCount < MAX_RETRIES) {
            onProgress(`Network issue. Retrying in 3s...`, 0);
            await new Promise(resolve => setTimeout(resolve, 3000));
            return uploadWithRetry(url, submissionData, onProgress, retryCount + 1);
        }
        return { success: false, error: (error as Error).message };
    }
};
