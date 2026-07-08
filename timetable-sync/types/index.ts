export type Provider = "google" | "apple";

export type ModalStep = "input" | "preview" | "connecting" | "success";

export interface TimetableSlot {
  id: string;
  subject: string;
  teacher?: string;
  day_of_week: number; // 0 = Monday ... 4 = Friday
  start_time: string; // "09:00"
  end_time: string; // "09:45"
}

export interface StudentLookup {
  roll_number: string;
  class_id: string;
}
