CREATE DATABASE bookDB;

CREATE TABLE book(
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(20),
    description VARCHAR(255)
);

INSERT INTO book(id,name,description)
VALUES
(101,x,beautiful book);

SELECT * FROM book;
SELECT * FROM book where id=101;
DELETE FROM book where id=101;
UPDATE book SET name="Sindabad",description="This is fiction and fairytale book" WHERE id=101;