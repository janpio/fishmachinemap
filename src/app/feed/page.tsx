'use client'

import { FC, useEffect, useState } from 'react'
import { ContainerMenu, MainContainer } from './style'
import SimpleBottomNavigation from '@/components/BottomNav'
import CardFeed from '@/components/CardFeed'
import { feedUseLogic } from './logic'
import AccountMenu from '@/components/Menu'

const Feed: FC = () => {
    const { getMarkersUser, fotosMarkers, fetchLikesMarkers, likedMarkers } =
        feedUseLogic()

    useEffect(() => {
        getMarkersUser()
    }, [])

    return (
        <>
            <ContainerMenu>
                <AccountMenu />
            </ContainerMenu>
            <MainContainer>
                {fotosMarkers.map(item => (
                    <CardFeed
                        creator="Creado por"
                        key={item.id}
                        id={item.id}
                        description={item.description}
                        picture={item.picture}
                        onClick={() => fetchLikesMarkers(item.id, item.userId)}
                        likes={item.likes.length}
                        isLiked={likedMarkers[item.id] || false} // Utiliza el estado isLiked correspondiente al ID del marcador
                    />
                ))}
            </MainContainer>
            <SimpleBottomNavigation />
        </>
    )
}

export default Feed
