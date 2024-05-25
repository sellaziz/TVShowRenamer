import React, { ReactNode } from 'react';
import styled from 'styled-components';

const CenterContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

interface CenterContainerProps {
  children: ReactNode;
}

const CenterContainer: React.FC<CenterContainerProps> = ({ children }) => {
  return <CenterContainerStyled>{children}</CenterContainerStyled>;
};

export default CenterContainer;
