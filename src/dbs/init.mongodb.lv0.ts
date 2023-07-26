import mongoose from "mongoose"

const connectString = `mongodb://0.0.0.0:27017/shopDEV`;

mongoose.connect(connectString)
    .then(_ => console.log(`Connected mongodb success`))
    .catch(err => console.log(`Error connect: ${err}`))

export default mongoose