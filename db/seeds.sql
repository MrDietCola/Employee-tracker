INSERT INTO department (department_name)
VALUES
  ('HR'),
  ('Engineering'),
  ('Marketing'),
  ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES
  ('HR Manager', 75000, 1),
  ('Software Engineer', 80000, 2),
  ('Marketing Manager', 70000, 3),
  ('Financial Analyst', 65000, 4),
  ('Graphic Designer', 60000, 3),
  ('Sales Associate', 45000, 2),
  ('Human Resources Specialist', 70000, 1),
  ('Customer Support Rep', 40000, 1),
  ('Data Scientist', 110000, 2),
  ('Project Manager', 90000, 1),
  ('Senior Software Engineer', 120000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES   
  ('Michael', 'Brown', 3, null),
  ('Lisa', 'Davis', 4, null),
  ('William', 'Anderson', 5, null),
  ('Jessica', 'Lee', 5, null),
  ('David', 'Martin', 3, null),
  ('Jennifer', 'Harris', 2, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  
  ('James', 'White', 3, 1),
  ('Susan', 'Hall', 5, 3),
  ('Joseph', 'King', 5, 3),
  ('Linda', 'Turner', 4, 1),  
  ('Thomas', 'Wright', 5, 2),
  ('Maria', 'Baker', 6, 2);