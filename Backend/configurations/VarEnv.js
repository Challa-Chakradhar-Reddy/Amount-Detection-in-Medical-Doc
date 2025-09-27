import dotenv from 'dotenv'
dotenv.config()

export const VarEnv = {
    GROQ_API_KEY: process.env.GROQ_API,
    NGROK: process.env.NGROK,
    PORT: process.env.PORT 
}