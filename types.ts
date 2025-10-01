
export type Selection = 'home' | 'vehicle' | 'forms' | 'claim';

export interface UploadedImage {
    data: string;
    type: string;
    name: string;
    size: number;
    originalSize: number;
    compressed: boolean;
}

export interface FormData {
    customerName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    vehicleInfo: string;
    notes: string;
}

export interface SubmissionData {
    selection: Selection;
    formData: FormData;
    uploadedImages: UploadedImage[];
}

export interface SubmissionResult {
    success: boolean;
    referenceNumber?: string;
    error?: string;
}

export interface UrlParams {
    customerName?: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    zip?: string;
    vehicleInfo?: string;
    photoInstructions?: string;
}
