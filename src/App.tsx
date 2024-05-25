import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar.tsx';
import FileList from './components/FileList.tsx';
import CenterContainer from './components/CenterContainer.tsx';
import Button from './components/Button.tsx';
import { faSyncAlt, faFileUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import extractDetails from './utils/extractDetails.ts';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

const Container = styled.div`
  display: flex;
  padding: 20px;
  height: 100vh;
`;

interface File {
  id: string;
  name: string;
  extension: string;
  path?: string;
}

const App: React.FC = () => {
  const [originalFiles, setOriginalFiles] = useState<File[]>([]);
  const [newNames, setNewNames] = useState<File[]>([]);

  const handleRename = () => {
    const updatedFiles = originalFiles.map((file) => {
      const { showName, seasonNumber, episodeNumber } = extractDetails(file.name);
      const newName = `${showName} - S${seasonNumber}E${episodeNumber}`;
      return { ...file, name: newName };
    });
    setNewNames(updatedFiles);
  };

  const handleFileInputChange = async () => {
    try {
      const selectedFiles = await open({
        multiple: true,
        filters: [{
          name: 'Video Files',
          extensions: ['mp4', 'mkv', 'avi']
        }]
      }) as string[];
      
      if (selectedFiles) {
        const files = selectedFiles.map((filePath) => {
          const fileName = filePath.split('/').pop() || '';
          const name = fileName.replace(/\.[^/.]+$/, "");
          const extension = fileName.split('.').pop() || '';
          return { id: uuidv4(), name, extension, path: filePath };
        });
        setOriginalFiles(files);
      }
    } catch (error) {
      console.error('Error selecting files:', error);
    }
  };

  const handleAcceptNames = async () => {
    try {
      for (const file of newNames) {
        const originalFile = originalFiles.find(f => f.id === file.id);
        if (originalFile && originalFile.path) {
          await invoke('rename_file', { originalPath: originalFile.path, newName: `${file.name}.${file.extension}` });
        }
      }
      alert('Files renamed successfully');
    } catch (error) {
      console.error('Error renaming files:', error);
      alert('Failed to rename files');
    }
  };

  return (
    <Container>
      <Sidebar />
      <FileList title="Original Files" files={originalFiles} />
      <CenterContainer>
        <Button icon={faSyncAlt} onClick={handleRename} title="Rename Files" />
        <Button icon={faFileUpload} onClick={handleFileInputChange} title="Add Files" />
        <Button icon={faCheck} onClick={handleAcceptNames} title="Accept Names" />
      </CenterContainer>
      <FileList title="New Names" files={newNames} />
    </Container>
  );
};

export default App;