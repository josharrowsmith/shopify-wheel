import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { IconContext } from 'react-icons';
import { GiPresent } from 'react-icons/gi';
import { Nav } from './components/Nav';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100vh;
`;

const PresentContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  return (
    <Container>
      <PresentContainer>
        <IconContext.Provider value={{ color: 'white', size: '50px' }}>
          <GiPresent onClick={() => setIsNavOpen(true)} />
        </IconContext.Provider>
      </PresentContainer>
      <Nav isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
    </Container>
  );
}
