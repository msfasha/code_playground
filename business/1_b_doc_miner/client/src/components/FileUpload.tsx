import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { documentAPI, DocumentUploadResponse } from '../services/api';

interface FileUploadProps {
  onUploadSuccess: () => void;
}

interface UploadStatus {
  file: File;
  status: 'uploading' | 'success' | 'error';
  message?: string;
  response?: DocumentUploadResponse;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    // Validate file types
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validFiles = acceptedFiles.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length !== acceptedFiles.length) {
      alert('Some files were skipped. Only PDF, DOCX, and TXT files are supported.');
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const newUploads: UploadStatus[] = validFiles.map(file => ({
      file,
      status: 'uploading'
    }));
    setUploads(newUploads);

    // Upload files one by one
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      try {
        const response = await documentAPI.upload(file);
        
        setUploads(prev => prev.map((upload, index) => 
          index === i 
            ? { ...upload, status: 'success', response, message: `Indexed ${response.chunks_created} chunks` }
            : upload
        ));
        
        onUploadSuccess();
      } catch (error: any) {
        setUploads(prev => prev.map((upload, index) => 
          index === i 
            ? { ...upload, status: 'error', message: error.response?.data?.detail || 'Upload failed' }
            : upload
        ));
      }
    }

    setIsUploading(false);
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: isUploading
  });

  const clearUploads = () => {
    setUploads([]);
  };

  const getStatusIcon = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: UploadStatus['status']) => {
    switch (status) {
      case 'uploading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, DOCX, and TXT files
            </p>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Upload Status</h3>
            <button
              onClick={clearUploads}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
          
          <div className="space-y-2">
            {uploads.map((upload, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <File className="h-5 w-5 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(upload.status)}
                  <span className={`text-sm ${getStatusColor(upload.status)}`}>
                    {upload.status === 'uploading' && 'Processing...'}
                    {upload.status === 'success' && upload.message}
                    {upload.status === 'error' && upload.message}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

