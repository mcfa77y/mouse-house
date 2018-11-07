import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';
import { Note_Instance, Note_Attributes } from './note';
import { Enum_Instance, Enum_Attributes } from './enum';
import { Mouse_Instance, Mouse_Attributes } from './mouse';

export interface Cage_Attributes {
    id?: number;
    id_alias: string;
    end_date?: string;
    type?: Enum_Instance | Enum_Instance['id'];
    note?: Note_Attributes | Note_Attributes['id'];
    mice?: Mouse_Attributes | Mouse_Attributes['id'][];
};
/*
node index.js \
      -b Cage \
      -a Enum         Note        Mouse \
      -s Type         Note        Mouse \
      -t BelongsTo    BelongsTo   HasMany \
      -p  _           _           Mice
*/
export interface Cage_Instance extends Sequelize.Instance<Cage_Attributes>, Cage_Attributes {
    getType: Sequelize.BelongsToGetAssociationMixin<Enum_Instance>;
    setType: Sequelize.BelongsToSetAssociationMixin<Enum_Instance, Enum_Instance["id"]>;
    createType: Sequelize.BelongsToCreateAssociationMixin<Enum_Attributes>;

    getNote: Sequelize.BelongsToGetAssociationMixin<Note_Instance>;
    setNote: Sequelize.BelongsToSetAssociationMixin<Note_Instance, Note_Instance["id"]>;
    createNote: Sequelize.BelongsToCreateAssociationMixin<Note_Attributes>;

    getMice: Sequelize.HasManyGetAssociationsMixin<Mouse_Instance>;
    setMice: Sequelize.HasManySetAssociationsMixin<Mouse_Instance, Mouse_Instance["id"]>;
    addMice: Sequelize.HasManyAddAssociationsMixin<Mouse_Instance, Mouse_Instance["id"]>;
    addMouse: Sequelize.HasManyAddAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
    createMouse: Sequelize.HasManyCreateAssociationMixin<Mouse_Attributes, Mouse_Instance>;
    removeMouse: Sequelize.HasManyRemoveAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
    removeMice: Sequelize.HasManyRemoveAssociationsMixin<Mouse_Instance, Mouse_Instance["id"]>;
    hasMouse: Sequelize.HasManyHasAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
    hasMice: Sequelize.HasManyHasAssociationsMixin<Mouse_Instance, Mouse_Instance["id"]>;
    countMice: Sequelize.HasManyCountAssociationsMixin;
};

export const Cage_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Cage_Instance, Cage_Attributes> => {
    const attributes: SequelizeAttributes<Cage_Attributes> = {
        id_alias: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        end_date: Sequelize.DATE,
    }
    const Cage: any = sequelize.define<Cage_Instance, Cage_Attributes>('Cage', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    Cage.associate = (models: any) => {
        Cage.Type = Cage.belongsTo(models.Enum, { as: 'type', foreignKey: 'type_id' });
        Cage.Note = Cage.belongsTo(models.Note, { as: 'note', foreignKey: 'note_id' });
        Cage.Mice = Cage.hasMany(models.Mouse, { as: 'mice', foreignKey: 'cage_id' });
    }
    return Cage;
};