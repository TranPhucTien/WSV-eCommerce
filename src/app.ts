import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectDb from "./dbs/init.mongodb"
import {checkOverload} from "./helpers/check.connect";
import dotenv from "dotenv";
import routers from "./routers";

dotenv.config();

// init app
const app = express();

// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

// init db
connectDb;
// checkOverload();

// init router
app.use('/', routers)

// handling error

export default app;