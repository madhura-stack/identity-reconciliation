const identifyService = require("../services/identifyService");

const identify = async (req, res) => {
    try {
        const { email, phoneNumber } = req.body;

        if (!email && !phoneNumber) {
            return res.status(400).json({
                message: "Email or phoneNumber is required"
            });
        }

        const result = await identifyService.identify(email, phoneNumber);

        return res.status(200).json(result);

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

module.exports = { identify };