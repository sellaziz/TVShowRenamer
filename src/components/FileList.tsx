import React from 'react';
import styled from 'styled-components';

const List = styled.div`
  width: 45%;
  height: 80vh;
  border: 1px solid #ccc;
  padding: 10px;
  overflow-y: auto;
`;

const ListItem = styled.div`
  padding: 5px;
  &:hover {
    background-color: #d3d3d3;
  }
`;

interface File {
  name: string;
  extension: string;
}

interface FileListProps {
  title: string;
  files: File[];
}

const FileList: React.FC<FileListProps> = ({ title, files }) => {
  return (
    <List>
      <h3>{title}</h3>
      {files.map((file, index) => (
        <ListItem key={index}>
          {file.name}.{file.extension}
        </ListItem>
      ))}
    </List>
  );
};

export default FileList;
