module.exports = {
    isAuthenticated: function (req, res, next) {
        if (!req.user) {
            return res.status(403).json({
                error: 'login'
            });
        }
        return next();
    }
};