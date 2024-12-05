import { z } from 'zod'

export const messageSchema = z.object({
    content : z.string().
    min(10,'Message should be atleast 10 characters long').
    max(150,'Message can be atmost 150 characters long')
})