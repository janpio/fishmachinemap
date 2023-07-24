import { NextApiRequest, NextApiResponse } from 'next'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { toogleLikeMarker } from '../controllers/feed'

const markerIsLiked = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method == 'POST') {
            const token = req.headers.authorization?.split(' ')[1] // Obtener el token del encabezado de autorización
            if (!token) {
                throw new Error('Token de autenticación no proporcionado')
            }
            const decodedToken = jwt.verify(token, 'token') as JwtPayload // Decodificar el token y especificar el tipo como JwtPayload
            const userId = decodedToken.userId // Obtener el ID del usuario desde el token decodificado
            const { markerId } = req.body // Obtiene los datos del cuerpo de la solicitud
            const marker = await toogleLikeMarker(markerId, userId)
            const isLiked = marker?.likes?.some(like => like.userId === userId)
            console.log('isLiked:', isLiked)
            res.status(200).json({ isLiked })
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message })
        console.log('Este es el error:', error.message) // Muestra el mensaje de error completo
        throw new Error('Error al obtener los marcadores')
    }
}

export default markerIsLiked
