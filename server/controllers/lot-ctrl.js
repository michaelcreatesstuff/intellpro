const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LotStringModel = require('../models/lot-string-model');
const LotModel = require('../models/lot-model');
const LotRowModel = require('../models/lot-row-model');
const LotRowItemModel = require('../models/lot-row-item-model');
const db = require('../db/index');

createLot = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a lot',
    });
  }

  const { id = 1 } = body;

  let { parkingLot = [] } = body;

  const newLot = {
    lotId: id,
    parkingLot: parkingLot.map((row, yInd) => {
      return new LotRowModel({
        yIndex: yInd,
        rowItems: row.map((rowItem, xInd) => {
          return new LotRowItemModel({
            yIndex: yInd,
            xIndex: xInd,
            isBuilding: rowItem?.isBuilding,
            isSpot: rowItem?.isSpot,
            isOccupied: rowItem?.isOccupied,
          });
        }),
      });
    }),
  };

  const lot = new LotModel(newLot);

  if (!lot) {
    return res.status(400).json({ success: false, error: err });
  }

  db.collections.lots
    .insertOne(lot)
    .then(() => {
      return res.status(200).json({
        success: true,
        id: lot._id,
        lot,
        message: 'Lot added!',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: 'Lot not added!',
      });
    });
};

createOrUpdateLotString = (req, res) => {
  const body = req.body;
  const id = req?.params?.id.toString();
  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a lot',
    });
  }

  const { parkingLot } = body;
  if (Array.isArray(parkingLot) && parkingLot.length > 0) {
    const newLot = JSON.stringify(parkingLot);
    const query = { lotId: id };
    const opts = { upsert: true };
    const updates = { parkingLot: newLot };
    LotStringModel.findOneAndUpdate(query, updates, opts)
      .then(() => {
        return res.status(200).json({
          success: true,
          newLot,
          message: 'Lot added or updated!',
        });
      })
      .catch((err) => {
        return res.status(400).json({
          error: err,
          success: false,
          message: 'Lot not added!',
        });
      });
  } else {
    return res.status(400).json({
      error: 'Must provide a valid parking lot.',
      success: false,
      message: 'Lot not added!',
    });
  }
};

createLotString = (req, res) => {
  const body = req.body;
  if (!body) {
    return res.status(400).json({
      success: false,
      error: 'You must provide a lot',
    });
  }

  const { id = 1, parkingLot = [] } = body;

  const newLot = JSON.stringify(parkingLot);

  const lot = new LotStringModel({ lotId: id.toString(), parkingLot: newLot });

  if (!lot) {
    return res.status(400).json({ success: false, error: err });
  }

  lot
    .save()
    .then(() => {
      return res.status(200).json({
        success: true,
        id: lot._id,
        lot,
        message: 'Lot added!',
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: 'Lot not added!',
      });
    });
};

getLotStringById = (req, res) => {
  LotStringModel.findOne({ lotId: req.params.id.toString() })
    .then((response) => {
      if (!response) {
        return res.status(404).json({ success: false, error: `Lot not found` });
      }
      return res.status(200).json({ success: true, data: response });
    })
    .catch((err) => res.status(400).json({ success: false, error: err }));
};

getLots = async (req, res) => {
  await LotModel.find({}, (err, lots) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!lots.length) {
      return res.status(404).json({ success: false, error: `No parking lots found in database.` });
    }
    return res.status(200).json({ success: true, data: lots });
  }).catch((err) => console.log(err));
};

getLotsStrings = async (req, res) => {
  await LotStringModel.find({}, (err, lots) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!lots.length) {
      return res.status(404).json({ success: false, error: `No parking lots found in database.` });
    }
    return res.status(200).json({ success: true, data: lots });
  }).catch((err) => console.log(err));
};

getLotsStringsIds = (req, res) => {
  LotStringModel.find({}, 'lotId')
    .then((response) => {
      if (!(response.length > 0)) {
        return res.status(404).json({ success: false, error: `No parking lots found in database.` });
      }
      return res.status(200).json({ success: true, data: response });
    })
    .catch((err) => {
      res.status(400).json({ success: false, error: err });
    });
};

module.exports = {
  createLot,
  createLotString,
  createOrUpdateLotString,
  getLots,
  getLotsStrings,
  getLotsStringsIds,
  getLotStringById,
};
