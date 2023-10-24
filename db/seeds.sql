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
  ('Financial Analyst', 65000, 4);
  ('Graphic Designer', 60000, 3),
  ('Sales Associate', 45000, 5),
  ('Human Resources Specialist', 70000, 1),
  ('Customer Support Representative', 40000, 6),
  ('Data Scientist', 110000, 2),
  ('Project Manager', 90000, 7),
  ('Senior Software Engineer', 120000, 2),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Smith', 1, NULL),
  ('Sarah', 'Johnson', 2, NULL),
  ('Michael', 'Brown', 3, 1),
  ('Lisa', 'Davis', 4, 1),
  ('William', 'Anderson', 5, 2),
  ('Jessica', 'Lee', 6, 2),
  ('David', 'Martin', 3, 1),
  ('Jennifer', 'Harris', 7, 2),
  ('James', 'White', 3, 1),
  ('Susan', 'Hall', 8, 3),
  ('Joseph', 'King', 9, 3),
  ('Linda', 'Turner', 4, 1),  
  ('Thomas', 'Wright', 5, 2),
  ('Maria', 'Baker', 6, 2);

INSERT INTO role (title, salary, department_id)
VALUES
  ('Graphic Designer', 60000, 3),
  ('Sales Associate', 45000, 5),
  ('Human Resources Specialist', 70000, 1),
  ('Customer Support Rep', 40000, 6),
  ('Data Scientist', 110000, 2),
  ('Project Manager', 90000, 7),
  ('Senior Software Engineer', 120000, 2);


  INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES   ('Michael', 'Brown', 3, 1),
  ('Lisa', 'Davis', 4, 1),
  ('William', 'Anderson', 5, 2),
  ('Jessica', 'Lee', 6, 2),
  ('David', 'Martin', 3, 1),
  ('Jennifer', 'Harris', 7, 2),
  ('James', 'White', 3, 1),
  ('Susan', 'Hall', 8, 3),
  ('Joseph', 'King', 9, 3),
  ('Linda', 'Turner', 4, 1),  
  ('Thomas', 'Wright', 5, 2),
  ('Maria', 'Baker', 6, 2);