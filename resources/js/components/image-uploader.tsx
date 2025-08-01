'use client';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
    onImageChange?: (file: File | null) => void;
    initialImage?: string | null;
}
export function ImageUploader({ onImageChange, initialImage }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>('/storage/' + initialImage || '');

    const onDrop = React.useCallback(
        (acceptedFiles: File[]) => {
            const reader = new FileReader();
            console.log('Accepted files:', acceptedFiles);
            try {
                reader.onload = () => setPreview(reader.result);
                reader.readAsDataURL(acceptedFiles[0]);
                if (onImageChange) {
                    onImageChange(acceptedFiles[0]);
                }
            } catch (error) {
                setPreview(null);
                console.error('Error reading file:', error);
            }
        },
        [onImageChange],
    );

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 1000000,
        accept: { 'image/png': [], 'image/jpg': [], 'image/jpeg': [] },
    });

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <div {...getRootProps()} className="w-full max-w-md rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the image here...</p> : <p>Drag 'n' drop an image here, or click to select one</p>}
            </div>
            {fileRejections.length > 0 && <p className="mt-2 text-red-500">{fileRejections[0].errors[0].message}</p>}
            {preview && <img src={preview as string} alt="Preview" className="mt-4 w-full max-w-md rounded-lg" />}
        </div>
    );
}
