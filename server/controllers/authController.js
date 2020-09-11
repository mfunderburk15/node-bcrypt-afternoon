const bcrypt = require('bcryptjs');

module.exports = {
    register: async (request, response) => {
        const { username, password, isAdmin } = req.body;
        const db = request.app.get('db');
        const result = await db.get_user([username]);
        const existingUser = result[0];
        if (existingUser) {
            return response.status(409).send('Username taken');
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        const registeredUser = await db.register_user([isAdmin, username, hash]);
        const user = registeredUser[0];
        request.session.user = { isAdmin: user.is_admin, username: user.username, id: user.id };
        return response.status(201).send(request.session.user);
    },

    login: async (request, response) => {
        const { username, password } = request.body;
        const foundUser = await request.app.get('db').get_user([username]);
        const user = foundUser[0];
        if (!user) {
            return response.status(401).send('User  not found. Please register as a new user before logging in.');
        }
        const isAuthenticated = bcrypt.compareSync(password, user.hash);
        if (!isAuthenticated) {
            return response.status(403).send('Incorrect password');
        }
        request.session.user = { isAdmin: user.is_admin, id: user.id, username: user.username };
        return response.send(req.session.user);
    },

    logout: (request, response) => {
        request.session.destroy();
        return response.sendStatus(200);
    }
};