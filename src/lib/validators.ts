import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters." }).max(20, { message: "Username cannot be more than 20 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    confirmPassword: z.string(),
    contactNumber: z.string().min(5, { message: "Please enter a valid contact number." }),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export const createWithdrawalPasscodeSchema = z
  .object({
    newPasscode: z
      .string()
      .length(4, { message: "Passcode must be 4 digits." })
      .regex(/^\d{4}$/, { message: "Passcode must only contain digits." }),
    confirmPasscode: z.string(),
  })
  .refine((data) => data.newPasscode === data.confirmPasscode, {
    message: "Passcodes do not match.",
    path: ["confirmPasscode"],
  });
  
export const changeWithdrawalPasscodeSchema = z
  .object({
    currentPasscode: z.string().min(1, "Current passcode is required."),
    newPasscode: z
      .string()
      .length(4, { message: "Passcode must be 4 digits." })
      .regex(/^\d{4}$/, { message: "Passcode must only contain digits." }),
    confirmPasscode: z.string(),
  })
  .refine((data) => data.newPasscode === data.confirmPasscode, {
    message: "Passcodes do not match.",
    path: ["confirmPasscode"],
  })
  .refine((data) => data.currentPasscode !== data.newPasscode, {
    message: "New passcode must be different from the current one.",
    path: ["newPasscode"],
  });
