

sequelize model:create --name Breed --attributes 'id_alias:string, pairing_date:date, plug_date:date, pup_check_date:date, ween_date:date, male_count:integer, female_count:integer, notes:text' --underscored --paranoid --force


sequelize model:create --name Cage --attributes 'id_alias:string, name:string, setup_date:date, update_date:date, end_date:date, notes:text' --underscored --paranoid --force


sequelize model:create --name Enum2 --attributes 'description:string, type:string' --underscored --paranoid --force


sequelize model:create --name Mouse --attributes 'id_alias:string, ear_tag:string, dob:date, notes:text' --underscored --paranoid --force