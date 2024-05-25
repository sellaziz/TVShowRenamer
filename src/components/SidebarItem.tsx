import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

const SidebarItemStyled = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
  cursor: pointer;
  padding: 5px;
  &:hover {
    background-color: #d3d3d3;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

interface SidebarItemProps {
  icon: FontAwesomeIconProps['icon'];
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label }) => {
  return (
    <SidebarItemStyled>
      <Icon icon={icon} />
      <div>{label}</div>
    </SidebarItemStyled>
  );
};

export default SidebarItem;
