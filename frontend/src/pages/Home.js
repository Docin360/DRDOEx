import React from 'react';
import styled from 'styled-components';

const Home = () => {
  return (
    <HomeContainer>
      <ContentWrapper>
        <h1>Serving you since 1958.</h1>
        <p>
          DRDO, the R&D wing of India's Ministry of Defence, develops cutting-edge defence
          technologies to equip the armed forces. Key achievements include the Agni and Prithvi
          missiles, Tejas aircraft, and Akash air defence system. Established in 1958, DRDO now
          operates 41 laboratories, advancing India's military capabilities.
        </p>
        <button>LOGIN</button>
      </ContentWrapper>
    </HomeContainer>
  );
};

const HomeContainer = styled.div`
  background-image: url('/hero-image.jpg');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ContentWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2rem;
  text-align: center;
`;

export default Home;