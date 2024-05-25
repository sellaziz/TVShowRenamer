import React from 'react';
import styled from 'styled-components';
import Button from './Button';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  border-top: 1px solid #ccc;
  margin-top: 20px;
`;

const Input = styled.input`
  flex-grow: 1;
  padding: 8px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

interface OutputDirectorySelectorProps {
  directory: string;
  onSelectDirectory: () => void;
}

const OutputDirectorySelector: React.FC<OutputDirectorySelectorProps> = ({ directory, onSelectDirectory }) => {
  return (
    <Container>
      <Input type="text" value={directory} readOnly />
      <Button icon={faFolderOpen} onClick={onSelectDirectory} title="Select Output Directory" />
    </Container>
  );
};

export default OutputDirectorySelector;
