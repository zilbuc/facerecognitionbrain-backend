BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('metiva', 'metiva@gmail.com', 0, '2019-01-01');
INSERT into login (hash, email) values ('$2a$10$qYbNNZQGPbJLBWXvIw6E7.DAMiTGCmYe5QB.ay7FTovJ/uQ6xZOK2', 'metiva@gmail.com');

COMMIT;
