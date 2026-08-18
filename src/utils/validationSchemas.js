import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Student name must be at least 2 characters"),
  regNo: z.string().regex(/^\d{10}$/, "Registration Number must be exactly 10 digits (e.g., 2021331001)"),
  department: z.enum(["CSE", "EEE", "ETE", "CE", "ME"], {
    errorMap: () => ({ message: "Please select a valid engineering department" })
  }),
  session: z.enum(["2020-21", "2021-22", "2022-23", "2023-24"], {
    errorMap: () => ({ message: "Please select an academic session" })
  }),
  email: z.string().email("Please enter a valid email address (e.g. name@sec.ac.bd)"),
  phone: z.string().min(11, "Phone number must be at least 11 digits (e.g. +8801712345678)"),
  fineDue: z.coerce.number().min(0, "Fine due cannot be negative").default(0)
});

export const bookSchema = z.object({
  title: z.string().min(2, "Book title is required"),
  author: z.string().min(2, "Author name is required"),
  isbn: z.string().min(10, "ISBN must be at least 10 characters (e.g. 9780132350884)"),
  category: z.enum(
    [
      "Programming",
      "Database",
      "Networking",
      "Software Engineering",
      "Mathematics",
      "Physics",
      "Electronics",
      "Electrical Engineering",
      "Civil Engineering",
      "Mechanical Engineering"
    ],
    { errorMap: () => ({ message: "Please select a category" }) }
  ),
  department: z.enum(["CSE", "EEE", "ETE", "CE", "ME"], {
    errorMap: () => ({ message: "Please select a department" })
  }),
  totalCopies: z.coerce.number().min(1, "Total copies must be at least 1"),
  availableCopies: z.coerce.number().min(0, "Available copies cannot be negative").optional(),
  coverImage: z.string().url("Please enter a valid cover image URL").optional().or(z.literal(""))
});

export const issueBookSchema = z.object({
  studentRegNo: z.string().min(1, "Student Registration Number is required"),
  bookId: z.string().min(1, "Please select a book to issue"),
  dueDate: z.string().min(1, "Due date is required"),
  notes: z.string().optional()
});

export const reservationSchema = z.object({
  studentRegNo: z.string().min(1, "Student Registration Number is required"),
  bookId: z.string().min(1, "Please select a book to hold")
});

export const loginSchema = z.object({
  regNo: z.string().trim().min(2, "Registration number is required"),
  password: z.string().min(1, "Password is required")
});
