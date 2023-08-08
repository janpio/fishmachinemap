import { User } from 'next-auth'
import { useCallback, useState } from 'react'
import { UserMarker } from '../maps/type'
import { getAuthenticatedToken } from '@/lib/storage/storage'
import { BlaBlaFish } from '../blablafish/type'

export const useLogicUser = () => {
    const [user, setUser] = useState<User | null>(null)
    const [userMarkers, setUserMarkers] = useState<UserMarker[]>([])
    const [toBeDeletedMarkers, setToBeDeletedMarkers] = useState<{
        [key: string]: boolean
    }>({})
    const [blablaFish, setBlaBlaFish] = useState<BlaBlaFish[]>([])
    const [picturesProfile, setPicturesProfile] = useState<string[]>([])
    const [markerVisibility, setMarkerVisibility] = useState<{
        [key: string]: boolean
    }>({})
    const noMarkers = userMarkers.length === 0

    const [width, setWidth] = useState<number>(0)

    const getUser = useCallback(async () => {
        try {
            if (typeof window !== 'undefined') {
                const token = getAuthenticatedToken()
                const headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Agregar el token al header 'Authorization'
                }
                const response = await fetch('/api/user/userData', {
                    method: 'GET',
                    headers,
                })
                const data = await response.json()
                setBlaBlaFish(data.user.blaBlaFish)
                setUser(data.user)
                setUserMarkers(data.user.markers)

                // Set marker visibility state
                const visibilityState: Record<string, any> = {}
                data.user.markers.forEach((marker: any) => {
                    visibilityState[marker.id as string] = marker.visible
                })
                setMarkerVisibility(visibilityState)

                return response
            }
        } catch (error: any) {
            console.error('Error al obtener el usuario:', error.message)
        }
    }, [])

    const deleteUserMarkers = useCallback(async (markerId: string) => {
        try {
            const token = getAuthenticatedToken()
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token al header 'Authorization'
            }
            const response = await fetch(
                `/api/user/deleteMarkers?id=${markerId}`,
                {
                    method: 'DELETE',
                    headers,
                }
            )
            setToBeDeletedMarkers(prevState => ({
                ...prevState,
                [markerId]: false,
            }))
            await response.json()
            return response
        } catch (error: any) {
            console.error('Error al eliminar el marcador:', error.message)
        }
    }, [])

    const updateMarker = useCallback(async (markerId: string) => {
        try {
            const token = getAuthenticatedToken()
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agregar el token al header 'Authorization'
            }
            const response = await fetch(
                `/api/markers/visibleMarker?id=${markerId}`,
                {
                    method: 'PUT',
                    headers,
                }
            )
            await response.json()
            return response
        } catch (error: any) {
            console.error('Error al actualizar el marcador:', error.message)
        }
    }, [])

    return {
        user,
        userMarkers,
        getUser,
        deleteUserMarkers,
        setToBeDeletedMarkers,
        toBeDeletedMarkers,
        noMarkers,
        width,
        setWidth,
        blablaFish,
        updateMarker,
        markerVisibility,
        setMarkerVisibility,
    }
}
