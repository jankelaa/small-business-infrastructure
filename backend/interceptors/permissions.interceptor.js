module.exports = userPermissionType => {
    return async (req, res, next) => {
        try {
            const { permissions } = res.locals.user;
            const permission = JSON.parse(permissions[userPermissionType]);

            if (!permission) {
                res.status(403).send(new ErrorResponse('You don\'t have permission to call this method.'));
                return;
            }

            next();
        } catch (error) {
            handleResponseException(res, error);
        }
    }
}