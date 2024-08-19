import sys
import json
import pulp
from datetime import datetime

def allocate_shifts(employees_data, shifts_data):
    num_employees = len(employees_data)
    total_shifts = len(shifts_data)

    # Constraints for each employee
    c = [emp['maximumShifts'] for emp in employees_data]

    # Required number of employees per shift
    required_employees_per_shift = [shift['requiredEmployees'] for shift in shifts_data]

    # Create the LP problem
    prob = pulp.LpProblem("ShiftScheduling", pulp.LpMaximize)

    # Variables
    x = pulp.LpVariable.dicts("x", ((i, j) for i in range(num_employees) for j in range(total_shifts)), cat='Binary')

    # Objective function (maximize the total number of shifts assigned)
    prob += pulp.lpSum(x[i, j] for i in range(num_employees) for j in range(total_shifts))

    # Constraints
    for j in range(total_shifts):
        prob += pulp.lpSum(x[i, j] for i in range(num_employees)) == required_employees_per_shift[j]

    for i in range(num_employees):
        prob += pulp.lpSum(x[i, j] for j in range(total_shifts)) <= c[i]

    # Blocked shifts and maximum one shift per day constraint
    day_shifts = {}
    for j, shift in enumerate(shifts_data):
        date = shift['date'].split('T')[0]  # Extract date part
        if date not in day_shifts:
            day_shifts[date] = []
        day_shifts[date].append(j)

    for i in range(num_employees):
        for date, shift_indices in day_shifts.items():
            prob += pulp.lpSum(x[i, j] for j in shift_indices) <= 1

    for i in range(num_employees):
        for j, shift in enumerate(shifts_data):
            employee_shift = next((s for s in employees_data[i]['requestedShifts'] 
                                   if s['date'].split('T')[0] == shift['date'].split('T')[0] and s['shiftType'] == shift['type']), None)
            if employee_shift and not employee_shift['available']:
                prob += x[i, j] == 0

    # Solve the problem
    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    # Prepare the results
    results = {"assignments": []}
    for i in range(num_employees):
        for j in range(total_shifts):
            if x[i, j].varValue > 0:
                results["assignments"].append({
                    "employee": employees_data[i]['userId'],
                    "shift": shifts_data[j]['_id']
                })

    return results

# if __name__ == "__main__":
#     with open('employees_data.json', 'r') as f:
#         employees_data = json.load(f)
#     with open('shifts_data.json', 'r') as f:
#         shifts_data = json.load(f)
#     results = allocate_shifts(employees_data, shifts_data)
#     print(json.dumps(results))
if __name__ == "__main__":
    employees_data = json.loads(sys.argv[1])
    shifts_data = json.loads(sys.argv[2])
    results = allocate_shifts(employees_data, shifts_data)
    print(json.dumps(results))