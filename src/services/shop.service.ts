import shopModule from "../models/shop.module";

interface IFindByEmail {
    email: string,
    select?: {
        email: number,
        password: number,
        name: number,
        status: number,
        roles: number
    }
}

class ShopService {
    static findByEmail = async ({ email = "", select = {
        email: 1,
        password: 2,
        name: 1,
        status: 1,
        roles: 1
    }} : IFindByEmail ) => {
        return await shopModule.findOne({ email }).select(select).lean().exec();
    }
}

export default ShopService