module.exports = {
    usersOnly: (request, response, next) => {
        if (!request.session.user) {
            return response.status(401).send('Please log in')
        }
        next()
    },
    adminsOnly: (request, response, next) => {
        if (!request.session.user.isAdmin) {
            return response.status(403).send('You are not an admin');
        }
        next()
    }
}