import express from 'express';
import "express-async-errors";
import { setupRoutes } from './startup/routes.js';
import { setupDatabase } from './startup/database.js';
import { logger } from './startup/logging.js';
import { startupConfig } from './startup/config.js';
import { setupValidation } from './startup/validation.js';

const app = express();
setupRoutes(app);
setupDatabase();
startupConfig();
setupValidation();

app.listen(3000, () => {
    logger.info('Server started on port 3000');
});


// process.on('uncaughtException', (ex) => {
//     // console.log('WE GOT AN Unhadled EXCEPTION');
//     logger.error(ex.message, ex);
//     process.exit(1);
// });

// throw new Error('Something failed during startup!');

// process.on('uncaughtRejection', (ex) => {
//     // console.log('WE GOT AN Unhadled EXCEPTION');
//     logger.error(ex.message, ex);
//     process.exit(1);
// });


// const p = Promise.reject(new Error('Something failed miserably!'));
// p.then(() => console.log('Done'));


