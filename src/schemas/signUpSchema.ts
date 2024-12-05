import { z } from 'zod'


export const usernameValidation = z.string()
    .min(2,'UserName must be atleast 2 characters long')
    .max(20,'UserName must not be longer than 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/,'UserName should not contain special characters');

export const signUpSchema = z.object({
    username : usernameValidation,
    password : z.string().min(6,'Password must be at least 6 characters'),
    email : z.string().email({message: 'Invalid email address'}),
});

