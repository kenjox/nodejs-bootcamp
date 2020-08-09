const fs = require('fs');
const express = require('express');

const app = express();

// Temp data store
const dbFile = `${__dirname}/../dev-data/tours-simple.json`;
const tours = JSON.parse(fs.readFileSync(dbFile, 'utf-8'));

// Middlewares
app.use(express.json());

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTourById = (req, res) => {
  const id = req.params.id * 1; // Convert string to number trick 😎
  const tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid id:${id}`,
    });
  }

  res.status(200).json({
    status: 'success',
    data: tour,
  });
};

const createNewTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;

  const newTour = { ...req.body, id: newId };
  tours.push(newTour);

  fs.writeFile(dbFile, JSON.stringify(tours, null, 2), (err) => {
    if (err) console.log(err);
    res.status(201).json({
      status: 'success',
      data: newTour,
    });
  });
};

const updateTourById = (req, res) => {
  const id = req.params.id * 1;

  let tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid id:${id}`,
    });
  }

  tour = { ...tour, ...req.body };

  //TODO: skipped updating the file
  res.status('200').json({
    status: 'success',
    data: tour,
  });
};

const deleteTourById = (req, res) => {
  const id = req.params.id * 1;

  let tour = tours.find((tour) => tour.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: `Invalid id:${id}`,
    });
  }

  //TODO: skipped updating the file
  res.status('204').json({
    status: 'success',
    data: null,
  });
};

// Routes

// // All tours
// app.get('/api/v1/tours', getAllTours);

// // Get single tour by id
// app.get('/api/v1/tours/:id', getTourById);

// // Create new tour
// app.post('/api/v1/tours', createNewTour);

// // Update single tour
// app.patch('/api/v1/tours/:id', updateTourById);

// // Delete t
// app.delete('/api/v1/tours/:id', deleteTourById);

app.route('/api/v1/tours').get(getAllTours).post(createNewTour);

app
  .route('/api/v1/tours/:id')
  .get(getTourById)
  .patch(updateTourById)
  .delete(deleteTourById);

module.exports = { app };
