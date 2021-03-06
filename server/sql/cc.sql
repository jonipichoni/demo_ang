use demo_ang;

DROP TABLE credit_card;

CREATE TABLE credit_card
( 
  id INT PRIMARY KEY NOT NULL IDENTITY(1,1),
  exp_date DATE,
  number VARCHAR(20),
  name VARCHAR(50)
);

INSERT INTO credit_card (exp_date, number, name)
VALUES 
('20180621 10:34:09 AM', '377019918350765', 'American Express'),
('20180622 10:34:09 AM', '36315731073011', 'Diners Club'),
('20180623 10:34:09 AM', '6011098199796887', 'Discover'),
('20180624 10:34:09 AM', '201455645768550', 'enRoute'),
('20180625 10:34:09 AM', '5383938520504090', 'MasterCard'),
('20180626 10:34:09 AM', '4532288311898852', 'Visa'),
('20180627 10:34:09 AM', '11111111111111', 'Test'),
('20180628 10:34:09 AM', '123456789', 'Test');