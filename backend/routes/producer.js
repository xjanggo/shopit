const express = require('express')
const router = express.Router();


const {
    getProducers,
    getAdminProducers,
    newProducer,
    getSingleProducer,
    updateProducer,
    deleteProducer
} = require('../controllers/producerController')

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');


router.route('/producers').get(getProducers);
router.route('/admin/producers').get(getAdminProducers);
router.route('/producer/:id').get(getSingleProducer);

router.route('/admin/producer/new').post(isAuthenticatedUser, authorizeRoles('admin'), newProducer);

router.route('/admin/producer/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProducer)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProducer);

module.exports = router;