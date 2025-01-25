
-- recommended to add users via api/register in postman instead

INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@example.com', 'first_use_file_named_hashNewPassword', 'admin'), 
(2, 'janedoe', 'jane.doe@example.com', 'first_use_file_named_hashNewPassword', 'employee'),
(3, 'johnsmith', 'john.smith@example.com', 'first_use_file_named_hashNewPassword', 'client');


UPDATE employees 
SET name = 'Jane Doe', phone = '123456789', specialisation = 'Cosmetologist' 
WHERE user_id = 2;

UPDATE clients 
SET name = 'John Smith', phone = '987654321', address = '123 Beauty Lane' 
WHERE user_id = 3;

INSERT INTO services (id, name, price, duration, description) VALUES
(1, 'Manicure', 50.00, 60, 'Profesjonalny manicure, który sprawi, że Twoje dłonie będą wyglądać pięknie'),
(2, 'Pedicure', 70.00, 90, 'Relaksujący pedicure z masażem stóp'),
(3, 'Facial', 100.00, 75, 'Odmładzający zabieg na twarz, który nadaje skórze blasku'),
(4, 'Strzyżenie', 120.00, 60, 'Proste strzyżenie'),
(5, 'Strzyżenie dzieci', 50.00, 30, 'Strzyżenie dzieci do lat 12');

INSERT INTO appointments (id, client_id, employee_id, service_id, date, notes) VALUES
(1, 1, 1, 1, '2025-01-20 10:00:00', 'Client prefers pastel colors'),
(2, 1, 1, 3, '2025-01-22 15:00:00', 'Special care for sensitive skin');

INSERT INTO employee_services (id, employee_id, service_id) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3);

-- recommended to add sessions via api/login in postman instead

INSERT INTO sessions (user_id, refresh_token, token, created_at, token_expires_at, refresh_token_expires_at) VALUES
(1, 'refresh_token_admin', 'access_token_admin', CURRENT_TIMESTAMP, '2025-01-20 12:00:00', '2025-02-20 12:00:00'),
(2, 'refresh_token_jane', 'access_token_jane', CURRENT_TIMESTAMP, '2025-01-21 12:00:00', '2025-02-21 12:00:00'),
(3, 'refresh_token_john', 'access_token_john', CURRENT_TIMESTAMP, '2025-01-22 12:00:00', '2025-02-22 12:00:00');

