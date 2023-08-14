import { FC, memo, useState } from 'react'
import { FeedPros } from './type'
import CommentIcon from '@mui/icons-material/Comment'
import { IconButton, Typography } from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import TodayIcon from '@mui/icons-material/Today'
import Link from 'next/link'
import CommentSection from '../ModalComments'
import AddCommentIcon from '@mui/icons-material/AddComment'
import {
    Imagen,
    ImagenContainer,
    CardContainer,
    Icons,
    IconsContainer,
    LikesLabel,
    Description,
    HearthContainer,
    DateContainer,
    HearthContainerTop,
} from './style'
import CommentModal from '../ModalComments'

const CardFeed: FC<FeedPros> = ({
    id,
    userName,
    picture,
    direction,
    description,
    date,
    onClick,
    userId,
    isLiked,
    likes,
    user,
    numberOfComments,
    iconCreator,
}) => {
    const [comments, setComments] = useState<string[]>([]) // Estado de los comentarios
    const [isCommentModalOpen, setCommentModalOpen] = useState(false)

    const handleCommentModalOpen = () => {
        setCommentModalOpen(true)
    }

    const handleCommentModalClose = () => {
        setCommentModalOpen(false)
    }

    return (
        <CardContainer key={id}>
            <ImagenContainer>
                <Imagen src={picture} />
            </ImagenContainer>
            <IconsContainer>
                <HearthContainerTop>
                    <Typography
                        component={'div'}
                        style={{
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            alignItems: 'center',
                            display: 'flex',
                            marginLeft: '0.5rem',
                        }}
                    >
                        {iconCreator}
                        <Link
                            style={{
                                textDecorationColor: '#49007a',
                                color: '#49007a',
                            }}
                            href={`/feed/${user?.id}`}
                        >
                            {user?.name}
                        </Link>
                    </Typography>
                    <IconButton
                        onClick={handleCommentModalOpen}
                        style={{ justifySelf: 'end' }}
                    >
                        <AddCommentIcon style={{ color: '#49007a' }} />
                        <LikesLabel>{numberOfComments}</LikesLabel>
                    </IconButton>
                    <IconButton
                        onClick={onClick}
                        style={{ justifySelf: 'end' }}
                    >
                        {isLiked ? (
                            <FavoriteIcon style={{ color: '#49007a' }} />
                        ) : (
                            <FavoriteBorderIcon style={{ color: '#49007a' }} />
                        )}
                        <LikesLabel>{likes}</LikesLabel>
                    </IconButton>
                </HearthContainerTop>
                <HearthContainer>
                    <Icons>
                        {/* <CommentIcon style={{ color: '#49007a' }} /> */}
                        <Description>{description}</Description>
                    </Icons>
                    <DateContainer>{date}</DateContainer>
                </HearthContainer>

                <CommentModal
                    open={isCommentModalOpen}
                    onClose={handleCommentModalClose}
                    id={id as string}
                />
            </IconsContainer>
        </CardContainer>
    )
}

export default memo(CardFeed)
