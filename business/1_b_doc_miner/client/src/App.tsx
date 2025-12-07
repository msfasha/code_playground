import React, { useState } from 'react';
import { Upload, FileText, Search } from 'lucide-react';
import FileUpload from './components/FileUpload';
import DocumentList from './components/DocumentList';

type TabType = 'upload' | 'documents';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('upload');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('documents');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">DocMiner</h1>
            </div>
            <p className="text-sm text-gray-600">
              Document indexing and retrieval system
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="h-4 w-4" />
              <span>Upload Documents</span>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Browse & Search</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Documents</h2>
              <p className="text-gray-600">
                Upload PDF, DOCX, or TXT files to add them to your document index. 
                The system supports both Arabic and English documents.
              </p>
            </div>
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {activeTab === 'documents' && (
          <DocumentList key={refreshTrigger} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>DocMiner - Document Indexing System</p>
            <p className="mt-1">Supports Arabic and English documents</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

