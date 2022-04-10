import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

const NavBarContainer = styled.div`
  background: linear-gradient(
    135deg,
    rgba(117, 34, 130, 1) 0%,
    rgba(220, 84, 150, 1) 35%,
    rgba(232, 152, 91, 1) 70%,
    rgba(241, 194, 75, 1) 100%
  );
  padding: 3%;
`;

const Heading1 = styled.h1`
  font-size: 3.6rem;
  color: white;
`;

const Heading2 = styled.h2`
  font-size: 2.4rem;
  color: white;
`;

const NavBar = () => {
  return (
    <NavBarContainer>
      <Logo />
      <Heading1>Technical Assessment - Parking Lot</Heading1>
      <Heading2>by Michael Yang</Heading2>
    </NavBarContainer>
  );
};

export default NavBar;
