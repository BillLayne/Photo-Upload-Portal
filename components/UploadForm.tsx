import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Selection, UploadedImage, FormData } from '../types';
import { photoTips } from '../constants';
import { CustomInstructions } from './CustomInstructions';
import { HomeIcon, CarIcon, FileIcon, AlertTriangleIcon, UploadCloudIcon, CameraIcon, ImageIcon, XIcon, FileTextIcon, UserIcon, MapPinIcon, ChevronDownIcon } from './icons';

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

// Fix: Use a discriminated union for FormInput props to correctly type attributes for input and textarea elements.
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

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesSelected(acceptedFiles);
    }, [onFilesSelected]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [], 'application/pdf': ['.pdf'] },
        noClick: true,
    });

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

                {customInstructions && <CustomInstructions instructions={customInstructions} />}

                <PhotoTips selection={selection} />

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

                {uploadedImages.length > 0 && <ImagePreview images={uploadedImages} onRemove={onRemoveImage} />}
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