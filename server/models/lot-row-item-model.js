const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LotRowItemSchema = new Schema({
  xIndex: Number,
  yIndex: Number,
  isBuilding: Boolean,
  isSpot: Boolean,
  isOccupied: Boolean,
});

module.exports = mongoose.model('lotrowitems', LotRowItemSchema);