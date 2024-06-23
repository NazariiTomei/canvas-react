import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
export default function ItemCard({ id, imageSrc, handleOpen, handleEdit }) {
  return (
    <Card sx={{ maxWidth: "100%" }}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={imageSrc === "" ? "/images.jpeg" : `${imageSrc}`}
          alt="green iguana"
          height="240px"
          width={"100%"}
          onClick={() => handleOpen(id)}
        />
        {/* <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent> */}
        {imageSrc !== "" ? (
          <ImageListItemBar
            title={""}
            subtitle={""}
            actionIcon={
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${id}`}
                onClick={() => handleEdit(imageSrc)}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        ) : (
          <></>
        )}
      </CardActionArea>
      {/* <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions> */}
    </Card>
  );
}
