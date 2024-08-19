import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import * as expresWinston from "express-winston"
import * as winstonOpt from "./config/winston"
import routes from "./routes";
import appRoot from "app-root-path"
const app = express()
const port = process.env.PORT
dotenv.config()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${appRoot}/../public`))
app.use('/document', express.static(`${appRoot}/../upload`))
app.use(cors())
app.use(expresWinston.logger(winstonOpt.combineOpt))
app.use("/", routes)
app.use(expresWinston.errorLogger(winstonOpt.errorOpt))
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(500).send({ message: "ERROR!!", data: {} })
})
app.listen(port, () => console.log(`API Connected on Port ${port}`))