import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

import { Mouse_Instance, Mouse_Attributes } from './mouse';
import { Breed_Instance, Breed_Attributes } from './breed';

export interface Breed_Mouse_Attributes {
  id?: number;
  breed?: Breed_Attributes | Breed_Attributes['id'];
  mouse?: Mouse_Attributes | Mouse_Attributes['id'];
};

export interface Breed_Mouse_Instance extends Sequelize.Instance<Breed_Mouse_Attributes>, Breed_Mouse_Attributes {
  getBreed: Sequelize.BelongsToGetAssociationMixin<Breed_Instance>;
  setBreed: Sequelize.BelongsToSetAssociationMixin<Breed_Instance, Breed_Instance["id"]>;
  createBreed: Sequelize.BelongsToCreateAssociationMixin<Breed_Attributes>;

  getMouse: Sequelize.BelongsToGetAssociationMixin<Mouse_Instance>;
  setMouse: Sequelize.BelongsToSetAssociationMixin<Mouse_Instance, Mouse_Instance["id"]>;
  createMouse: Sequelize.BelongsToCreateAssociationMixin<Mouse_Attributes>;
};

export const Breed_Mouse_Factory = (sequelize: Sequelize.Sequelize): Sequelize.Model<Breed_Mouse_Instance, Breed_Mouse_Attributes> => {
  const attributes: SequelizeAttributes<Breed_Mouse_Attributes> = {

  };

  const Breed_Mouse = sequelize.define<Breed_Mouse_Instance, Breed_Mouse_Attributes>('Breed_Mouse', attributes);

  Breed_Mouse.associate = models => {
    Breed_Mouse.belongsTo(models.breed, { as: 'breed' });
    Breed_Mouse.belongsTo(models.mouse, { as: 'mouse' });
  };

  return Breed_Mouse;
};