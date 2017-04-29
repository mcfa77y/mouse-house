create table ENUM (did INTEGER primary key not null,
code varchar(64),
description varchar (64));


CREATE TABLE MOUSE (did INTEGER not null,
genotype_id integer not null,
dob date not null,
sex_id integer not null,
ear_tag integer, 
status_id integer not null,
breader_id integer,	
cage_id integer,
notes varchar (1024),
primary key (did),
CONSTRAINT mouse_genotype_id_fkey FOREIGN KEY (genotype_id)
      REFERENCES enum (did) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO action,
 CONSTRAINT mouse_sex_id_fkey FOREIGN KEY (sex_id)
      REFERENCES enum (did) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO action,
 CONSTRAINT mouse_status_id_fkey FOREIGN KEY (status_id)
      REFERENCES enum (did) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO action);

CREATE TABLE CAGE (did INTEGER not null,
TYPE_ID integer not null,
setup_date date not null,
end_date date,
update_date date,
notes varchar (1024),
primary key (did),
CONSTRAINT CAGE_TYPE_ID_fkey FOREIGN KEY (TYPE_id)
      REFERENCES enum (did) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO action);
      
CREATE TABLE BREED (did INTEGER not null,
pairing_date date not null,
plug_date date,
pup_check_date date,
litter_dob date,
ween_date date,
male_count integer,
female_count integer,
status_ID integer,
notes varchar (1024),
primary key (did),
CONSTRAINT BREED_Status_ID_fkey FOREIGN KEY (Status_ID)
      REFERENCES enum (did) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO action);

