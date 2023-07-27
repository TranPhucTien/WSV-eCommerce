import express, {NextFunction, Request, Response} from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectDb from "./dbs/init.mongodb"
import {checkOverload} from "./helpers/check.connect";
import dotenv from "dotenv";
import routers from "./routers";
import {ErrorResponse} from "./core/error.response";

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
app.use((req, res, next) => {
    const error = new ErrorResponse("Not Found");
    error.status = 404
    next(error)
})

app.use((error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500;

    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || 'Internal server error'
    })
})

export default app;