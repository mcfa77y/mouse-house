import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface Note_Attributes {
    id?: number;
    text: string;
};

export interface Note_Instance extends Sequelize.Instance<Note_Attributes>, Note_Attributes {

};

export const Note_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Note_Instance, Note_Attributes> => {
    const attributes: SequelizeAttributes<Note_Attributes> = {
        text: Sequelize.TEXT
    }
    const Note = sequelize.define<Note_Instance, Note_Attributes>('Note', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

    return Note;
};