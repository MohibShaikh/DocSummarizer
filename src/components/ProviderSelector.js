import React from 'react';
import './ProviderSelector.css';

const ProviderSelector = ({ currentProvider, onProviderChange }) => {
  const providers = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: '/summary.png',
      description: 'Claude'
    },
    {
      id: 'gemini',
      name: 'Google',
      icon: '/summary.png',
      description: 'Gemini'
    }
  ];

  return (
    <div className="provider-selector">
      <div className="provider-tabs">
        {providers.map((provider) => (
          <button
            key={provider.id}
            className={`provider-tab ${currentProvider === provider.id ? 'active' : ''}`}
            onClick={() => onProviderChange(provider.id)}
          >
            <span className="provider-icon">
              <img src={provider.icon} alt={provider.name} className="provider-icon-img" />
            </span>
            <div className="provider-info">
              <span className="provider-name">{provider.name}</span>
              <span className="provider-desc">{provider.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProviderSelector;
