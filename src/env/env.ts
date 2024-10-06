import { z } from 'zod'
import  dotenv  from 'dotenv'

dotenv.config()

export const envSchema = z.object({
    NODE_PORT: z.coerce.number(),
    NODE_ENV: z.string(),
    DB_FILE_PATH: z.string(),
})

const env = envSchema.parse(process.env)

export default env;