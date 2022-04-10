import React from 'react';
import styled from 'styled-components';

const LegendContainer = styled.div`
  margin: 0.8rem 0;
`;

const LegendItem = styled.span`
  background: ${(props) => (props.background ? props.background : 'grey')};
  color: white;
  margin-right: 0.4rem;
  padding: 0.4rem 0.8rem;
`;

const ParkingLotLegend = () => {
  return (
    <LegendContainer>
      <LegendItem background="green">Empty Parking Spot</LegendItem>
      <LegendItem background="red">Full Parking Spot</LegendItem>
      <LegendItem background="navy">Best Parking Spot</LegendItem>
      <LegendItem background="purple">Selected Building</LegendItem>
    </LegendContainer>
  );
};

export default ParkingLotLegend;
