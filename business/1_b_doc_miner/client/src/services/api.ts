import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface DocumentMetadata {
  filename: string;
  file_type: string;
  language: string;
  page_number?: number;
  chunk_index: number;
  upload_date: string;
  word_count: number;
}

export interface DocumentChunk {
  id: string;
  text: string;
  metadata: DocumentMetadata;
}

export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  document_id: string;
  chunks_created: number;
}

export interface DocumentListResponse {
  documents: DocumentChunk[];
  total_count: number;
}

export interface DocumentDeleteResponse {
  success: boolean;
  message: string;
}

export interface SearchResponse {
  query: string;
  results: Array<{
    text: string;
    metadata: DocumentMetadata;
    distance?: number;
  }>;
  count: number;
}

export interface StatsResponse {
  total_documents: number;
  collection_name: string;
}

// Document API functions
export const documentAPI = {
  // Upload a document
  upload: async (file: File): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // List all documents
  list: async (limit?: number, filename?: string): Promise<DocumentListResponse> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (filename) params.append('filename', filename);
    
    const response = await api.get(`/api/documents/list?${params.toString()}`);
    return response.data;
  },

  // Delete a document
  delete: async (filename: string): Promise<DocumentDeleteResponse> => {
    const response = await api.delete(`/api/documents/${filename}`);
    return response.data;
  },

  // Search documents
  search: async (query: string, n_results: number = 10, language?: string): Promise<SearchResponse> => {
    const params = new URLSearchParams();
    params.append('query', query);
    params.append('n_results', n_results.toString());
    if (language) params.append('language', language);
    
    const response = await api.get(`/api/documents/search?${params.toString()}`);
    return response.data;
  },

  // Get statistics
  getStats: async (): Promise<StatsResponse> => {
    const response = await api.get('/api/documents/stats');
    return response.data;
  },
};

export default api;

