import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Image1 from '../../Images/fajr.png'
import Image2 from '../../Images/dhhr.png'
import Image3 from '../../Images/asr.png'
import Image4 from '../../Images/maghreb.png'
import Image5 from '../../Images/Ishaa.png'
import InputLabel from '@mui/material/InputLabel';
export default function Prayer({name , img , time}) {
  return <>
        <Card sx={{ maxWidth: 345 }}>
        <CardMedia
            component="img"
            alt="green iguana"
            height="140"
            image={img}
        />
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
            {name}
            </Typography>
            <Typography variant="h3" color="text.secondary">
            {time}
            </Typography>
        </CardContent>
        </Card>
  </>
  
}
