import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { invoke } from '@tauri-apps/api/core';

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 20px;
`;

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    invoke<string>('get_api_key').then((key) => {
      setApiKey(key);
    });
  }, []);

  const handleSetApiKey = () => {
    const newApiKey = apiKey;
    invoke('set_api_key', { apiKey: newApiKey }); // Updated key to `apiKey`
    setApiKey(newApiKey);
  }

  return (
    <Container>
      <div>
        <label htmlFor="api-key">API Key: </label>
        <input type="text" id="api-key" name="api-key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        <button type="submit" onClick={handleSetApiKey}>Submit</button>
      </div>
    </Container>
  );
};

export { Settings };
