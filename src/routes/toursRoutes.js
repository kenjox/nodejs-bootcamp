const express = require('express');

const {
  createNewTour,
  getAllTours,
  getTourById,
  updateTourById,
  deleteTourById,
} = require('../controllers/tours');

const router = express.Router();

router.route('/').get(getAllTours).post(createNewTour);
router
  .route('/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = router;
