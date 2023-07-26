import app from "./src/app"
import config from "./src/configs/config.mongodb"

const PORT = config.app.port;

const server = app.listen(PORT, () => {
    console.log(`WSV eCommerce start with ${PORT}`)
})

process.on('SIGTERM', () => {
    server.close(() => console.log(`Exit Server Express`));
})