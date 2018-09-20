

module.exports = {
    up(queryInterface, Sequelize) {
        const add_unkown_count = queryInterface.addColumn(
            'Breeds', 'unknown_count',
            {
                type: Sequelize.INTEGER,
            },
        );
        return Promise.all([add_unkown_count]);
    },
    down(queryInterface, Sequelize) {
        const remove_unknown_count = queryInterface.removeColumn('Breeds', 'unknown_count');
        return Promise.all([remove_unknown_count]);
    },
};
