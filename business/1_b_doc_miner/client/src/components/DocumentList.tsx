import React, { useState, useEffect } from 'react';
import { File, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { documentAPI, DocumentChunk, StatsResponse } from '../services/api';

const DocumentList: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentChunk[]>([]);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentAPI.list();
      setDocuments(response.documents);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await documentAPI.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, []);

  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Are you sure you want to delete all chunks for "${filename}"?`)) {
      return;
    }

    try {
      await documentAPI.delete(filename);
      await loadDocuments();
      await loadStats();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document');
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await documentAPI.search(searchQuery, 20, languageFilter || undefined);
      
      // Convert search results to document format for display
      const searchDocuments: DocumentChunk[] = response.results.map((result, index) => ({
        id: `search-${index}`,
        text: result.text,
        metadata: result.metadata
      }));
      
      setDocuments(searchDocuments);
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLanguageFilter('');
    setShowSearch(false);
    loadDocuments();
  };

  // Group documents by filename
  const groupedDocuments = documents.reduce((acc, doc) => {
    const filename = doc.metadata.filename;
    if (!acc[filename]) {
      acc[filename] = [];
    }
    acc[filename].push(doc);
    return acc;
  }, {} as Record<string, DocumentChunk[]>);

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'ar':
        return '🇸🇦';
      case 'en':
        return '🇺🇸';
      default:
        return '🌐';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Indexed Documents</h2>
          {stats && (
            <p className="text-sm text-gray-600">
              {stats.total_documents} total chunks indexed
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
          <button
            onClick={loadDocuments}
            className="btn-secondary flex items-center space-x-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Search Interface */}
      {showSearch && (
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Search Documents</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Query
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search terms..."
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Filter
              </label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Languages</option>
                <option value="ar">Arabic</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button onClick={handleSearch} className="btn-primary">
                Search
              </button>
              <button onClick={clearSearch} className="btn-secondary">
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading documents...</p>
        </div>
      ) : Object.keys(groupedDocuments).length === 0 ? (
        <div className="text-center py-8">
          <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No documents indexed yet</p>
          <p className="text-sm text-gray-500">Upload some documents to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedDocuments).map(([filename, docs]) => (
            <div key={filename} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-gray-400" />
                  <div>
                    <h3 className="font-medium text-gray-900">{filename}</h3>
                    <p className="text-sm text-gray-600">
                      {docs.length} chunks • {getLanguageFlag(docs[0].metadata.language)} {docs[0].metadata.language}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(filename)}
                  className="text-red-600 hover:text-red-800 p-1"
                  title="Delete document"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Document Chunks */}
              <div className="space-y-3">
                {docs.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-500">
                        Chunk {doc.metadata.chunk_index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {doc.metadata.word_count} words
                      </span>
                    </div>
                    <p 
                      className="text-sm text-gray-700 line-clamp-3"
                      dir={doc.metadata.language === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {doc.text}
                    </p>
                  </div>
                ))}
                {docs.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    ... and {docs.length - 3} more chunks
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentList;

