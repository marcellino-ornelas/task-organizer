/*
 * Modules
 */

const path = require('path');
const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const middleware = require('./routes/middleware');
require('./models');

/*
 * Create the app
 */
const app = express();

/*
 * App config
 */
const PORT = process.env.PORT || 3000;

/*
 * Middleware
 */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*
 * Routes
 */
app.use(routes);

app.listen(PORT, function() {
  console.log('server is running on port 3000');
});
