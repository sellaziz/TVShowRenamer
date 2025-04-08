import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { invoke } from '@tauri-apps/api/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

export type RenameFormat = 'default' | 'compact' | 'simple' | 'dot';

const Settings: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [renameFormat, setRenameFormat] = useState<RenameFormat>('default');

  useEffect(() => {
    invoke<string>('get_api_key').then((key) => {
      setApiKey(key);
    });
    invoke<RenameFormat>('get_rename_format').then((format) => {
      setRenameFormat(format);
    });
  }, []);

  const handleSetApiKey = () => {
    invoke('set_api_key', { apiKey });
  }

  const handleSetRenameFormat = () => {
    invoke('set_rename_format', { format: renameFormat });
  }

  return (
    <Container>
      <SettingGroup>
        <Label htmlFor="api-key">API Key:</Label>
        <Input
          type="text"
          id="api-key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <Button onClick={handleSetApiKey}>Save API Key</Button>
      </SettingGroup>

      <SettingGroup>
        <Label htmlFor="rename-format">Rename Format:</Label>
        <Select
          id="rename-format"
          value={renameFormat}
          onChange={(e) => setRenameFormat(e.target.value as RenameFormat)}
        >
          <option value="default">Show Name - S01E01 - Episode Name</option>
          <option value="compact">Show Name S01E01</option>
          <option value="simple">Show Name 1x01</option>
          <option value="dot">Show Name S01.E01</option>
        </Select>
        <Button onClick={handleSetRenameFormat}>Save Format</Button>
      </SettingGroup>
    </Container>
  );
};

export { Settings };
