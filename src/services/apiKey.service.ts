import apiKeyModule from "../models/apiKey.module";

const findById = async (key: string) => {
    // const keyHashed = crypto.randomBytes(64).toString('hex')
    // const newKey = await apiKeyModule.create({ key: keyHashed, permissions: ['0000']})
    // console.log("newKey: ", newKey)
    const objKey = await apiKeyModule.findOne({key, status: true}).lean()
    return objKey;
}

export {
    findById
}