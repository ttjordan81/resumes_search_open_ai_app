const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const cors = require('cors');
const history = require('connect-history-api-fallback');
const helmet = require('helmet');
const logger = require('./src/middleware/ahp-logger');
const isAuthenticated = require('./src/middleware/is-authenticated');
const express = require('express');
const sequelize = require('./src/infrastructure/database');
const { HttpStatusCode } = require('./src/common/constants');
require('./src/models/associations');

const app = express();

/**
 * Route Imports
 */
const accountRoute = require('./src/routes/accountRoute');
const adminRoute = require('./src/routes/adminRoute');
const authRoute = require('./src/routes/authRoute');
const quoteRoute = require('./src/routes/quoteRoute');

/**
 * Middleware configurations 
 */
app.use(helmet());

// Handles the CORS headers
app.use(cors());
app.options('*', cors()); // enable pre-flight

// Handles the SPA browser history
//app.use(history());

// Allows static files to be served from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Parse incoming requests with JSON payloads - limit files to 50mb
app.use(express.json({ limit: '50mb' }));

// Setup default view engine and set the views folder
app.set('views', path.join(__dirname,'src', 'views'));
app.set('view engine', 'ejs');

app.use(logger);

/**
 * Route mappings
 */
app.use('/auth', authRoute);

// Beyond this point, all routes are authenticated
app.use(isAuthenticated);
app.use(logger);

app.use('/account', accountRoute);
app.use('/admin', adminRoute);
app.use('/quote', quoteRoute);

// Catch all request
app.use((req, res, next) => {
    res.status(HttpStatusCode.NOT_FOUND).send('Resource not found');
});

// Catch all errors
app.use((err, req, res, next) => {
    let errorMessage  = "Server error";

    if (process.env.NODE_ENV === 'development' || err?.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR) {
        errorMessage = err.message;
    }

    res.status(err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR);
    res.send(errorMessage);
});

sequelize.sync({ force: true }).then(() => {
    console.log('Database & tables created!');
});

const PORT = process.env.PORT || 3001;

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');

        app.listen(PORT, () => {
            if (process.env.NODE_ENV === 'development') {
                console.log(`Database host: ${process.env.DB_HOST}`);
                console.log(`Database name: ${process.env.DB_NAME}`);
            }
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (err) {
        console.error('Unable to connect to database:', err);
    }
})();