import Config from '../models/Config.js'; // Adjust the path as needed

// Define shift types and their corresponding start and end times
const shiftTypes = [
  { type: "Morning", startTime: "08:00", endTime: "14:00" },
  { type: "Evening", startTime: "14:00", endTime: "20:00" },
  { type: "Night", startTime: "20:00", endTime: "08:00" }, // End time of Night wraps around to next day
];

// Days of the week
const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// Function to generate shifts for each day and shift type and save to MongoDB
const generateShiftsAndSave = async () => {
  try {
    // Clear existing shifts (optional, depending on your needs)
    //await Config.deleteMany({});

    // Generate shifts for each day and shift type
    const shifts = [];
    daysOfWeek.forEach(day => {
      shiftTypes.forEach(shiftType => {
        shifts.push({
          shiftDetail: shiftType.type,
          day: day,
          startTime: shiftType.startTime,
          endTime: shiftType.endTime,
          numberOfEmployees: 5, // Modify as needed
        });
      });
    });

    // Save shifts to MongoDB using Mongoose
    await Config.insertMany(shifts, {
        // Specify a maximum time in milliseconds for the operation
        maxTimeMS: 30000, // 30 seconds
      });
    console.log('Shifts saved successfully.');

  } catch (error) {
    console.error('Error saving shifts:', error);
  }
};

// Example usage:
generateShiftsAndSave();