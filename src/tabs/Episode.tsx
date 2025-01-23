import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { File } from '../utils/common.ts';

interface EpisodeProps {
  inputFiles: File[];
  setInputFiles: React.Dispatch<React.SetStateAction<File[]>>;
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

const Episode: React.FC<EpisodeProps> = ({ inputFiles, setInputFiles }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newShowName, setNewShowName] = useState('');

  useEffect(() => {
    if (inputFiles.length > 0) {
      setSelectedFile(inputFiles[0]);
      setNewShowName(inputFiles[0].show_name);
    }
  }, [inputFiles]);

  const handleShowNameSubmit = (e: any) => {
    const updatedShowName = newShowName.trim();
    e.preventDefault();
    if (selectedFile && updatedShowName) {
      const updatedFiles = inputFiles.map((file) => {
        if (file.id === selectedFile.id) {
          return { ...file, show_name: updatedShowName };
        }
        return file;
      });
      setSelectedFile({ ...selectedFile, show_name: updatedShowName });
      setInputFiles(updatedFiles);
    }
  };

  return (
    <Container>
      <FileListContainer>
        {inputFiles.map((file) => (
          <FileItem
            key={file.id}
            isSelected={selectedFile?.id === file.id}
            onClick={() => { setSelectedFile(file); setNewShowName(file.show_name); }}
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
                <td>Show Name</td>
                <td>
                  <form onSubmit={handleShowNameSubmit}>
                    <input type="text" value={newShowName} onChange={(e) => setNewShowName(e.target.value)} />
                    <button type="submit">Update</button>
                  </form>
                </td>
              </tr>
              <tr>
                <td>Path</td>
                <td>{selectedFile.path}</td>
              </tr>
              <tr>
                <td>Output Directory</td>
                <td>{selectedFile.output_directory}</td>
              </tr>
              {/* Add episode details if not null */}
              {selectedFile.episode_details && (
                <>
                  <tr>
                    <td>Episode Number</td>
                    <td>{selectedFile.episode_details.episode_number}</td>
                  </tr>
                  <tr>
                    <td>Season Number</td>
                    <td>{selectedFile.episode_details.season_number}</td>
                  </tr>
                  <tr>
                    <td>Episode Name</td>
                    <td>{selectedFile.episode_details.episode_name}</td>
                  </tr>
                  <tr>
                    <td>Episode Poster</td>
                    <td>
                      <img src={`https://image.tmdb.org/t/p/w500${selectedFile.episode_details.poster_path}`} alt="Episode Poster" />
                    </td>
                  </tr>
                  <tr>
                    <td>Show Poster</td>
                    <td>
                      <img src={`https://image.tmdb.org/t/p/w500${selectedFile.episode_details.show_poster_path}`} alt="Show Poster" />
                    </td>
                  </tr>
                </>
              )}

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
