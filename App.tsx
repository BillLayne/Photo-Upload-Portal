
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { UploadForm } from './components/UploadForm';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { SubmitBar } from './components/SubmitBar';
import { UploadModal } from './components/modals/UploadModal';
import { SuccessModal } from './components/modals/SuccessModal';
import { WelcomeBanner } from './components/WelcomeBanner';
import { CustomInstructions } from './components/CustomInstructions';
import { Selection, UploadedImage, FormData, SubmissionResult, UrlParams } from './types';
import { SCRIPT_URL } from './constants';
import { processFiles } from './services/fileService';
import { uploadWithRetry } from './services/apiService';


const App: React.FC = () => {
    const [selection, setSelection] = useState<Selection>('home');
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [formData, setFormData] = useState<FormData>({
        customerName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        vehicleInfo: '',
        notes: ''
    });
    const [urlParams, setUrlParams] = useState<UrlParams>({});
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

    const handlePrefill = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        const newUrlParams: UrlParams = {};
        
        const updateForm = (key: keyof FormData, paramName: string) => {
            if (params.has(paramName)) {
                const value = decodeURIComponent(params.get(paramName)!);
                setFormData(prev => ({ ...prev, [key]: value }));
                newUrlParams[key] = value;
            }
        };

        updateForm('customerName', 'customerName');
        updateForm('phone', 'phone');
        updateForm('email', 'email');
        updateForm('address', 'address');
        updateForm('city', 'city');
        updateForm('zip', 'zip');
        updateForm('vehicleInfo', 'vehicleInfo');

        if (params.has('currentCarrier')) {
            const carrier = decodeURIComponent(params.get('currentCarrier')!);
            setFormData(prev => ({ ...prev, notes: `Current Carrier: ${carrier}\n\n${prev.notes}` }));
        }

        if (params.has('uploadType')) {
            const uploadType = params.get('uploadType')?.toLowerCase() as Selection;
            if (['home', 'vehicle', 'forms', 'claim'].includes(uploadType)) {
                setSelection(uploadType);
            }
        }
        
        if (params.has('photoInstructions')) {
            newUrlParams.photoInstructions = decodeURIComponent(params.get('photoInstructions')!);
        }

        if(Object.keys(newUrlParams).length > 0) {
            setUrlParams(newUrlParams);
        }
    }, []);

    useEffect(() => {
        handlePrefill();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleFilesSelected = async (files: File[]) => {
        const processed = await processFiles(files);
        setUploadedImages(prev => [...prev, ...processed]);
    };

    const removeImage = (index: number) => {
        setUploadedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (uploadedImages.length === 0) {
            alert('Please upload at least one photo or document.');
            return;
        }
        if (!formData.customerName || !formData.phone) {
            alert('Please fill in your Full Name and Phone number.');
            return;
        }

        setIsSubmitting(true);
        setUploadStatus('Preparing upload...');
        setUploadProgress(0);

        const result = await uploadWithRetry(
            SCRIPT_URL,
            { selection, formData, uploadedImages },
            (status, progress) => {
                setUploadStatus(status);
                setUploadProgress(progress);
            }
        );

        setIsSubmitting(false);

        if (result.success) {
            setSubmissionResult(result);
            setShowSuccessModal(true);
        } else {
            alert(`Upload failed: ${result.error || 'Please try again or contact us.'}`);
        }
    };

    const resetForm = () => {
        setShowSuccessModal(false);
        setUploadedImages([]);
        setFormData({
            customerName: '', phone: '', email: '',
            address: '', city: '', zip: '', vehicleInfo: '', notes: ''
        });
        setSelection('home');
        setSubmissionResult(null);
        // We keep the pre-filled data in case user wants to resubmit
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
                <Hero />
                <div className="bg-white p-6 sm:p-8 rounded-b-2xl shadow-xl">
                    {urlParams.customerName && <WelcomeBanner name={urlParams.customerName.split(' ')[0]} />}
                    
                    <UploadForm
                        selection={selection}
                        setSelection={setSelection}
                        uploadedImages={uploadedImages}
                        onFilesSelected={handleFilesSelected}
                        onRemoveImage={removeImage}
                        formData={formData}
                        onFormChange={handleFormChange}
                        customInstructions={urlParams.photoInstructions}
                    />

                    <TrustBadges />

                </div>
                 <SubmitBar 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                    imageCount={uploadedImages.length} 
                />
            </main>
            <Footer />

            <UploadModal
                isOpen={isSubmitting && !showSuccessModal}
                status={uploadStatus}
                progress={uploadProgress}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={resetForm}
                submissionResult={submissionResult}
                formData={formData}
            />
        </div>
    );
};

export default App;
