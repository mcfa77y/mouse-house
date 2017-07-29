drop table IF EXISTS ENUM_TYPE cascade;
drop table IF EXISTS ENUM cascade;
drop table IF EXISTS MOUSE cascade;
drop table IF EXISTS CAGE cascade;
drop table IF EXISTS BREED cascade;
drop table IF EXISTS breed_mouse cascade;
drop table IF EXISTS cage_mouse cascade;

create table ENUM_TYPE (
      id SERIAL not null,
      code varchar(64),
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0 ,
      primary key (id),
      UNIQUE (code));

create table ENUM (
      id SERIAL not null,
      enum_type_id integer,
      description varchar (64),
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT enum_enum_type_id_fkey FOREIGN KEY (enum_type_id)
            REFERENCES enum_type (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action);

CREATE TABLE MOUSE (
      id SERIAL not null,
      id_alias SERIAL not null,
      genotype_id integer not null,
      dob date not null,
      sex_id integer not null,
      ear_tag integer,
      status_id integer not null,
      notes varchar (1024),
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT mouse_genotype_id_fkey FOREIGN KEY (genotype_id)
            REFERENCES enum (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
       CONSTRAINT mouse_sex_id_fkey FOREIGN KEY (sex_id)
            REFERENCES enum (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
       CONSTRAINT mouse_status_id_fkey FOREIGN KEY (status_id)
            REFERENCES enum (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action);



CREATE TABLE CAGE (
      id SERIAL not null,
      id_alias SERIAL not null,
      TYPE_ID integer not null,
      setup_date date not null,
      end_date date,
      update_date date,
      notes varchar (1024),
      name varchar (64),
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT CAGE_TYPE_ID_fkey FOREIGN KEY (TYPE_id)
            REFERENCES enum (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action);

CREATE TABLE BREED (
      id SERIAL not null,
      id_alias SERIAL not null,
      pairing_date date not null,
      plug_date date,
      pup_check_date date,
      litter_dob date,
      ween_date date,
      male_count integer,
      female_count integer,
      status_ID integer,
      notes varchar (1024),
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT BREED_Status_ID_fkey FOREIGN KEY (Status_ID)
            REFERENCES enum (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action);

CREATE TABLE CAGE_MOUSE (
      id SERIAL not null,
      mouse_id integer not null,
      cage_id integer not null,
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT cm_mouse_id_fkey FOREIGN KEY (mouse_id)
            REFERENCES mouse (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
       CONSTRAINT cm_cage_id_fkey FOREIGN KEY (cage_id)
            REFERENCES cage (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
       CONSTRAINT cage_mouse_uniq UNIQUE (mouse_id,cage_id)

      );


CREATE TABLE BREED_MOUSE (
      id SERIAL not null,
      mouse_male_id integer not null,
      mouse_female_id integer not null,
      breed_id integer not null,
      create_timestamp timestamp default current_timestamp,
      modify_timestamp timestamp,
      soft_delete integer default 0,
      primary key (id),
      CONSTRAINT bm_mouse_male_id_fkey FOREIGN KEY (mouse_male_id)
            REFERENCES mouse (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
      CONSTRAINT bm_mouse_female_id_fkey FOREIGN KEY (mouse_female_id)
            REFERENCES mouse (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action,
       CONSTRAINT bm_breed_id_fkey FOREIGN KEY (breed_id)
            REFERENCES breed (id) MATCH SIMPLE
            ON UPDATE NO ACTION ON DELETE NO action),
       CONSTRAINT breed_mouse_uniq UNIQUE (mouse_male_id,mouse_female_id,breed_id)
);

insert into enum_type (code, modify_timestamp) values('SEX', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'SEX'), 'female', current_timestamp);
insert into enum ( enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'SEX'), 'male', current_timestamp);

insert into enum_type (code, modify_timestamp) values('BREED_STATUS', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'BREED_STATUS'), '0', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'BREED_STATUS'), '1', current_timestamp);

insert into enum_type (code, modify_timestamp) values('CAGE_TYPE', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'CAGE_TYPE'), 'stock', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'CAGE_TYPE'), 'breeder', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'CAGE_TYPE'), 'experimental', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'CAGE_TYPE'), 'terminated', current_timestamp);

insert into enum_type (code, modify_timestamp) values('MOUSE_STATUS', current_timestamp);
      insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_STATUS'), '0', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_STATUS'), '1', current_timestamp);

insert into enum_type (code, modify_timestamp) values('MOUSE_GENOTYPE', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_GENOTYPE'), 'Goldenticket', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_GENOTYPE'), 'Rag2', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_GENOTYPE'), 'B6', current_timestamp);
insert into enum (enum_type_id, description, modify_timestamp) values((select id from enum_type where code = 'MOUSE_GENOTYPE'), 'IRF 3/7 -/- dKO', current_timestamp);



INSERT INTO public.mouse
     (id,
      id_alias,
       genotype_id,
       dob,
       sex_id,
       ear_tag,
       status_id,
       notes,
       create_timestamp,
       modify_timestamp,
       soft_delete)
VALUES(nextval('mouse_id_seq'::regclass), 101,
      (select e.id from enum e where e.description like 'Goldenticket'),
      '2016-05-14 16:33:48',
      (select e.id from enum e where e.description like 'male'),
      37,
      (select e.id from enum e where e.description like '0' and e.enum_type_id = (select et.id from enum_type et where et.code like 'MOUSE_STATUS')),
      'i am mikey mouse',
      now(),
      now(),
      0);


INSERT INTO public.mouse
      (id,
       id_alias,
       genotype_id,
       dob,
       sex_id,
       ear_tag,
       status_id,
       notes,
       create_timestamp,
       modify_timestamp,
       soft_delete)
VALUES(nextval('mouse_id_seq'::regclass), 102,
      (select e.id from enum e where e.description like 'Rag2'),
      '2016-05-14 16:33:48',
      (select e.id from enum e where e.description like 'female'),
      37,
      (select e.id from enum e where e.description like '1' and e.enum_type_id = (select et.id from enum_type et where et.code like 'MOUSE_STATUS')),
      'i am minerva mouse',
      now(),
      now(),
      0);

INSERT INTO public.cage
      (id,
      id_alias,
      type_id,
      setup_date,
      end_date,
      update_date,
      notes,
      name,
      create_timestamp,
      modify_timestamp,
      soft_delete)
VALUES(nextval('cage_id_seq'::regclass),
      301,
      (select e.id from enum e where e.description like 'breeder'),
      now(),
      now(),
      now(),
      'viva la raza',
      'Mexico City',
      now(),
      now(),
      0);


INSERT INTO public.cage
      (id,
      id_alias,
      type_id,
      setup_date,
      end_date,
      update_date,
      notes,
      name,
      create_timestamp,
      modify_timestamp,
      soft_delete)
VALUES(nextval('cage_id_seq'::regclass),
      302,
      (select e.id from enum e where e.description like 'stock'),
      now(),
      now(),
      now(),
      'Guten Tag',
      'Munich',
      now(),
      now(),
      0);