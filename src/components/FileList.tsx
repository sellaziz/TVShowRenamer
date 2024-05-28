import React from 'react';
import styled from 'styled-components';
import { File } from '../utils/common.ts';

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

interface FileListProps {
  title: string;
  files: File[];
}

const InputFileList: React.FC<FileListProps> = ({ title, files }) => {
  return (
    <List>
      <h3>{title}</h3>
      {files.map((file, index) => (
        <ListItem key={index}>
          {file.original_name}.{file.extension}
        </ListItem>
      ))}
    </List>
  );
};

const OutputFileList: React.FC<FileListProps> = ({ title, files }) => {
  return (
    <List>
      <h3>{title}</h3>
      {files.map((file, index) => (
        <ListItem key={index}>
          {file.new_name !== file.original_name ? `${file.new_name}.${file.extension}` : 'Won\'t rename'}
        </ListItem>
      ))}
    </List>
  );
};

export { InputFileList, OutputFileList };
