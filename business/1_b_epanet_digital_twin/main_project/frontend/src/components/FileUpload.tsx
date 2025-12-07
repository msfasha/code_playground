import React, { useCallback, useState } from 'react';
import type { ParsedNetwork } from '../utils/epanetParser';
import { epanetParser } from '../utils/epanetParser';
import { useNetwork } from '../context/NetworkContext';

interface FileUploadProps {
  onNetworkParsed: (network: ParsedNetwork) => void;
  onError: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onNetworkParsed, onError }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { setNetworkFile, setNetwork } = useNetwork();

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.inp')) {
      onError('Please select a .inp file');
      return;
    }

    setIsLoading(true);
    try {
      const network = await epanetParser.parseINPFileFromFile(file);
      console.log('[FileUpload] Network parsed:', network.title, `(${network.junctions.length} junctions)`);
      setNetworkFile(file); // Store file for simulator page
      console.log('[FileUpload] Setting network in context...');
      setNetwork(network); // Store network in context
      console.log('[FileUpload] Network set in context');
      onNetworkParsed(network);
    } catch (error) {
      onError(`Failed to parse file: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [onNetworkParsed, onError, setNetworkFile, setNetwork]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${isLoading ? 'loading' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".inp"
          onChange={handleChange}
          disabled={isLoading}
          className="file-input"
        />
        
        <div className="upload-content">
          {isLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Parsing network file...</p>
            </div>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <h3>Upload EPANET Network File</h3>
              <p>Drag and drop your .inp file here, or click to browse</p>
              <button className="browse-button" disabled={isLoading}>
                Browse Files
              </button>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        .file-upload-container {
          width: 100%;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .file-upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          background-color: #fafafa;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }
        
        .file-upload-area:hover {
          border-color: #007bff;
          background-color: #f0f8ff;
        }
        
        .file-upload-area.drag-active {
          border-color: #007bff;
          background-color: #e6f3ff;
          transform: scale(1.02);
        }
        
        .file-upload-area.loading {
          border-color: #28a745;
          background-color: #f0fff4;
        }
        
        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .upload-content {
          pointer-events: none;
        }
        
        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .upload-content h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
        }
        
        .upload-content p {
          margin: 0 0 16px 0;
          color: #666;
          font-size: 14px;
        }
        
        .browse-button {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }
        
        .browse-button:hover {
          background-color: #0056b3;
        }
        
        .browse-button:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
        
        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .loading-spinner p {
          margin: 0;
          color: #007bff;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};
