const express = require('express');

const LotCtrl = require('../controllers/lot-ctrl');

const router = express.Router();

router.post('/lot', LotCtrl.createLot);
router.get('/lots', LotCtrl.getLots);
router.get('/lotString/:id', LotCtrl.getLotStringById);
router.post('/lotString/:id', LotCtrl.createOrUpdateLotString);
router.post('/lotString', LotCtrl.createLotString);
router.get('/lotStrings', LotCtrl.getLotsStrings);
router.get('/lotStringsIds', LotCtrl.getLotsStringsIds);

module.exports = router;
