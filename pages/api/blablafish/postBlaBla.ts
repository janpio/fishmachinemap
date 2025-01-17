import { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { prisma } from '@/lib/db'
import { postBlablaFish } from '../controllers/blablaFish'

const postBlaBlaFish = async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
        // Si el token no está presente en el encabezado de autorización
        // devolver un error o un mensaje de que el token es inválido
        return res.status(401).json({ error: 'Token no válido' })
    }

    try {
        const decodedToken = jwt.verify(token, 'token') as JwtPayload
        const userId = decodedToken.userId
        const {
            departureCity,
            arrivalCity,
            departureTime,
            description,
            price,
            phone,
            date,
        } = req.body

        const data = await postBlablaFish({
            departureCity,
            arrivalCity,
            departureTime,
            description,
            price,
            phone,
            date,
            userId,
        })

        return res.status(200).json(data)
    } catch (error) {
        // Si ocurre un error al verificar el token (por ejemplo, el token es inválido o ha expirado),
        // devolver un error o un mensaje de que el token es inválido
        return res.status(401).json({ error: 'Token no válido' })
    }
}

export default postBlaBlaFish
