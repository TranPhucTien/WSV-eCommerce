import mongoose from "mongoose";
import os from "os";

const _SECONDS = 5000;

// count connect
const countConnect = () => {
    const numCollections = mongoose.connections.length;
    console.log(`Number of connection: ${numCollections}`)

    return numCollections;
}

// check overload
const checkOverload = () => {
    setInterval(() => {
        const numCollections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        // Example maximum number of connections based on number of cores
        const maxConnections = numCores * 5;

        console.log(`Active connections::${numCollections}`)
        console.log(`Memory usage::${memoryUsage / 1024 / 1024} MB`)

        if (numCores > maxConnections) {
            console.log(`Connection overload detected`)
        }

    }, _SECONDS); // Monitor every 5 seconds
}

export {
    countConnect,
    checkOverload
}