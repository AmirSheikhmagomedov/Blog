import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { JwtPayload } from 'jsonwebtoken'

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload

    req.userId = decoded.id

    next()
  } catch (error) {
    return res.status(403).json({ error: 'No access' })
  }
}
