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

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('John', 'Doe', 1, NULL),
  ('Alice', 'Smith', 2, NULL), 
  ('Bob', 'Johnson', 3, 1), 
  ('Ella', 'Brown', 4, 1); 
