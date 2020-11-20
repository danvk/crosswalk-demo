import bodyParser from 'body-parser';
import express from 'express';
import * as fs from 'fs';
import swaggerUI from 'swagger-ui-express';
import {TypedRouter, apiSpecToOpenApi} from 'crosswalk';

import {API} from './api';
import * as movies from './movies';

const apiSchema = JSON.parse(fs.readFileSync('./src/api.schema.json', 'utf8'));

const app = express();
app.use(bodyParser.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(apiSpecToOpenApi(apiSchema)));

const typedRouter = new TypedRouter<API>(app, apiSchema);

movies.register(typedRouter);
typedRouter.assertAllRoutesRegistered();

app.listen(4567, () => {
  console.log(
    `App is running at http://localhost:4567. Try visiting http://localhost:4567/docs`
  );
});
