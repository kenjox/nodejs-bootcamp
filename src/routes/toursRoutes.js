const express = require('express');
const authController = require('../controllers/auth/auth');

const {
  createNewTour,
  getAllTours,
  getTourById,
  updateTourById,
  deleteTourById,
} = require('../controllers/tours');

const router = express.Router();

router.route('/').get(authController.protect, getAllTours).post(createNewTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTourById
  );

module.exports = router;
