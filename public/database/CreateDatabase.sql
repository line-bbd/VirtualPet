CREATE DATABASE VirtualPetDB
GO

USE VirtualPetDB


CREATE TABLE [User] (
  [user_id] int PRIMARY KEY IDENTITY(1, 1),
  [last_seen] datetime,
  [username] nvarchar(255),
  [password] nvarchar(255)
)
GO

CREATE TABLE [Pet] (
  [pet_id] int PRIMARY KEY IDENTITY(1, 1),
  [external_pet_id] int UNIQUE,
  [user_id] int,
  [name] nvarchar(255),
  [date_created] datetime,
  [type] nvarchar(10),
)
GO

CREATE TABLE [Pet_stats] (
  [pet_id] int PRIMARY KEY,
  [hunger] int,
  [bordem] int,
  [health] int,
  [thirst] int,
  [hygiene] int
)
GO

ALTER TABLE [Pet] ADD FOREIGN KEY ([user_id]) REFERENCES [User] ([user_id])
GO

ALTER TABLE [Pet_stats] ADD FOREIGN KEY ([pet_id]) REFERENCES [Pet] ([pet_id])
GO
