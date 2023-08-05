import _ from "lodash"

const getInfoData = <T extends string>(props: { fields?: T[], object: Record<T, any> }): Record<T, any> => {
    const {fields = [], object} = props;
    return _.pick(object, fields);
};

export {
    getInfoData
}