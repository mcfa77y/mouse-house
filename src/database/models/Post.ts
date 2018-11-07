import * as Sequelize from 'sequelize';
import { CommentAttributes, CommentInstance } from 'models/Comment';
import { UserAttributes, UserInstance } from 'models/User';
import { SequelizeAttributes } from 'typings/SequelizeAttributes';


export interface Breed_Mouse_Attributes {
  id?: number;
  name: string;
  title: string;
  text: string;
  category: 'tech' | 'croissants' | 'techno';
  createdAt?: Date;
  updatedAt?: Date;
  comments?: CommentAttributes[] | CommentAttributes['id'][];
  author?: UserAttributes | UserAttributes['id'];
};

export interface Breed_Mouse_Instance extends Sequelize.Instance<Breed_Mouse_Attributes>, Breed_Mouse_Attributes {
  
};

export const Breed_Mouse_Factory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<Breed_Mouse_Instance, Breed_Mouse_Attributes> => {
  const attributes: SequelizeAttributes<Breed_Mouse_Attributes> = {
   
  };

  const Breed_Mouse = sequelize.define<Breed_Mouse_Instance, Breed_Mouse_Attributes>('Breed_Mouse', attributes);

  Breed_Mouse.associate = models => {
    
  };

  return Breed_Mouse;
};