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
  const getRelativePath = (outputDir: string, filePath: string) => {
    return outputDir.replace(filePath, '');
  };

  return (
    <List>
      <h3>{title}</h3>
      {files.map((file, index) => (
        <ListItem key={index}>
          {file.parent_path === file.output_directory ? (
            file.new_name === file.original_name ? (
              <span>Won't rename</span>
            ) : (
              <span>
                {file.new_name}.{file.extension}
              </span>
            )
          ) : (
            <span>{getRelativePath(file.output_directory, file.parent_path)}{file.new_name}.{file.extension}</span>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export { InputFileList, OutputFileList };
