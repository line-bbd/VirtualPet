-- Insert data into [User] table
INSERT INTO [User] ([last_seen], [username], [password])
VALUES
    ('2023-05-12 10:00:00', 'JohnDoe', 'password123'),
    ('2023-05-11 15:30:00', 'JaneSmith', 'qwerty456');

INSERT INTO [Pet] ([user_id], [name], [date_created], [type])
VALUES
    (1, 64436552, 'Fluffy', '2023-05-12 10:30:00', 'Dog'),
    (1, 64436539, 'Whiskers', '2023-05-10 14:45:00', 'Cat'),
    (2, 64436532, 'Buddy', '2023-05-11 09:15:00', 'Dog');

-- Insert data into [Pet_stats] table
INSERT INTO [Pet_stats] ([pet_id], [hunger], [bordem], [health], [thirst], [hygiene])
VALUES
    (1, 5, 3, 8, 4, 7),
    (2, 2, 7, 6, 5, 9),
    (3, 6, 4, 9, 3, 6);