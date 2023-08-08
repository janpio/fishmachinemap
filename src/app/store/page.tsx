'use client'

import React, { FC, useEffect, memo } from 'react'
import { useLogicStore } from './logic'
import SimpleBottomNavigation from '@/components/BottomNav'
import AccountMenu from '@/components/Menu'
import TitlebarImageList from '@/components/StoreImageList'
import FloatAddBlaBlaFish from '@/components/FloatAddBlaBlaFish'
import StoreModal from '@/components/ModalStore'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'
import {
    Container,
    ContainerMenu,
    MainContainer,
    MainContainerNoData,
    TextNav,
} from './style'
import CircularIndeterminate from '@/components/Loader'
import { IconButton } from '@mui/material'
import Link from 'next/link'

const Store: FC = () => {
    const { open, setOpen, fetchStore, store, loading } = useLogicStore()
    console.log(store)

    const handleClose = () => {
        setOpen(false)
    }

    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        fetchStore()
    }, [])

    if (loading) {
        return (
            <>
                <CircularIndeterminate />
                <SimpleBottomNavigation />
            </>
        )
    }

    if (store.length === 0 && !loading) {
        return (
            <>
                <ContainerMenu>
                    <AccountMenu />
                </ContainerMenu>
                <Container>
                    <TextNav>Compra, vende. Reutiliza</TextNav>
                </Container>
                <MainContainerNoData>
                    <ShoppingBagIcon
                        style={{
                            fontSize: '5rem',
                            color: '#49007a',
                            marginBottom: '2rem',
                        }}
                    />
                    No hay productos a la venta
                </MainContainerNoData>
                <FloatAddBlaBlaFish onClick={() => handleOpen()} />
                <SimpleBottomNavigation />
            </>
        )
    }
    return (
        <>
            <ContainerMenu>
                <AccountMenu />
            </ContainerMenu>
            <Container>
                <TextNav>Compra, vende. Reutiliza</TextNav>
            </Container>
            <MainContainer>
                <StoreModal open={open} onClose={() => handleClose()} />
                {store.map(item => (
                    <Link key={item.id} href={`/store/${item.id}`}>
                        <TitlebarImageList
                            key={item.id}
                            title={item.title}
                            description={item.description}
                            picture={item.picture}
                            price={item.price}
                        />
                    </Link>
                ))}

                <FloatAddBlaBlaFish onClick={() => handleOpen()} />
                <SimpleBottomNavigation />
            </MainContainer>
        </>
    )
}

export default memo(Store)
