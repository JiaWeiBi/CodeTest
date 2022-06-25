import dotenv from "dotenv";
dotenv.config()

import express from 'express';
import bodyParser from 'body-parser';
import * as shopifyProductApi from './shopify/product';

const app = express();

app.use(bodyParser.json())


app.set("port", process.env.PORT || 3000);
app.set("env", process.env.NODE_ENV || 'dev');

app.post('/product', shopifyProductApi.importProducts);

export default app;