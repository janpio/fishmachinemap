import * as React from 'react'
import Box from '@mui/material/Box'
import Rating from '@mui/material/Rating'
import Typography from '@mui/material/Typography'
import { FC } from 'react'

interface Props {
    value?: number
}

const BasicRating: FC<Props> = ({ value }) => {
    return (
        <Box
            sx={{
                marginTop: '10px',
                '& > legend': { mt: 2 },
            }}
        >
            <Rating name="read-only" value={value} readOnly />
        </Box>
    )
}

export default BasicRating
