const Tour = require('../../models/tour');
const APIFeatures = require('../../utils/api-features');
const catchAsync = require('../../utils/catch-async');
const AppErrorHandler = require('../../utils/errors-utils');

const getAllTours = catchAsync(async (req, res) => {
  const apiFeatures = new APIFeatures(Tour.find(), req.query);
  apiFeatures.filter().limitFields().sort().paginate();
  const tours = await apiFeatures.query;

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

const getTourById = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findById(tourId);

  if (!tour) {
    return next(
      new AppErrorHandler(`Could not fetch tour by ID ${tourId}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

const createNewTour = catchAsync(async (req, res) => {
  const tour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: tour,
  });
});

const updateTourById = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;

  const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(
      new AppErrorHandler(`Could not update tour by ID ${tourId}`, 404)
    );
  }

  res.status('200').json({
    status: 'success',
    data: tour,
  });
});

const deleteTourById = catchAsync(async (req, res, next) => {
  const tourId = req.params.id;
  const tour = await Tour.findByIdAndDelete();

  if (!tour) {
    return next(
      new AppErrorHandler(`Could not delete tour by ID ${tourId}`, 404)
    );
  }

  res.status('204').json({
    status: 'success',
    data: null,
  });
});

module.exports = {
  getAllTours,
  getTourById,
  createNewTour,
  updateTourById,
  deleteTourById,
};
