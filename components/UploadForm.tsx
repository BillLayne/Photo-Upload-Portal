import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Selection, UploadedImage, FormData } from '../types';
import { photoTips } from '../constants';
import { HomeIcon, CarIcon, FileIcon, AlertTriangleIcon, UploadCloudIcon, CameraIcon, ImageIcon, XIcon, FileTextIcon, UserIcon, MapPinIcon, ChevronDownIcon, CheckCircleIcon } from './icons';

// --- Sub-components ---

const SelectionButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    value: Selection;
    current: Selection;
    onClick: (value: Selection) => void;
}> = ({ label, icon, value, current, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(value)}
        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 font-semibold transition-all duration-200 ease-in-out transform hover:-translate-y-1 ${
            current === value
                ? 'bg-blue-600 border-blue-700 text-white shadow-lg'
                : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600'
        }`}
    >
        <div className="w-8 h-8 mb-2">{icon}</div>
        <span>{label}</span>
    </button>
);

const PhotoTips: React.FC<{ selection: Selection }> = ({ selection }) => {
    const tips = photoTips[selection];
    return (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg my-8">
            <h4 className="text-lg font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <span className="text-2xl">{tips.icon}</span>
                {tips.title}
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-base text-emerald-700">
                {tips.tips.map((tip, i) => <li key={i} dangerouslySetInnerHTML={{ __html: tip }} />)}
            </ul>
        </div>
    );
};

// New component for individual photo item upload with enhanced styling
const PhotoItemUpload: React.FC<{
    itemName: string;
    itemNumber: number;
    totalItems: number;
    images: UploadedImage[];
    onFilesSelected: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
}> = ({ itemName, itemNumber, totalItems, images, onFilesSelected, onRemoveImage }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setIsUploading(true);
            // Simulate brief upload animation
            setTimeout(() => {
                onFilesSelected(files);
                setIsUploading(false);
            }, 300);
        }
    };

    const isComplete = images.length > 0;
    const isEmpty = images.length === 0;

    // Dynamic border and background based on state
    const containerClasses = `
        relative border-2 rounded-xl p-5 transition-all duration-300 transform
        ${isComplete ? 'border-green-500 bg-green-50/30 shadow-md shadow-green-100' : 
          isUploading ? 'border-blue-500 bg-blue-50/50 animate-pulse' :
          'border-slate-200 bg-white hover:border-blue-400 hover:shadow-md'}
    `;

    return (
        <div className={containerClasses}>
            {/* Completion badge - positioned absolutely */}
            {isComplete && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-300">
                    <CheckCircleIcon className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
            )}

            {/* Header with item number and name */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    {/* Item number badge */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${isComplete ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600'}`}
                    >
                        {itemNumber}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 text-base leading-tight">
                            {itemName}
                        </h4>
                        {isComplete && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">
                                ✓ {images.length} photo{images.length !== 1 ? 's' : ''} uploaded
                            </p>
                        )}
                        {isEmpty && (
                            <p className="text-xs text-slate-500 mt-0.5">
                                Required • Tap below to upload
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Progress indicator */}
                <div className="text-right text-xs text-slate-500 font-medium">
                    {itemNumber}/{totalItems}
                </div>
            </div>

            {/* Upload buttons - larger touch targets for mobile */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <input 
                    type="file" 
                    ref={cameraInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    capture="environment"
                    onChange={handleFileChange}
                />
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,application/pdf" 
                    multiple
                    onChange={handleFileChange}
                />
                
                <button 
                    type="button" 
                    onClick={() => cameraInputRef.current?.click()} 
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 active:scale-95 transition-all text-sm min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <CameraIcon className="w-5 h-5"/> 
                    <span>Take Photo</span>
                </button>
                <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={isUploading}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 active:scale-95 transition-all text-sm min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ImageIcon className="w-5 h-5"/> 
                    <span>Gallery</span>
                </button>
            </div>

            {/* Image previews for this item */}
            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                    {images.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden shadow-md group border-2 border-green-200">
                            {img.type === 'application/pdf' ? (
                                <div className="bg-slate-100 h-full flex flex-col items-center justify-center p-2">
                                    <FileTextIcon className="w-8 h-8 text-slate-500" />
                                    <span className="text-xs text-center text-slate-600 mt-1 break-all line-clamp-1 px-1">{img.name}</span>
                                </div>
                            ) : (
                                <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                            )}
                            <button
                                type="button"
                                onClick={() => onRemoveImage(index)}
                                className="absolute top-1 right-1 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 hover:scale-110 active:scale-95 shadow-lg"
                                aria-label="Remove photo"
                            >
                                <XIcon className="w-4 h-4" strokeWidth={3} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty state helper */}
            {isEmpty && !isUploading && (
                <div className="text-center py-3 px-4 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                    <p className="text-sm text-slate-500 font-medium">
                        📷 No photos yet
                    </p>
                </div>
            )}

            {/* Uploading state */}
            {isUploading && (
                <div className="text-center py-3 px-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                        ⏳ Processing photo...
                    </p>
                </div>
            )}
        </div>
    );
};

const ImagePreview: React.FC<{ images: UploadedImage[]; onRemove: (index: number) => void }> = ({ images, onRemove }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden shadow-md group animate-in fade-in-0 zoom-in-95">
                {img.type === 'application/pdf' ? (
                    <div className="bg-slate-100 h-full flex flex-col items-center justify-center p-2">
                        <FileTextIcon className="w-1/3 h-1/3 text-slate-500" />
                        <span className="text-xs text-center text-slate-600 mt-2 break-all line-clamp-2">{img.name}</span>
                    </div>
                ) : (
                    <img src={img.data} alt={img.name} className="w-full h-full object-cover" />
                )}
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-600/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 hover:scale-110"
                >
                    <XIcon className="w-4 h-4" strokeWidth={3} />
                </button>
            </div>
        ))}
    </div>
);

const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; isDefaultOpen?: boolean }> = ({ title, icon, children, isDefaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(isDefaultOpen);
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <div className="flex items-center gap-3 font-semibold text-slate-700">
                    <span className="text-blue-600">{icon}</span>
                    {title}
                </div>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-4 space-y-4 animate-in fade-in-0 slide-in-from-top-2">{children}</div>}
        </div>
    );
};

type FormInputProps = {
    label: string;
    isRequired?: boolean;
} & (
    (React.InputHTMLAttributes<HTMLInputElement> & { as?: 'input' }) |
    (React.TextareaHTMLAttributes<HTMLTextAreaElement> & { as: 'textarea' })
);

const FormInput: React.FC<FormInputProps> = ({ label, isRequired, as, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {as === 'textarea' ? (
            <textarea {...props as React.TextareaHTMLAttributes<HTMLTextAreaElement>} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" />
        ) : (
            <input {...props as React.InputHTMLAttributes<HTMLInputElement>} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition" />
        )}
    </div>
);


// --- Main UploadForm Component ---

interface UploadFormProps {
    selection: Selection;
    setSelection: (s: Selection) => void;
    uploadedImages: UploadedImage[];
    onFilesSelected: (files: File[]) => void;
    onRemoveImage: (index: number) => void;
    formData: FormData;
    onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    customInstructions?: string;
}

export const UploadForm: React.FC<UploadFormProps> = (props) => {
    const { selection, setSelection, uploadedImages, onFilesSelected, onRemoveImage, formData, onFormChange, customInstructions } = props;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Parse custom instructions into individual items
    const instructionItems = useMemo(() => {
        if (!customInstructions) return [];
        return customInstructions
            .split('|||')
            .map(s => s.trim().replace('CUSTOM: ', ''))
            .filter(Boolean);
    }, [customInstructions]);

    // Track which images belong to which category (maps image index to category name)
    const [imageCategories, setImageCategories] = useState<{ [imageIndex: number]: string }>({});

    // Handle files selected for a specific category
    const handleCategoryFilesSelected = useCallback((category: string, files: File[]) => {
        // Get the current count of uploaded images before adding new ones
        const startIndex = uploadedImages.length;
        
        // Call parent's file handler to process and add images
        onFilesSelected(files);
        
        // After images are added, tag them with the category
        // We'll update the mapping in the next render cycle
        setTimeout(() => {
            const newMappings: { [imageIndex: number]: string } = {};
            files.forEach((_, fileIndex) => {
                const imageIndex = startIndex + fileIndex;
                newMappings[imageIndex] = category;
            });
            setImageCategories(prev => ({ ...prev, ...newMappings }));
        }, 100);
    }, [uploadedImages.length, onFilesSelected]);

    // Get images for a specific category
    const getImagesForCategory = useCallback((category: string) => {
        return uploadedImages
            .map((img, index) => ({ img, index }))
            .filter(({ index }) => imageCategories[index] === category)
            .map(({ img, index }) => ({ ...img, originalIndex: index }));
    }, [uploadedImages, imageCategories]);

    // Handle removing an image from a category
    const handleCategoryRemoveImage = useCallback((originalIndex: number) => {
        onRemoveImage(originalIndex);
        
        // Update category mappings by removing this index and adjusting higher indices
        setImageCategories(prev => {
            const newMappings: { [imageIndex: number]: string } = {};
            Object.keys(prev).forEach(key => {
                const index = parseInt(key);
                if (index < originalIndex) {
                    newMappings[index] = prev[index];
                } else if (index > originalIndex) {
                    newMappings[index - 1] = prev[index];
                }
            });
            return newMappings;
        });
    }, [onRemoveImage]);

    // Count completed items (items with at least one photo)
    const completedItems = useMemo(() => {
        return instructionItems.filter(item => 
            getImagesForCategory(item).length > 0
        ).length;
    }, [instructionItems, getImagesForCategory]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [], 'application/pdf': ['.pdf'] },
        noClick: true,
    });

    // Determine if we should show itemized upload containers
    const showItemizedUpload = instructionItems.length > 0;

    return (
        <form onSubmit={e => e.preventDefault()}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <SelectionButton label="Home" icon={<HomeIcon />} value="home" current={selection} onClick={setSelection} />
                <SelectionButton label="Vehicle" icon={<CarIcon />} value="vehicle" current={selection} onClick={setSelection} />
                <SelectionButton label="Forms" icon={<FileIcon />} value="forms" current={selection} onClick={setSelection} />
                <SelectionButton label="Claim" icon={<AlertTriangleIcon />} value="claim" current={selection} onClick={setSelection} />
            </div>

            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-amber-900 flex items-center gap-2">📸 Upload Photos</h3>
                    <span className="bg-blue-600 text-white font-bold text-lg w-12 h-12 flex items-center justify-center rounded-full">{uploadedImages.length}</span>
                </div>

                {!showItemizedUpload && <PhotoTips selection={selection} />}

                {/* Show itemized upload containers if instructions exist */}
                {showItemizedUpload ? (
                    <div className="space-y-4">
                        {/* Enhanced header with progress */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-xl p-5 mb-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-bold text-blue-900 text-lg flex items-center gap-2">
                                    📋 Required Photos
                                </h4>
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    {uploadedImages.length} photos
                                </span>
                            </div>
                            
                            {/* Progress bar */}
                            <div className="mb-3">
                                <div className="flex justify-between items-center mb-1.5">
                                    <span className="text-xs font-semibold text-blue-800">Upload Progress</span>
                                    <span className="text-xs font-bold text-blue-900">
                                        {completedItems} of {instructionItems.length} items complete
                                    </span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${instructionItems.length > 0 ? (completedItems / instructionItems.length) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            <p className="text-sm text-blue-700 leading-relaxed">
                                Please upload photos for each item below. You can take a photo or choose from your gallery.
                            </p>
                        </div>
                        
                        {/* Photo upload items */}
                        <div className="space-y-4">
                            {instructionItems.map((item, index) => {
                                const categoryImages = getImagesForCategory(item);
                                return (
                                    <PhotoItemUpload
                                        key={index}
                                        itemName={item}
                                        itemNumber={index + 1}
                                        totalItems={instructionItems.length}
                                        images={categoryImages}
                                        onFilesSelected={(files) => handleCategoryFilesSelected(item, files)}
                                        onRemoveImage={(imgIndex) => {
                                            // Find the original index in the uploadedImages array
                                            const originalIndex = (categoryImages[imgIndex] as any).originalIndex;
                                            handleCategoryRemoveImage(originalIndex);
                                        }}
                                    />
                                );
                            })}
                        </div>

                        {/* General upload area for additional photos - enhanced styling */}
                        <div className="mt-6 border-2 border-dashed border-slate-300 rounded-xl p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 hover:border-slate-400 transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                    +
                                </div>
                                <h4 className="font-semibold text-slate-700">Additional Photos (Optional)</h4>
                            </div>
                            <p className="text-xs text-slate-500 mb-3">
                                Add any extra photos or documents that might be helpful
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => cameraInputRef.current?.click()} 
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 active:scale-95 transition-all text-sm min-h-[48px]"
                                >
                                    <CameraIcon className="w-5 h-5"/> Take Photo
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current?.click()} 
                                    className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-500 text-white font-semibold rounded-lg shadow-md hover:bg-slate-600 active:scale-95 transition-all text-sm min-h-[48px]"
                                >
                                    <ImageIcon className="w-5 h-5"/> Gallery
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Original upload area when no custom instructions */
                    <div {...getRootProps()} className={`relative p-6 border-2 border-dashed rounded-xl text-center transition-colors ${isDragActive ? 'bg-blue-100 border-blue-500' : 'bg-white border-slate-300'}`}>
                        <input {...getInputProps()} />
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" multiple onChange={e => onFilesSelected(Array.from(e.target.files || []))} />
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={e => onFilesSelected(Array.from(e.target.files || []))} />

                        <div className="flex flex-col items-center justify-center">
                            <UploadCloudIcon className="w-12 h-12 text-blue-500 mb-2" />
                            <p className="font-bold text-slate-700">Tap a button to upload, or drag files here.</p>
                            <p className="text-sm text-slate-500 mt-1">Accepts JPG, PNG, and PDF files.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full max-w-sm">
                                <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition">
                                    <CameraIcon className="w-5 h-5"/> Take Photo
                                </button>
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-3 px-4 bg-slate-600 text-white font-semibold rounded-lg shadow hover:bg-slate-700 transition">
                                    <ImageIcon className="w-5 h-5"/> From Gallery
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hidden inputs for general upload when showing itemized containers */}
                {showItemizedUpload && (
                    <>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,application/pdf" multiple onChange={e => onFilesSelected(Array.from(e.target.files || []))} />
                        <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={e => onFilesSelected(Array.from(e.target.files || []))} />
                    </>
                )}

                {uploadedImages.length > 0 && !showItemizedUpload && <ImagePreview images={uploadedImages} onRemove={onRemoveImage} />}
                
                {/* Show all uploaded images at bottom when using itemized upload - enhanced */}
                {uploadedImages.length > 0 && showItemizedUpload && (
                    <div className="mt-6 border-t-2 border-slate-200 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <ImageIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                All Uploaded Photos
                            </h4>
                            <span className="bg-blue-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-md">
                                {uploadedImages.length}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                            Review all photos before submitting. Tap any photo to remove it.
                        </p>
                        <ImagePreview images={uploadedImages} onRemove={onRemoveImage} />
                    </div>
                )}
            </div>

            <div className="space-y-6 mt-8">
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="w-full flex items-center p-4 bg-slate-50">
                        <div className="flex items-center gap-3 font-semibold text-slate-700">
                            <span className="text-blue-600"><UserIcon /></span>
                            Contact Information
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        <FormInput label="Full Name" name="customerName" value={formData.customerName} onChange={onFormChange} isRequired placeholder="John Smith" />
                        <FormInput label="Phone" name="phone" value={formData.phone} onChange={onFormChange} isRequired type="tel" placeholder="(555) 123-4567" />
                        <FormInput label="Email" name="email" value={formData.email} onChange={onFormChange} type="email" placeholder="you@example.com" />
                    </div>
                </div>

                <FormSection title={['home', 'forms'].includes(selection) ? 'Property Details' : 'Vehicle Details'} icon={<MapPinIcon />}>
                    {['home', 'forms', 'claim'].includes(selection) && (
                        <>
                            <FormInput label="Address" name="address" value={formData.address} onChange={onFormChange} placeholder="123 Main Street" />
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="City" name="city" value={formData.city} onChange={onFormChange} placeholder="Mooresville" />
                                <FormInput label="ZIP" name="zip" value={formData.zip} onChange={onFormChange} placeholder="28117" maxLength={5} />
                            </div>
                        </>
                    )}
                    {['vehicle', 'claim'].includes(selection) && (
                         <FormInput label="Vehicle Info" name="vehicleInfo" value={formData.vehicleInfo} onChange={onFormChange} placeholder="2023 Toyota Camry or VIN" />
                    )}
                     <FormInput as="textarea" label="Notes" name="notes" value={formData.notes} onChange={onFormChange} placeholder="Any additional information..." rows={4} />
                </FormSection>
            </div>
        </form>
    );
};
