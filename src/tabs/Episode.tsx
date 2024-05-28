import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { File } from '../utils/common.ts';

interface EpisodeProps {
  inputFiles: File[];
}

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 20px;
`;

const FileListContainer = styled.div`
  width: 50%;
  padding: 20px;
  border-right: 1px solid #ccc;
`;

const FileDetailsContainer = styled.div`
  width: 50%;
  padding: 20px;
`;

const FileItem = styled.div<{ isSelected: boolean }>`
  padding: 10px;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? '#ddd' : '#fff')};
  &:hover {
    background: #eee;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th, td {
    border: 1px solid #ccc;
    padding: 10px;
  }
  th {
    background: #f4f4f4;
  }
`;

const Episode: React.FC<EpisodeProps> = ({ inputFiles }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (inputFiles.length > 0) {
      setSelectedFile(inputFiles[0]);
    }
  }, [inputFiles]);

  return (
    <Container>
      <FileListContainer>
        {inputFiles.map((file) => (
          <FileItem
            key={file.id}
            isSelected={selectedFile?.id === file.id}
            onClick={() => { setSelectedFile(file); }}
          >
            {file.original_name}
          </FileItem>
        ))}
      </FileListContainer>
      <FileDetailsContainer>
        {selectedFile ? (
          <Table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{selectedFile.id}</td>
              </tr>
              <tr>
                <td>Name</td>
                <td>{selectedFile.original_name}</td>
              </tr>
              <tr>
                <td>Extension</td>
                <td>{selectedFile.extension}</td>
              </tr>
              <tr>
                <td>Path</td>
                <td>{selectedFile.path}</td>
              </tr>
            </tbody>
          </Table>
        ) : (
          <p>Select a file to see the details</p>
        )}
      </FileDetailsContainer>
    </Container>
  );
};

export { Episode };
