import React from 'react';
import styled from 'styled-components';
import SidebarItem from './SidebarItem.tsx';
import { faFileAlt, faTv, faClosedCaptioning, faFileSignature, faChartBar, faList } from '@fortawesome/free-solid-svg-icons';

const SidebarStyled = styled.div`
  width: 200px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
`;

const Sidebar: React.FC = () => {
  return (
    <SidebarStyled>
      <SidebarItem icon={faFileAlt} label="Rename" />
      <SidebarItem icon={faTv} label="Episodes" />
      <SidebarItem icon={faClosedCaptioning} label="Subtitles" />
      <SidebarItem icon={faFileSignature} label="SFV" />
      <SidebarItem icon={faChartBar} label="Analyze" />
      <SidebarItem icon={faList} label="List" />
    </SidebarStyled>
  );
};

export default Sidebar;
