const { analyticsService, analyticsHistoryService } = require("../services/analytics.service");
const { logger } = require("../utils/logger");




const analytics = async (req, res) => {
        const {year, month, day, range} = req.query;
    try {

        const analyticsSummary = await analyticsService(year, month, day, range);
        res.status(200).json({
            status: true,
            message: "get time sucessfully",
            data: analyticsSummary
        });

    }catch(error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
        return logger.error(error);
    }
};

const analyticsHistory = async (req, res) => {
        const {year, month, day, range} = req.query;
    try {

        const analyticsSummary = await analyticsHistoryService(year, month, day, range);
        res.status(200).json({
            status: true,
            message: "get time sucessfully",
            data: analyticsSummary
        });

    }catch(error) {
        res.status(500).json({
            status: false,
            message: error.message,
        });
        return logger.error(error);
    }
};

module.exports = {
    analytics,
    analyticsHistory
};