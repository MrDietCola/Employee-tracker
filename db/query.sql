-- SELECT *
-- FROM course_names;

-- SELECT department, COUNT(id) AS number_courses
-- FROM course_names
-- GROUP BY department;

-- SELECT department, SUM(total_enrolled) AS sum_enrolled
-- FROM course_names
-- GROUP BY department;

-- SELECT *
-- FROM course_names
-- JOIN department ON course_names.department = department.id;

SELECT
  e1.first_name AS employee_first_name,
  e1.last_name AS employee_last_name,
  e2.first_name AS manager_first_name,
  e2.last_name AS manager_last_name
FROM
  employee e1
LEFT JOIN
  employee e2
ON
  e1.manager_id = e2.id;
