import React, { useState } from 'react';
import styled from 'styled-components';
import { Tabs, Tab } from './tabs/Tabs.tsx';
import { Rename } from './tabs/Rename.tsx';
import { Episode } from './tabs/Episode.tsx';
import { Settings } from './tabs/Settings.tsx';
import { faSyncAlt, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { File } from './utils/common.ts';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
`;

const App: React.FC = () => {
  const [inputFiles, setInputFiles] = useState<File[]>([]);
  const [outputDirectory, setOutputDirectory] = useState<string>('');

  return (
    <Container>
      <Tabs>
        <Tab label="Rename" icon={faSyncAlt}>
          <Rename
            inputFiles={inputFiles}
            setInputFiles={setInputFiles}
            outputDirectory={outputDirectory}
            setOutputDirectory={setOutputDirectory}
          />
        </Tab>
        <Tab label="Episode" icon={faFileAlt}>
          <Episode
            inputFiles={inputFiles}
            setInputFiles={setInputFiles}
          />
        </Tab>
        <Tab label="Settings" icon={faFileAlt}>
          <Settings/>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default App;
