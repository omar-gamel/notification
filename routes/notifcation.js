const express = require('express');
const controllerNotification = require('../controller/notification');
const jwtAuth = require('../passport');

const router = express.Router();

router.post('/', jwtAuth.authenticate(), controllerNotification.create);

router.get('/', controllerNotification.getAll);

router.put('/seen',  jwtAuth.authenticate(), controllerNotification.makeAllSeen);

router.put('/seen/:notificationId',  jwtAuth.authenticate(), controllerNotification.seenById);

router.delete('/',  jwtAuth.authenticate(), controllerNotification.deleteAll);

router.delete('/:notificationId',  jwtAuth.authenticate(), controllerNotification.deleteById);

module.exports = router;
