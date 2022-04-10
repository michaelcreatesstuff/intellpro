const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LotStringSchema = new Schema({
  lotId: String,
  parkingLot: String,
});

module.exports = mongoose.model('lotsString', LotStringSchema);
