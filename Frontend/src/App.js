import "./App.css";
import axios from "axios";
import * as React from "react";
import Header from "./components/header";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import ItemCard from "./components/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Spinner from "./components/spinner";
import { useDropzone } from "react-dropzone";
import ImageList from "@mui/material/ImageList";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageListItem from "@mui/material/ImageListItem";
import ImgEditor from "./components/imgEditor";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 40,
  p: 4,
};
const styles = {
  dropzone: {
    border: "2px dashed #cccccc",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
  },
};

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));
function App() {
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [openDialog, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(null);
  const [selectId, setSelectId] = React.useState(0);
  const [uploadStatus, setUploadStatus] = React.useState("");
  const [uploadedFileName, setUploadedFileName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [editImage, setEditImage] = React.useState("");
  const [cards, setCards] = React.useState([
    { image: "", id: 0 },
    { image: "", id: 1 },
    { image: "", id: 2 },
    { image: "", id: 3 },
    { image: "", id: 4 },
    { image: "", id: 5 },
    { image: "", id: 6 },
    { image: "", id: 7 },
    { image: "", id: 8 },
  ]);
  const [recentImages, setRecentImages] = React.useState([]);
  React.useEffect(() => {
    handleUpload();
  }, [selectedFile]);
  React.useEffect(() => {
    setCards([
      ...cards.map((item) =>
        item.id === selectId ? { ...item, image: uploadedFileName } : item
      ),
    ]);
    // localStorage.setItem("cards", JSON.stringify(cards));
    // console.log(cards);
  }, [uploadedFileName]);
  // React.useEffect(() => {
  //   const localCards = JSON.parse(localStorage.getItem("cards"));
  //   console.log("local",localCards);
  //   if (localCards.length) {
  //     setCards(localCards);
  //   }
  // }, []);
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          // handleUpload();
          handleClose();
        };
        reader.readAsDataURL(file);
      } else {
        alert("Please select a valid image file");
      }
    },
    noClick: true,
    noKeyboard: true,
    accept: "image/*",
  });
  const handleOpen = (id) => {
    setSelectId(id);
    setOpen(true);
  };
  const handleEdit = (image) => {
    setEditImage(image);
    setEditing(true);
  };
  const handleClose = () => setOpen(false);
  const handleUpload = async (event) => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await axios.post(
          "http://localhost:5000/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUploadStatus(response.data.message);
        setUploadedFileName(response.data.filePath);
        setRecentImages([...recentImages, response.data.filePath]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setUploadStatus("Upload failed");
        console.error("Error uploading file:", error);
      }
    }
  };
  return (
    <div className="App">
      <div className="container">
        <Header />
        {loading ? (
          <Spinner />
        ) : (
          <>
            {editing && editImage ? (
              <ImgEditor ImgSrc={editImage} setEditing={setEditing}/>
            ) : (
              <div className="template">
                <Grid
                  container
                  spacing={{ xs: 2, md: 3 }}
                  columns={{ xs: 4, sm: 8, md: 12 }}
                >
                  {cards.map((_, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                      <Item>
                        {index !== 4 ? (
                          <ItemCard
                            id={_.id}
                            imageSrc={_.image}
                            handleOpen={handleOpen}
                            handleEdit={handleEdit}
                          />
                        ) : (
                          <></>
                        )}
                      </Item>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </>
        )}
        <div>
          <Modal
            keepMounted
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
          >
            <Box sx={style}>
              <Typography variant="h3" component="h2">
                Select Image
              </Typography>

              <div {...getRootProps({ style: styles.dropzone })}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here...</p>
                ) : (
                  <p>
                    Drag 'n' drop an image here, or click the button to select
                    one
                  </p>
                )}
                <Button
                  component="label"
                  variant="contained"
                  onClick={open}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload file
                </Button>
              </div>
              {preview && (
                <img
                  src={preview}
                  alt="Selected"
                  style={{ marginTop: 20, maxHeight: 300 }}
                />
              )}
              <Typography variant="h5" component="h2">
                Or Choose from your recent images
              </Typography>
              {/* {recentImages.length ? (
                <div>
                  <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                  >
                    {recentImages.map((_, index) => (
                      <Grid item xs={2} sm={4} md={4} key={index}>
                        <Item>
                          {
                            <ItemCard
                              id={_.id}
                              image={_}
                              handleOpen={()=>handleOpen(selectId)}
                            />
                          }
                        </Item>
                      </Grid>
                    ))}
                  </Grid>
                </div>
              ) : (
                <div></div>
              )} */}
              <ImageList
                sx={{ width: 730, height: 450 }}
                cols={3}
                rowHeight={240}
              >
                {recentImages.map((item, index) => (
                  <ImageListItem key={item}>
                    <img
                      srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      src={`${item}?w=164&h=164&fit=crop&auto=format`}
                      alt={index}
                      loading="lazy"
                      onClick={() => {
                        setCards([
                          ...cards.map((item1) =>
                            item1.id === selectId
                              ? { ...item1, image: item }
                              : item1
                          ),
                        ]);
                        setUploadedFileName(item);
                        // localStorage.setItem("cards", JSON.stringify(cards));
                        handleClose();
                      }}
                    />
                  </ImageListItem>
                ))}
              </ImageList>

              <Button
                variant="contained"
                color="success"
                onClick={handleClose}
                style={{ float: "right" }}
              >
                Close
              </Button>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default App;
