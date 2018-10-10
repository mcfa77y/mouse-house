import * as Sequelize from "sequelize";
import { SequelizeAttributes } from '../../typings/SequelizeAttributes';

interface Mouse_Attributes {
  id?: number;
  id_alias: string;
  ear_tag: string;
  dob: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  note_id: number;
  sex_id: number;
  genotype_id: number;
  status_id: number;
  cage_id: number;
}
type Mouse_Instance = Sequelize.Instance<Mouse_Attributes> & Mouse_Attributes;

export default (sequelize: Sequelize.Sequelize) => {
    const attributes: SequelizeAttributes<Mouse_Attributes> = {
        id_alias: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        ear_tag: Sequelize.STRING,
        dob: Sequelize.DATE,
    };

    const Mouse: any =  sequelize.define<Mouse_Instance, Mouse_Attributes>('Mouse', attributes, {
        underscored: true,
        timestamps: true,
        paranoid: true,
    });

   
    Mouse.associate = (models) => {
        Mouse.Cage = Mouse.belongsTo(models.Cage);
        Mouse.Breeds = Mouse.belongsToMany(models.Breed, { through: 'Breed_Mouse' });

        Mouse.Sex = Mouse.belongsTo(models.Enum, {
            as: 'sex',
            foreignKey: 'sex_id',
            scope: {
                type: 'SEX',
            },
        });
        Mouse.Genotype = Mouse.belongsTo(models.Enum, {
            as: 'genotype',
            foreignKey: 'genotype_id',
            scope: {
                type: 'MOUSE_GENOTYPE',
            },
        });
        Mouse.Status = Mouse.belongsTo(models.Enum, {
            as: 'status',
            foreignKey: 'status_id',
            scope: {
                type: 'MOUSE_STATUS',
            },
        });

        Mouse.Note = Mouse.belongsTo(models.Note, {
            as: 'note',
            foreignKey: 'note_id',
        });
    }
    return Mouse;
};
