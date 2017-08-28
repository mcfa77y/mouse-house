sequelize model:create --name Enum --attributes 'description:string, type:string' --underscored --paranoid --force

sequelize model:create --name Note --attributes 'note:text' --underscored --paranoid --force

sequelize model:create --name Breed --attributes 'id_alias:string, pairing_date:date, plug_date:date, pup_check_date:date, ween_date:date, male_count:integer, female_count:integer' --underscored --paranoid --force

sequelize model:create --name Cage --attributes 'id_alias:string, name:string, setup_date:date, update_date:date, end_date:date' --underscored --paranoid --force

sequelize model:create --name Mouse --attributes 'id_alias:string, ear_tag:string, dob:date' --underscored --paranoid --force

sequelize db:migrate; sequelize db:seed:all;


sequelize model:create --name Breed_Mouse --attributes 'breed_id:integer, mouse_id:integer' --underscored --paranoid --force
