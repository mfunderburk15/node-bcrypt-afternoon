const { response } = require("express");

module.exports = {
    dragonTreasure: async (request, response) => {
        const treasure = await request.app.get('db').get_dragon_treasure(1);
        return response.status(200).send(treasure);
    },

    getUserTreasure: async (request, response) => {
        const userTreasure = await request.app.get('db').get_user_treasure([request.session.user.id]);
        return response.status(200).send(userTreasure);
    },

    addUserTreasure: async (request, response) => {
        const { treasureURL } = request.body;
        const { id } = request.session.user;
        const userTreasure = await request.app.get('db').add_user_treasure([treasureURL, id]);
        return response.status(200).send(userTreasure);
    },
    getAllTreasure: async (request, response) => {
        const allTreasure = await request.app.get('db').get_all_treasure()
        return response.status(200).send(allTreasure)
    }
};