const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config({ path: '../config.env' });
const Tour = require('../src/models/tour');

mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Successfully connected to database'));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('successfull imported');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Db emptied');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--delete') {
  deleteAllData();
} else if (process.argv[2] === '--import') {
  importData();
}
