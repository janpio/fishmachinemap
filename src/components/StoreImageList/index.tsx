import * as React from 'react'
import { FC, memo } from 'react'
import ImageListItem from '@mui/material/ImageListItem'
import ImageListItemBar from '@mui/material/ImageListItemBar'
import IconButton from '@mui/material/IconButton'
import EuroIcon from '@mui/icons-material/Euro'

interface Props {
    id?: string
    title: string
    description: string
    picture: string
    price: string
}

let width: any

if (typeof window !== 'undefined') {
    if (window.innerWidth > 600) {
        width = 330
    } else if (window.innerWidth > 400) {
        width = 200
    } else if (window.innerWidth > 300) {
        width = 150
    }
}

const TitlebarImageList: FC<Props> = ({
    id,
    title,
    description,
    picture,
    price,
}) => {
    return (
        <ImageListItem
            component="div"
            style={{ display: 'flex', width: width, margin: '0.2rem' }}
            key={id}
        >
            <img
                src={`${picture}`}
                srcSet={`${picture}`}
                style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                }}
            />
            <ImageListItemBar
                title={title}
                subtitle={description}
                style={{
                    borderBottomRightRadius: '10px',
                    borderBottomLeftRadius: '10px',
                }}
                actionIcon={
                    <IconButton
                        sx={{
                            color: 'rgba(0, 255, 76, 0.641)',
                            fontSize: '1rem',
                        }}
                        aria-label={`info about ${title}`}
                    >
                        {price}
                        <EuroIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                }
            />
        </ImageListItem>
    )
}

export default memo(TitlebarImageList)
