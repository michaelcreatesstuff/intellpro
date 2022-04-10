import React, { useState, useEffect } from 'react';
import api from '../api';

import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ParkingLotLegend from '../components/ParkingLotLegend';
import Modal from '../components/Modal';
const cloneDeep = require('clone-deep');

const Wrapper = styled.div`
  margin: 3%;
`;

const ParkingLotWrapper = styled.div`
  display: flex;
`;

const ParkingRow = styled.div`
  display: flex;
  margin: 0.7rem 0;
`;

const ParkingSpotWrapper = styled.div`
  border: 1px solid ${(props) => (props.isBestSpot ? 'navy' : props.isOccupied ? 'red' : 'green')};
  background: ${(props) => (props.isBestSpot ? 'navy' : props.isOccupied ? 'red' : 'green')};
  visibility: ${(props) => (props.isSpot ? 'visible' : 'hidden')};
  transition: background 0.7s, border 0.7s, opacity 0.4s ease-in;
  margin: 0 0.5rem;
  width: 1.8rem;
  height: 3.6rem;
  &:hover {
    opacity: 0.7;
    cursor: ${(props) => (props.isBestSpot ? 'pointer' : props.isOccupied ? 'auto' : 'pointer')};
  }
`;

const BuildingWrapper = styled.div`
  border: 0.5rem solid ${(props) => (props.isSelected ? 'purple' : 'grey')};
  width: 3.6rem;
  height: 3.6rem;
  line-height: 3.6rem;
  text-align: center;
  color: white;
  transition: box-shadow 0.3s;
  background: ${(props) => (props.isSelected ? 'purple' : 'grey')};
  &:hover {
    box-shadow: 0.3rem 0.6rem 0.6rem rgba(0, 0, 0, 0.38);
    cursor: pointer;
  }
`;

const Button = styled.button`
  margin: 0 0.3rem;
`;

const alphabet = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

function Building(props) {
  const { rowItemIndex, rowIndex, isSelectedBuilding, onClick } = props;
  const buildingNumber = rowItemIndex === 0 ? 1 : 2;
  return (
    <BuildingWrapper
      isSelected={isSelectedBuilding}
      onClick={() => onClick({ x: rowItemIndex, y: rowIndex })}
    >
      {alphabet[rowIndex]}
      {buildingNumber}
    </BuildingWrapper>
  );
}

function ParkingSpot(props) {
  const { rowItem, rowItemIndex, rowIndex, isBestSpot, onClick } = props;
  const { isSpot, isOccupied } = rowItem;
  return (
    <ParkingSpotWrapper
      isSpot={isSpot}
      isBestSpot={isBestSpot}
      isOccupied={isOccupied}
      onClick={() => onClick({ x: rowItemIndex, y: rowIndex })}
    />
  );
}

const General = (props) => {
  const lotX = 23;
  const lotY = 23;
  const [selectedSpot, setSelectedSpot] = useState({ x: 0, y: 0 });
  const [parkingLot, setParkingLot] = useState(null);
  const [shortestDistanceSpot, setShortestDistanceSpot] = useState({ x: -1, y: -1 });
  const [stringIdsList, setStringIdsList] = useState([]);
  const [lotId, setLotId] = useState(uuidv4());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState(null);

  async function getLotStringId(id) {
    await api
      .getLotStringById(id)
      .then((res) => {
        const { data = [] } = res?.data;
        if (data?.parkingLot) {
          const parkingLotJson = JSON.parse(data?.parkingLot);
          setParkingLot(parkingLotJson);
          setLotId(data?.lotId);
        }
      })
      .catch((err) => {
        setModalData(err?.response?.data?.error);
        setModalVisible(true);
      });
  }

  async function getLotsStringIdsList() {
    await api
      .getLotsStringsIds()
      .then((res) => {
        const { data = [] } = res?.data;
        setStringIdsList(data);
      })
      .catch((err) => {
        setModalData(err?.response?.data?.error);
        setModalVisible(true);
      });
  }

  async function createOrUpdateLot(id, payload) {
    await api
      .createOrUpdateLotString(id, payload)
      .then((res) => {
        getLotsStringIdsList();
        setModalData(res?.data?.message);
        setModalVisible(true);
      })
      .catch((err) => {
        setModalData(err?.response?.data?.error);
        setModalVisible(true);
      });
  }

  useEffect(() => {
    getLotsStringIdsList();
  }, []);

  useEffect(() => {
    getLotsStringIdsList();
  }, [lotId]);

  const clearCars = () => {
    const lotClone = cloneDeep(parkingLot);
    lotClone?.map((lotRow) =>
      lotRow.map((lotRowItem) => {
        if (lotRowItem.isSpot && lotRowItem.isOccupied) {
          lotRowItem.isOccupied = false;
        }
        return lotRowItem;
      })
    );
    setParkingLot(lotClone);
  };

  const saveLot = () => {
    createOrUpdateLot(lotId, { parkingLot });
  };

  const parkInSpot = (spot) => {
    const finalLot = cloneDeep(parkingLot);
    finalLot[spot.y][spot.x].isOccupied = true;
    setParkingLot(finalLot);
  };

  const getBuildingName = (spot) => {
    return `${alphabet[spot?.y]}${spot?.x === 0 ? 1 : 2}`;
  };

  const getDistance = (xOne = -1, yOne = -1, xTwo, yTwo, lotRowItem) => {
    if (
      lotRowItem.isBuilding ||
      (!lotRowItem.isBuilding && !lotRowItem.isSpot) ||
      (lotRowItem.isOccupied && lotRowItem.isSpot) ||
      xOne === -1 ||
      yOne === -1 ||
      (xOne === xTwo && yOne === yTwo)
    ) {
      // if we are calling the distance formula with an incorrect input, return a very large number
      return 10001;
    }
    return Math.sqrt(Math.pow(xTwo - xOne, 2) + Math.pow(yTwo - yOne, 2));
  };

  const generateLot = (lotWidth, lotHeight) => {
    const lot = [];
    for (let i = 0; i < lotHeight; i++) {
      const lotRow = [];
      // Add building on left side
      lotRow.push({ isBuilding: true, isSpot: false, isOccupied: true });

      // Generate random start index
      const startIndex = Math.floor(Math.random() * lotWidth);
      const rowLength = Math.floor(Math.random() * (lotWidth - startIndex)) + 1;
      for (let j = 0; j < lotWidth; j++) {
        const randomBoolean = Math.random() < 0.5;
        if (j >= startIndex && j < startIndex + rowLength) {
          const newLotRow = { isBuilding: false, isSpot: true, isOccupied: randomBoolean };
          lotRow.push(newLotRow);
        } else {
          lotRow.push({ isBuilding: false, isSpot: false, isOccupied: false });
        }
      }
      // Add buliding on right side
      lotRow.push({ isBuilding: true, isSpot: false, isOccupied: true });
      lot.push(lotRow);
    }
    return lot;
  };

  const randomize = () => {
    const lotWidth = Math.floor(Math.random() * 26) + 1;
    const lotHeight = Math.floor(Math.random() * 26) + 1;
    const newLot = generateLot(lotWidth, lotHeight);
    setParkingLot(newLot);
    setLotId(uuidv4());
    setSelectedSpot({ x: 0, y: 0 });
    document.getElementById('parkingLotSelector').value = 'default';
  };

  useEffect(() => {
    setParkingLot(generateLot(lotX, lotY));
  }, []);

  useEffect(() => {
    const getShortestDistance = (lot, selectedSpot) => {
      let shortestDistance = 10000;
      let shortestDistanceX = -1;
      let shortestDistanceY = -1;
      lot?.map((lotRow, lotRowIndex) =>
        lotRow.map((lotRowItem, lotRowItemIndex) => {
          const distance = getDistance(
            selectedSpot?.x,
            selectedSpot?.y,
            lotRowItemIndex,
            lotRowIndex,
            lotRowItem
          );
          if (distance < shortestDistance && distance > 0) {
            shortestDistance = distance;
            shortestDistanceX = lotRowItemIndex;
            shortestDistanceY = lotRowIndex;
          }
          return lotRowItem;
        })
      );
      return { x: shortestDistanceX, y: shortestDistanceY };
    };
    if (parkingLot !== null) {
      setShortestDistanceSpot(getShortestDistance(parkingLot, selectedSpot));
    }
  }, [selectedSpot, parkingLot]);

  const renderLotRow = (
    lotRow,
    rowIndex,
    selectedBuilding,
    bestParkingSpot,
    setSelectedSpotFunc,
    parkFunc
  ) => {
    return (
      <ParkingRow key={rowIndex}>
        {lotRow.map((rowItem, index) => {
          const isSelectedBuilding =
            selectedBuilding?.x === index && selectedBuilding?.y === rowIndex;
          const isBestSpot = bestParkingSpot?.x === index && bestParkingSpot?.y === rowIndex;
          const rowItemJsx = rowItem.isBuilding ? (
            <Building
              rowItem={rowItem}
              rowItemIndex={index}
              rowIndex={rowIndex}
              isSelectedBuilding={isSelectedBuilding}
              onClick={setSelectedSpotFunc}
              key={`${index}${rowIndex}`}
            />
          ) : (
            <ParkingSpot
              rowItem={rowItem}
              rowItemIndex={index}
              rowIndex={rowIndex}
              isBestSpot={isBestSpot}
              onClick={parkFunc}
              key={`${index}${rowIndex}`}
            />
          );
          return rowItemJsx;
        })}
      </ParkingRow>
    );
  };

  const renderLot = (lot) => {
    return lot?.map((lotRow, index) => {
      return renderLotRow(
        lotRow,
        index,
        selectedSpot,
        shortestDistanceSpot,
        setSelectedSpot,
        parkInSpot
      );
    });
  };

  const selectOnChange = (e) => {
    getLotStringId(e.target.value);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalData(null);
  };

  return (
    <Wrapper>
      <Modal visible={modalVisible} modalData={modalData} onClick={closeModal} />
      <div>Current Lot ID: {lotId}</div>
      <label htmlFor="parkingLotSelector">Load lot id:</label>
      <select onChange={selectOnChange} name="parkingLotSelector" id="parkingLotSelector">
        <option value="default">Select a lot id</option>
        {stringIdsList.map((obj) => (
          <option key={obj?.lotId} value={obj?.lotId}>
            {obj?.lotId}
          </option>
        ))}
      </select>
      <div>
        Click on an empty parking spot to park there. Click on a building to select it. Save changes
        to a lot by clicking "Save Lot".
      </div>
      <ParkingLotLegend />
      <div>
        <Button onClick={randomize}>Randomize Lot</Button>
        <Button onClick={clearCars}>Clear Cars</Button>
        <Button onClick={saveLot}>Save Lot</Button>
      </div>

      <ParkingLotWrapper>
        <div>{renderLot(parkingLot)}</div>
      </ParkingLotWrapper>
    </Wrapper>
  );
};

export default General;
