import { TimetableSlot } from "../types/index";

// Temporary mock data — replace with a real API call to /api/timetable
// once Phase 2 (DB schema) is done. Shape matches what that endpoint
// will eventually return.
export const MOCK_TIMETABLE: TimetableSlot[] = [
  { id: "1", subject: "Data Structures", teacher: "Dr. Rao", day_of_week: 0, start_time: "09:00", end_time: "09:50" },
  { id: "2", subject: "Discrete Math", teacher: "Prof. Iyer", day_of_week: 0, start_time: "10:00", end_time: "10:50" },
  { id: "3", subject: "Physics Lab", teacher: "Dr. Menon", day_of_week: 0, start_time: "11:00", end_time: "12:40" },
  { id: "4", subject: "Data Structures", teacher: "Dr. Rao", day_of_week: 1, start_time: "09:00", end_time: "09:50" },
  { id: "5", subject: "English", teacher: "Ms. Fernandes", day_of_week: 1, start_time: "10:00", end_time: "10:50" },
  { id: "6", subject: "AIML Foundations", teacher: "Dr. Shah", day_of_week: 1, start_time: "11:00", end_time: "11:50" },
  { id: "7", subject: "Discrete Math", teacher: "Prof. Iyer", day_of_week: 2, start_time: "09:00", end_time: "09:50" },
  { id: "8", subject: "Data Structures Lab", teacher: "Dr. Rao", day_of_week: 2, start_time: "10:00", end_time: "11:40" },
  { id: "9", subject: "AIML Foundations", teacher: "Dr. Shah", day_of_week: 3, start_time: "09:00", end_time: "09:50" },
  { id: "10", subject: "Physics", teacher: "Dr. Menon", day_of_week: 3, start_time: "10:00", end_time: "10:50" },
  { id: "11", subject: "English", teacher: "Ms. Fernandes", day_of_week: 4, start_time: "09:00", end_time: "09:50" },
  { id: "12", subject: "Data Structures", teacher: "Dr. Rao", day_of_week: 4, start_time: "10:00", end_time: "10:50" },
];