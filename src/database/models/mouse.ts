import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { Note_Instance, Note_Attributes } from './note';
import { Enum_Instance, Enum_Attributes } from './enum';
import { Cage_Instance, Cage_Attributes } from './cage';
import { Breed_Instance, Breed_Attributes } from './breed';
import { Breed_Mouse_Instance, Breed_Mouse_Attributes } from './breed_mouse';

export interface Mouse_Attributes {
    id?: number;
    id_alias: string;
    ear_tag: string;
    dob: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    sex: 'female' | 'male' | 'unknown';
    genotype?: Enum_Attributes | Enum_Attributes['id'];
    status?: Enum_Attributes | Enum_Attributes['id'];
    cage?: Cage_Attributes | Cage_Attributes['id'];
    note?: Note_Attributes | Note_Attributes['id'];
    breeds?: Breed_Attributes | Breed_Attributes['id'][];
};

/*
node index.js \
      -b Mouse \
      -a Enum         Note        Enum        Cage        Breed \
      -s Genotype     Note        Status      Cage        Breed \
      -p _            _           _           _           Breeds \
      -t BelongsTo    BelongsTo   BelongsTo   BelongsTo   BelongsToMany \
      -j _            _           _           _           Breed_Mouse
*/

export interface Mouse_Instance extends Sequelize.Instance<Mouse_Attributes>, Mouse_Attributes {
    getGenotype: Sequelize.BelongsToGetAssociationMixin<Enum_Instance>;
    setGenotype: Sequelize.BelongsToSetAssociationMixin<Enum_Instance, Enum_Instance["id"]>;
    createGenotype: Sequelize.BelongsToCreateAssociationMixin<Enum_Attributes>;

    getNote: Sequelize.BelongsToGetAssociationMixin<Note_Instance>;
    setNote: Sequelize.BelongsToSetAssociationMixin<Note_Instance, Note_Instance["id"]>;
    createNote: Sequelize.BelongsToCreateAssociationMixin<Note_Attributes>;

    getStatus: Sequelize.BelongsToGetAssociationMixin<Enum_Instance>;
    setStatus: Sequelize.BelongsToSetAssociationMixin<Enum_Instance, Enum_Instance["id"]>;
    createStatus: Sequelize.BelongsToCreateAssociationMixin<Enum_Attributes>;

    getCage: Sequelize.BelongsToGetAssociationMixin<Cage_Instance>;
    setCage: Sequelize.BelongsToSetAssociationMixin<Cage_Instance, Cage_Instance["id"]>;
    createCage: Sequelize.BelongsToCreateAssociationMixin<Cage_Attributes>;

    getBreeds: Sequelize.BelongsToManyGetAssociationsMixin<Breed_Instance>;
    setBreeds: Sequelize.BelongsToManySetAssociationsMixin<Breed_Instance, Breed_Instance["id"], Breed_Mouse_Attributes>;
    addBreeds: Sequelize.BelongsToManyAddAssociationsMixin<Breed_Instance, Breed_Instance["id"], Breed_Mouse_Attributes>;
    addBreed: Sequelize.BelongsToManyAddAssociationMixin<Breed_Instance, Breed_Instance["id"], Breed_Mouse_Attributes>;
    createBreed: Sequelize.BelongsToManyCreateAssociationMixin<Breed_Attributes, Breed_Instance["id"], Breed_Mouse_Attributes>;
    removeBreed: Sequelize.BelongsToManyRemoveAssociationMixin<Breed_Instance, Breed_Instance["id"]>;
    removeBreeds: Sequelize.BelongsToManyRemoveAssociationsMixin<Breed_Instance, Breed_Instance["id"]>;
    hasBreed: Sequelize.BelongsToManyHasAssociationMixin<Breed_Instance, Breed_Instance["id"]>;
    hasBreeds: Sequelize.BelongsToManyHasAssociationsMixin<Breed_Instance, Breed_Instance["id"]>;
    countBreeds: Sequelize.BelongsToManyCountAssociationsMixin;
};

export const Mouse_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Mouse_Instance, Mouse_Attributes> => {
    const attributes: SequelizeAttributes<Mouse_Attributes> = {
        id_alias: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        ear_tag: Sequelize.STRING,
        dob: Sequelize.DATE,
        sex: Sequelize.ENUM('female', 'male', 'unknown'),
    }

    const Mouse: any = sequelize.define<Mouse_Instance, Mouse_Attributes>('Mouse', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    Mouse.associate = (model: any) => {
        Mouse.Cage = Mouse.belongsTo(model.Cage);
        Mouse.Breeds = Mouse.belongsToMany(model.Breed, { through: 'Breed_Mouse' });

        // Mouse.Sex = Mouse.belongsTo(model.Enum, {
        //     as: 'sex',
        //     foreignKey: 'sex_id',
        //     scope: {
        //         type: 'SEX',
        //     },
        // });

        Mouse.Genotype = Mouse.belongsTo(model.Enum, {
            as: 'genotype',
            foreignKey: 'genotype_id',
            scope: {
                type: 'MOUSE_GENOTYPE',
            },
        });
        Mouse.Status = Mouse.belongsTo(model.Enum, {
            as: 'status',
            foreignKey: 'status_id',
            scope: {
                type: 'MOUSE_STATUS',
            },
        });

        Mouse.Note = Mouse.belongsTo(model.Note, {
            as: 'note',
            foreignKey: 'note_id',
        });
    }

    return Mouse;
};