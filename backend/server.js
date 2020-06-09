const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

// TODO: Require route files
const apiRoutes = require('./routes/api-routes');

// load env vars
dotenv.config({ path: './config/config.env' });

const app = express();

app.use(bodyParser.json());
// enable CORS

app.use(cors());


// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// TODO: Mount routers
app.use('/api', apiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;

// Route to frontend homepage
app.get("/", (req, res) => res.end("Welcome to foodapp!"));

app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
