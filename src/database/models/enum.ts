import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

export interface Enum_Attributes {
    id?: number;
    description: string;
    type: string;
}


export interface Enum_Instance extends Sequelize.Instance<Enum_Attributes>, Enum_Attributes {

}

export const Enum_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Enum_Instance, Enum_Attributes> => {
    const attributes: SequelizeAttributes<Enum_Attributes> = {
        description: { type: Sequelize.STRING, unique: 'compositeIndex' },
        type: { type: Sequelize.STRING, unique: 'compositeIndex' }
    }
    const Enum = sequelize.define<Enum_Instance, Enum_Attributes>('Enum', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });
    return Enum;
};