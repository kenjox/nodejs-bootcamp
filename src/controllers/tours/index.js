const Tour = require('../../models/tour');

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    console.log(err);
  }
};

const createNewTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: err,
    });
  }
};

const updateTourById = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status('200').json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: err,
    });
  }
};

const deleteTourById = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status('204').json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      data: err,
    });
  }
};

module.exports = {
  getAllTours,
  getTourById,
  createNewTour,
  updateTourById,
  deleteTourById,
};
