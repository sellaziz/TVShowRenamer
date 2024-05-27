import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  background: ${({ isActive }) => (isActive ? '#ddd' : '#fff')};
  border: none;
  border-bottom: ${({ isActive }) => (isActive ? '2px solid #000' : 'none')};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const TabContent = styled.div`
  padding: 20px;
  flex-grow: 1;
`;

interface TabProps {
    label: string;
    icon: IconDefinition;
    children: React.ReactNode;
}

interface TabsProps {
    children: React.ReactElement<TabProps>[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <TabsContainer>
                {React.Children.map(children, (child, index) => (
                    <TabButton
                        key={index}
                        isActive={activeTab === index}
                        onClick={() => setActiveTab(index)}
                    >
                        <FontAwesomeIcon icon={child.props.icon} />
                        {child.props.label}
                    </TabButton>
                ))}
            </TabsContainer>
            <TabContent>{children[activeTab]}</TabContent>
        </div>
    );
};

export const Tab: React.FC<TabProps> = ({ children }) => {
    return <>{children}</>;
};
