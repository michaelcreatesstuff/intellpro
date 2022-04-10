const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LotRowItemSchema = require('./lot-row-item-model');

const LotRowSchema = new Schema({
  yIndex: Number,
  rowItems: [{ type: Schema.Types.ObjectId, ref: 'LotRowItemSchema' }],
});

module.exports = mongoose.model('lotrows', LotRowSchema);