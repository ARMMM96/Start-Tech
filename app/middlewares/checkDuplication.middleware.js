// middleware/checkDuplicate.js

const checkDuplicate = (modelName, attributeName) => async (req, res, next) => {
    const value = req.body[attributeName];
    const duplicate = await modelName.findOne({ [attributeName]: value });
    if (duplicate) {
        return res.status(409).json({ message: `${attributeName} already exists` });
    }
    next();
};

module.exports = checkDuplicate;
