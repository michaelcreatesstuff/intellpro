const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LotRowSchema = require('./lot-row-model');

const LotSchema = new Schema({
  lotId: String,
  parkingLot: [{ type: Schema.Types.ObjectId, ref: 'LotRowSchema' }],
});

module.exports = mongoose.model('lots', LotSchema);
