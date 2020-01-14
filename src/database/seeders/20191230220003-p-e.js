
const faker = require('faker');
const _ = require('underscore');
const squel = require('squel');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const create_fake_proj = () => ({
            name: faker.hacker.noun(),
            note: faker.lorem.paragraph(),
            created_at: new Date(),
            updated_at: new Date(),
        });

        const PROJ_COUNT = 10;
        const projects = _.range(PROJ_COUNT).map(() => create_fake_proj());

        await queryInterface.bulkInsert('Projects', projects);

        console.log('finished creating projects');

        const create_fake_exp = () => ({
            name: faker.hacker.noun(),
            note: faker.lorem.paragraph(),
            grid_data_uri: faker.internet.url(),
            metadata_uri: faker.internet.url(),
            image_config: JSON.stringify({ foo: 'bar' }, null, 2),
            tag_config: JSON.stringify({ fizz: 'buzz' }, null, 2),
            created_at: new Date(),
            updated_at: new Date(),
        });


        const EXPR_COUNT = 10;
        const experiments = _.range(EXPR_COUNT)
            .map(() => create_fake_exp());
        experiments.forEach((expr) => {
            console.log(expr);
        });

        console.log('start creating experiments');
        await queryInterface.bulkInsert('Experiments', experiments);
        console.log('finished creating exeriments');

        const create_fake_proj_exp = (project_id, experiment_id) => ({
            project_id,
            experiment_id,
            created_at: new Date(),
            updated_at: new Date(),
        });


        const query_proj_ids = squel.select()
            .from('public."Projects"')
            .field('id')
            .toString();
        const proj_id_list = await queryInterface.sequelize.query(query_proj_ids, { type: Sequelize.QueryTypes.SELECT })
            .then((results) => results)
            .map((result) => result.id)
            .catch((error) => {
                console.error(`error: ${error}`);
            });
        const query_expr_ids = squel.select()
            .from('public."Experiments"')
            .field('id')
            .toString();
        const expr_id_list = await queryInterface.sequelize.query(query_expr_ids, { type: Sequelize.QueryTypes.SELECT })
            .then((results) => results)
            .map((result) => result.id)
            .catch((error) => {
                console.error(`error: ${error}`);
            });
        const ASSOC_COUNT = 4;
        const p_e_promises = _.flatten(expr_id_list.map((expr_id) => {
            const samples = _.sample(proj_id_list, _.random(ASSOC_COUNT) + 1);
            samples.forEach((sample) => {
                console.log(`sample: ${sample}`);
            });
            return samples.map((proj_id) => {
                console.log(`pairing e: ${expr_id} p: ${proj_id}`);
                const bar = create_fake_proj_exp(proj_id, expr_id);
                console.log(`bar: ${JSON.stringify(bar, null, 2)}`);

                return queryInterface.bulkInsert('Project_Experiments', [bar]);
            });
        }));

        console.log('starting createing pe');
        await Promise.all(p_e_promises);
        console.log('finised creating pe');
    },

    down: (queryInterface, Sequelize) => {
        const x = queryInterface.bulkDelete('Experiments', null, {});
        const y = queryInterface.bulkDelete('Projects', null, {});
        const z = queryInterface.bulkDelete('Project_Experiments', null, {});
        return Promise.all([x, y, z]);
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
    },
};
