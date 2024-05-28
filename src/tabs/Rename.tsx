import React from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { InputFileList, OutputFileList } from '../components/FileList.tsx';
import CenterContainer from '../components/CenterContainer.tsx';
import Button from '../components/Button.tsx';
import OutputDirectorySelector from '../components/OutputDirectorySelector.tsx';
import { faSyncAlt, faFileUpload, faCheck } from '@fortawesome/free-solid-svg-icons';
import extractDetails from '../utils/extractDetails.ts';
import fetchEpisodeDetails from '../utils/fetchEpisodeDetails.ts';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { File } from '../utils/common.ts';

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

interface RenameProps {
    inputFiles: File[];
    setInputFiles: React.Dispatch<React.SetStateAction<File[]>>;
    outputDirectory: string;
    setOutputDirectory: React.Dispatch<React.SetStateAction<string>>;
}

const Rename: React.FC<RenameProps> = ({
    inputFiles,
    setInputFiles,
    outputDirectory,
    setOutputDirectory
}) => {

    const handleRename = async () => {
        const updatedFiles = await Promise.all(inputFiles.map(async (file) => {
            const { showName, seasonNumber, episodeNumber } = extractDetails(file.original_name);
            var episodeDetails = null;
            var newName;
            try {
                const apiKey: string = await invoke('get_api_key');
                episodeDetails = await fetchEpisodeDetails(file.show_name, parseInt(seasonNumber, 10), parseInt(episodeNumber, 10), apiKey);
                newName = `${episodeDetails.show_name} - S${seasonNumber}E${episodeNumber} - ${episodeDetails.episode_name}`;
            } catch (error) {
                newName = `${showName} - S${seasonNumber}E${episodeNumber}`;
                console.error('Error fetching episode details:', error);
            }
            return { ...file, new_name: newName, episode_details: episodeDetails };
        }));
        setInputFiles(updatedFiles);
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
                    const { showName } = extractDetails(name);
                    return { id: uuidv4(), original_name: name, new_name: name, extension: extension, show_name: showName, path: filePath };
                });
                setInputFiles(files);
                setOutputDirectory(files[files.length - 1].path.split('/').slice(0, -1).join('/'));
            }
        } catch (error) {
            console.error('Error selecting files:', error);
        }
    };

    const handleAcceptNames = async () => {
        try {
            for (const file of inputFiles) {
                const originalFile = inputFiles.find(f => f.id === file.id);
                if (originalFile && originalFile.path && outputDirectory) {
                    if (originalFile.new_name !== originalFile.original_name) {
                        await invoke('rename_file', {
                            originalPath: originalFile.path,
                            newName: `${file.new_name}.${file.extension}`,
                            outputDirectory
                        });
                    }
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
                <InputFileList title="Original Files" files={inputFiles} />
                <CenterContainer>
                    <Button icon={faSyncAlt} onClick={handleRename} title="Rename Files" />
                    <Button icon={faFileUpload} onClick={handleFileInputChange} title="Add Files" />
                    <Button icon={faCheck} onClick={handleAcceptNames} title="Accept Names" />
                </CenterContainer>
                <OutputFileList title="New Names" files={inputFiles} />
            </Content>
            <OutputDirectorySelector directory={outputDirectory} onSelectDirectory={handleSelectOutputDirectory} />
        </Container>
    );
};

export { Rename };
