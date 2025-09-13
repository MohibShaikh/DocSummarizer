import React, { useState } from 'react';
import './ApiKeyManager.css';

const ApiKeyManager = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted with API key:', apiKey.trim());
    
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key');
      return;
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-ant-')) {
      setError('Anthropic API key should start with "sk-ant-"');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (window.electronAPI) {
        // Running in Electron - save to keychain
        console.log('Saving API key to Electron keychain...');
        const success = await window.electronAPI.setApiKey('anthropic', apiKey.trim());
        
        if (success) {
          console.log('API key saved successfully, calling onApiKeySet...');
          onApiKeySet(apiKey.trim());
          setApiKey('');
        } else {
          setError('Failed to save API key. Please try again.');
        }
      } else {
        // Running in browser - just set the key (for testing)
        console.log('Running in browser mode, setting API key directly...');
        onApiKeySet(apiKey.trim());
        setApiKey('');
      }
    } catch (error) {
      console.error('Error setting API key:', error);
      setError('An error occurred while saving your API key.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="api-key-manager">
      <div className="api-key-welcome">
        <div className="api-key-header">
          <div className="api-key-icon">
            <img src="/summary.png" alt="AI Desktop Client" className="app-logo" />
          </div>
          <h1>Welcome to AI Desktop Client</h1>
          <p>Enter your Anthropic API key to get started</p>
        </div>

        <div className="api-key-form-container">
          <form onSubmit={handleSubmit} className="api-key-form">
            <div className="input-group">
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className={`api-key-input ${error ? 'error' : ''}`}
                disabled={isLoading}
              />
              {error && <div className="error-message">{error}</div>}
            </div>

            <button 
              type="submit" 
              className="api-key-submit"
              disabled={isLoading || !apiKey.trim()}
            >
              {isLoading ? (
                <div className="loading-spinner-small"></div>
              ) : (
                'Continue'
              )}
            </button>
          </form>
        </div>

        <div className="api-key-features">
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Secure Storage</h4>
                <p>Encrypted in OS keychain</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>No Third-Party</h4>
                <p>Direct API connection</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Cross-Platform</h4>
                <p>Works everywhere</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18"/>
                </svg>
              </div>
              <div className="feature-text">
                <h4>Responsive</h4>
                <p>Laptop & iPad ready</p>
              </div>
            </div>
          </div>
        </div>

        <div className="api-key-help">
          <p>
            Don't have an API key? Get one from{' '}
            <a 
              href="https://console.anthropic.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="help-link"
            >
              Anthropic Console
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;
