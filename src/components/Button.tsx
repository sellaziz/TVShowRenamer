import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

const ButtonStyled = styled(FontAwesomeIcon)`
  font-size: 3rem;
  cursor: pointer;
  transition: color 0.3s, transform 0.3s;
  margin: 20px 0;
  &:hover {
    color: #007bff;
    transform: scale(1.1);
  }
`;

interface ButtonProps {
  icon: FontAwesomeIconProps['icon'];
  onClick: () => void;
  title: string;
}

const Button: React.FC<ButtonProps> = ({ icon, onClick, title }) => {
  return <ButtonStyled icon={icon} onClick={onClick} title={title} />;
};

export default Button;
