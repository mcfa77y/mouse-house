// src/typings/DbInterface/index.d.ts
import * as Sequelize from "sequelize";
import { Breed_Attributes, Breed_Instance } from "../../database/models/Breed";
import { Cage_Attributes, Cage_Instance } from "../../database/models/Cage";
import { Enum_Attributes, Enum_Instance } from "../../database/models/Enum";
import { Mouse_Attributes, Mouse_Instance } from "../../database/models/Mouse";
import { Note_Attributes, Note_Instance } from "../../database/models/Note";
import { Breed_Mouse_Attributes, Breed_Mouse_Instance } from "../../database/models/Breed_Mouse";

export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  Breed: Sequelize.Model<Breed_Instance, Breed_Attributes>;
  Breed_Mouse: Sequelize.Model<Breed_Mouse_Instance, Breed_Mouse_Attributes>;
  Cage: Sequelize.Model<Cage_Instance, Cage_Attributes>;
  Enum: Sequelize.Model<Enum_Instance, Enum_Attributes>;
  Mouse: Sequelize.Model<Mouse_Instance, Mouse_Attributes>;
  Note: Sequelize.Model<Note_Instance, Note_Attributes>;
  [key:string]: any; // Add index signature
}