import React, { useState } from 'react';
import styled from 'styled-components';
import { Tabs, Tab } from './tabs/Tabs.tsx';
import { Rename } from './tabs/Rename.tsx';
import { Episode } from './tabs/Episode.tsx';
import { faSyncAlt, faFileAlt, faClosedCaptioning } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <Container>
      <Tabs>
        <Tab label="Rename" icon={faSyncAlt}>
          <Rename
            originalFiles={originalFiles}
            setOriginalFiles={setOriginalFiles}
            newNames={newNames}
            setNewNames={setNewNames}
            outputDirectory={outputDirectory}
            setOutputDirectory={setOutputDirectory}
          />
        </Tab>
        <Tab label="Episode" icon={faFileAlt}>
          <Episode originalFiles={originalFiles} />
        </Tab>
        <Tab label="Subtitle" icon={faClosedCaptioning}>
          <Content>
            <h2>Subtitle Tab</h2>
            {/* Subtitle content goes here */}
          </Content>
        </Tab>
        {/* Add more tabs as needed */}
      </Tabs>
    </Container>
  );
};

export default App;