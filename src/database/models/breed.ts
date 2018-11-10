import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { Enum_Instance, Enum_Attributes } from './Enum';
import { Mouse_Instance, Mouse_Attributes } from './Mouse';
import { Note_Instance, Note_Attributes } from './Note';

export interface Breed_Attributes {
    id?: number;
    id_alias: string;
    pairing_date: string;
    plug_date: string;
    pup_check_date: string;
    litter_date: string;
    ween_date: string;
    male_count: number,
    female_count: number,
    unknown_count: number,
    genotype?: Enum_Instance | Enum_Instance['id'];
    status?: Enum_Instance | Enum_Instance['id'];
    note?: Note_Attributes | Note_Attributes['id'];
    female?: Mouse_Attributes | Mouse_Attributes['id'];
    male?: Mouse_Attributes | Mouse_Attributes['id'];
}

/*
node index.js \
    -b Breed \
    -a Enum         Mouse       Mouse       Note        Enum \
    -s Genotype     Male        Female      Note        Status \
    -t BelongsTo    BelongsTo   BelongsTo   BelongsTo   
*/

export interface Breed_Instance extends Sequelize.Instance<Breed_Attributes>, Breed_Attributes {
    getGenotype: Sequelize.BelongsToGetAssociationMixin<Enum_Instance>;
    setGenotype: Sequelize.BelongsToSetAssociationMixin<Enum_Instance, Enum_Instance["id"]>;
    createGenotype: Sequelize.BelongsToCreateAssociationMixin<Enum_Attributes>;

    getMale: Sequelize.BelongsToGetAssociationMixin<Mouse_Instance>;
    setMale: Sequelize.BelongsToSetAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
    createMale: Sequelize.BelongsToCreateAssociationMixin<Mouse_Attributes>;

    getFemale: Sequelize.BelongsToGetAssociationMixin<Mouse_Instance>;
    setFemale: Sequelize.BelongsToSetAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
    createFemale: Sequelize.BelongsToCreateAssociationMixin<Mouse_Attributes>;

    getNote: Sequelize.BelongsToGetAssociationMixin<Note_Instance>;
    setNote: Sequelize.BelongsToSetAssociationMixin<Note_Instance, Note_Instance["id"]>;
    createNote: Sequelize.BelongsToCreateAssociationMixin<Note_Attributes>;

    getStatus: Sequelize.BelongsToGetAssociationMixin<Enum_Instance>;
    setStatus: Sequelize.BelongsToSetAssociationMixin<Enum_Instance, Enum_Instance["id"]>;
    createStatus: Sequelize.BelongsToCreateAssociationMixin<Enum_Attributes>;
};

export const Breed_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Breed_Instance, Breed_Attributes> => {
    const attributes: SequelizeAttributes<Breed_Attributes> = {
        id_alias: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        pairing_date: Sequelize.DATE,
        plug_date: Sequelize.DATE,
        pup_check_date: Sequelize.DATE,
        litter_date: Sequelize.DATE,
        ween_date: Sequelize.DATE,
        male_count: { type: Sequelize.INTEGER, defaultValue: 0 },
        female_count: { type: Sequelize.INTEGER, defaultValue: 0 },
        unknown_count: { type: Sequelize.INTEGER, defaultValue: 0 },
    }

    const Breed: any = sequelize.define<Breed_Instance, Breed_Attributes>('Breed', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    Breed.associate = (model: any) => {
        Breed.Male = Breed.belongsTo(model.Mouse, { as: 'male', foreignKey: 'male_id' });
        Breed.Female = Breed.belongsTo(model.Mouse, { as: 'female', foreignKey: 'female_id' });
        Breed.Note = Breed.belongsTo(model.Note, { as: 'note', foreignKey: 'note_id' });
        Breed.belongsTo(model.Enum, { as: 'status', foreignKey: 'status_id' });
        Breed.belongsTo(model.Enum, { as: 'genotype', foreignKey: 'genotype_id' });
    }

    return Breed;
};


