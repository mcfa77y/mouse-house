
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('Platemaps', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING },
        id_384: { type: Sequelize.STRING },
        id_ucsc_csc: { type: Sequelize.STRING },
        library: { type: Sequelize.STRING },
        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Platemaps'),
};
