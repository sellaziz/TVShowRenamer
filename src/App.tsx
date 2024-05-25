import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar.tsx';
import FileList from './components/FileList.tsx';
import CenterContainer from './components/CenterContainer.tsx';
import Button from './components/Button.tsx';
import OutputDirectorySelector from './components/OutputDirectorySelector.tsx';
import { faSyncAlt, faFileUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import extractDetails from './utils/extractDetails.ts';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
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
  const [outputDirectory, setOutputDirectory] = useState<string>('');

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
        setOutputDirectory(files[files.length - 1].path.split('/').slice(0, -1).join('/'));
      }
    } catch (error) {
      console.error('Error selecting files:', error);
    }
  };

  const handleAcceptNames = async () => {
    try {
      for (const file of newNames) {
        const originalFile = originalFiles.find(f => f.id === file.id);
        if (originalFile && originalFile.path && outputDirectory) {
          await invoke('rename_file', {
            originalPath: originalFile.path,
            newName: `${file.name}.${file.extension}`,
            outputDirectory
          });
        }
      }
      alert('Files renamed successfully');
    } catch (error) {
      console.error('Error renaming files:', error);
      alert('Failed to rename files');
    }
  };

  const handleSelectOutputDirectory = async () => {
    try {
      const directory = await open({
        directory: true
      }) as string;
      if (directory) {
        setOutputDirectory(directory);
      }
    } catch (error) {
      console.error('Error selecting directory:', error);
    }
  };

  return (
    <Container>
      <Content>
        <Sidebar />
        <FileList title="Original Files" files={originalFiles} />
        <CenterContainer>
          <Button icon={faSyncAlt} onClick={handleRename} title="Rename Files" />
          <Button icon={faFileUpload} onClick={handleFileInputChange} title="Add Files" />
          <Button icon={faCheck} onClick={handleAcceptNames} title="Accept Names" />
        </CenterContainer>
        <FileList title="New Names" files={newNames} />
      </Content>
      <OutputDirectorySelector directory={outputDirectory} onSelectDirectory={handleSelectOutputDirectory} />
    </Container>
  );
};

export default App;