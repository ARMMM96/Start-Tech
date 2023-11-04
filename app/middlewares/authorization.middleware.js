const routeModel = require("../database/models/route.model")
const resHelper = require("../helpers/helpers")

const authorization = async (req, res, next) => {
    const currentUrl = req.originalUrl
    try {
        const routes = await routeModel.findOne({ url: currentUrl })
        if (!routes) {
            resHelper.resHandler(res, 404, false, routes, "Route is not exist into routes data colection")
        } else {
            const findRule = routes.roles.find(role => {
                return role.toString() == req.user.role.toString()
            })
            if (findRule) {
                next()
            } else {
                resHelper.resHandler(res, 401, false, null, "Unauthorized request")

            }
        }

    }
    catch (err) {
        resHelper.resHandler(res, 500, false, err.message, "Unauthorized request")
    }
}
module.exports = { authorization }