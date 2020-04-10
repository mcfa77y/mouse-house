
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('Image_Metadata', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },

        size: { type: Sequelize.STRING },
        wavelength: { type: Sequelize.INTEGER },
        sector: { type: Sequelize.INTEGER },
        uri: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
        },

        molecule_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Molecules',
                key: 'id',
            },
        },

        experiment_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Experiments',
                key: 'id',
            },
        },

        created_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('Image_Metadata'),
};
