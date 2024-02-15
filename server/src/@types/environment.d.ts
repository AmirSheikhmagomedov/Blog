declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      DATABASE_LINK: string
      CLIENT_LINK: string
      JWT_SECRET_KEY: string
    }
  }
}

export {}
