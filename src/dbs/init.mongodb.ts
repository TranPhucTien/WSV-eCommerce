import mongoose from "mongoose"
import {countConnect} from "../helpers/check.connect";
import config from "../configs/config.mongodb"

const {db} = config;
const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;

class Database {
    private static instance: Database;

    constructor() {
        this.connect();
    }

    // connect
    connect(type = "mongodb") {
        // dev environment
        if (1 === 1) {
            mongoose.set("debug", true);
            mongoose.set("debug", {color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
            .then(_ => {
                console.log(`Connected mongodb success PRO`, countConnect())
            })
            .catch(err => console.log(`Error connect: ${err}`))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDb = Database.getInstance();

export default instanceMongoDb;