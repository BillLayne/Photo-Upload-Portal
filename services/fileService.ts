
import { UploadedImage } from '../types';
import { ALLOWED_TYPES, MAX_FILE_SIZE, COMPRESSION_QUALITY, MAX_IMAGE_WIDTH } from '../constants';

const validateFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_TYPES[file.type]) {
        return { valid: false, error: `File type ${file.type} not allowed` };
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_TYPES[file.type].includes(extension)) {
        return { valid: false, error: `File extension mismatch for ${file.name}` };
    }

    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `${file.name} exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }

    return { valid: true };
};

const compressImage = (file: File): Promise<File> => {
    if (file.type === 'application/pdf') {
        return Promise.resolve(file);
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;

                if (width > MAX_IMAGE_WIDTH) {
                    height = (MAX_IMAGE_WIDTH / width) * height;
                    width = MAX_IMAGE_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Canvas toBlob failed'));
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    COMPRESSION_QUALITY
                );
            };
            img.onerror = reject;
            if (e.target?.result) {
                img.src = e.target.result as string;
            } else {
                reject(new Error('FileReader result is null'));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const processFiles = async (files: File[]): Promise<UploadedImage[]> => {
    const processedImages: UploadedImage[] = [];
    for (const file of files) {
        const validation = validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            continue;
        }

        try {
            const processedFile = file.type.startsWith('image/') ? await compressImage(file) : file;
            const base64 = await fileToBase64(processedFile);

            processedImages.push({
                data: base64,
                type: processedFile.type,
                name: processedFile.name,
                size: processedFile.size,
                originalSize: file.size,
                compressed: file.size !== processedFile.size,
            });
        } catch (error) {
            console.error('Error processing file:', error);
            alert(`Failed to process ${file.name}`);
        }
    }
    return processedImages;
};
