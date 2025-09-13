import React, { useState } from 'react';
import './DocumentUpload.css';

const DocumentUpload = ({ onDocumentUpload }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileSelect = async () => {
    setIsUploading(true);
    
    try {
      if (window.electronAPI) {
        // Running in Electron - use native file dialog
        const filePath = await window.electronAPI.selectFile();
        
        if (filePath) {
          // Extract filename from path
          const fileName = filePath.split(/[\\/]/).pop();
          
          // Read file content
          const fileContent = await window.electronAPI.readFileContent(filePath);
          
          const document = {
            name: fileName,
            path: filePath,
            type: getFileType(fileName),
            content: fileContent.content,
            pages: fileContent.pages,
            info: fileContent.info
          };
          
          setUploadedFile(document);
          onDocumentUpload(document);
        }
      } else {
        // Running in browser - use HTML file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.pdf,.txt,.doc,.docx,.md';
        
        input.onchange = async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              // Read file content in browser
              const content = await readFileInBrowser(file);
              
              const document = {
                name: file.name,
                path: file.name,
                type: getFileType(file.name),
                content: content,
                pages: Math.ceil(content.length / 2000),
                info: { title: file.name }
              };
              
              setUploadedFile(document);
              onDocumentUpload(document);
            } catch (error) {
              console.error('Error reading file in browser:', error);
              // Fallback to basic document info
              const document = {
                name: file.name,
                path: file.name,
                type: getFileType(file.name),
                content: `[File: ${file.name} - Content reading not available in browser mode]`,
                pages: 1,
                info: { title: file.name }
              };
              
              setUploadedFile(document);
              onDocumentUpload(document);
            }
          }
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Error selecting file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const readFileInBrowser = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        
        // Handle different file types
        if (file.type === 'application/pdf') {
          // For PDFs in browser, we can't easily extract text
          // This would require pdf.js or similar
          resolve(`[PDF file: ${file.name} - Text extraction not available in browser mode. Please use Electron version for full PDF support.]`);
        } else if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
          // Text files
          resolve(content);
        } else {
          resolve(`[File: ${file.name} - Content reading not available in browser mode]`);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      
      if (file.type.startsWith('text/') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        // For non-text files, just return a placeholder
        resolve(`[File: ${file.name} - Content reading not available in browser mode]`);
      }
    });
  };

  const getFileType = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    const typeMap = {
      'pdf': 'PDF Document',
      'txt': 'Text File',
      'doc': 'Word Document',
      'docx': 'Word Document',
      'md': 'Markdown File'
    };
    return typeMap[extension] || 'Document';
  };

  const removeDocument = () => {
    setUploadedFile(null);
    onDocumentUpload(null);
  };

  return (
    <div className="document-upload">
      <h3>Document Upload</h3>
      
      {!uploadedFile ? (
        <div className="upload-area">
          <div className="upload-icon">📄</div>
          <p>Upload a document to analyze</p>
          <button 
            className="btn btn-outline"
            onClick={handleFileSelect}
            disabled={isUploading}
          >
            {isUploading ? 'Selecting...' : 'Select File'}
          </button>
          <div className="supported-formats">
            <small>Supports: PDF, TXT, DOC, DOCX, MD</small>
          </div>
        </div>
      ) : (
        <div className="uploaded-file">
          <div className="file-info">
            <div className="file-icon">📄</div>
            <div className="file-details">
              <div className="file-name">{uploadedFile.name}</div>
              <div className="file-type">{uploadedFile.type}</div>
            </div>
          </div>
          <button 
            className="btn btn-remove"
            onClick={removeDocument}
            title="Remove document"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
