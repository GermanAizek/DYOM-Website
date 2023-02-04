import React from "react";
import { DYOMContent } from "../../../../styles/components/DYOMContainer";
import { Button, Grid, Typography } from "@mui/material";
import { UploadImages } from "./UploadImages";
import { MainInfo } from "./MainInfo";
import { Specs } from "./Specs";
import { Box } from "@mui/system";

export function AddMission() {
  const [images, setImages] = React.useState({
    banner: {
      input: null,
      error: false,
      preview: undefined,
    },
    gallery: {
      input: null,
      error: false,
      preview: undefined,
    },
  });

  let previewArray = [];

  const changeBanner = (e) => {
    if (e.target.files.length != 0) {
      if (e.target.files[0].size >= 8 * 1024 * 1024) {
        setImages((prevState) => ({
          ...prevState,
          banner: {
            ...prevState.banner,
            error: true,
            input: null,
            preview: undefined,
          },
        }));
        return;
      }
    } else return;

    const objectURL = URL.createObjectURL(e.target.files[0]);
    setImages((prevState) => ({
      ...prevState,
      banner: {
        ...prevState.banner,
        error: false,
        input: e.target.files[0],
        preview: objectURL,
      },
    }));
  };

  const changeGallery = (e) => {
    if (!images.gallery.preview) {
      setImages((prevState) => ({
        ...prevState,
        gallery: {
          ...prevState.gallery,
          preview: [],
        },
      }));
      if (e.target.files.length > 5) {
        setImages((prevState) => ({
          ...prevState,
          gallery: {
            ...prevState.gallery,
            error: true,
          },
        }));
        return;
      }
    } else {
      if (e.target.files.length + images.gallery.preview.length > 5) {
        setImages((prevState) => ({
          ...prevState,
          gallery: {
            ...prevState.gallery,
            error: true,
          },
        }));
        return;
      }
    }

    for (var i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].size > 8 * 1024 * 1024) {
        setImages((prevState) => ({
          ...prevState,
          gallery: {
            ...prevState.gallery,
            error: true,
          },
        }));
        return;
      }
    }

    Array.from(e.target.files).forEach((file) => {
      const objectURL = URL.createObjectURL(file);
      previewArray.push(objectURL);
    });

    setImages((prevState) => ({
      ...prevState,
      gallery: {
        ...prevState.gallery,
        input: e.target.files,
        error: false,
        preview: [...prevState.gallery.preview, ...previewArray],
      },
    }));
  };

  const closeButton = (type) => {
    setImages((prevState) => ({
      ...prevState,
      [type]: {
        ...prevState[type],
        input: null,
        error: null,
        preview: undefined,
      },
    }));
    if (type === "gallery") previewArray = [];
  };

  return (
    <DYOMContent>
      <Typography variant="h3" align="center" mb="2rem">
        Add a new mission
      </Typography>
      <Grid container spacing={5} mb={5}>
        <Grid item xs={4}>
          <UploadImages
            images={images}
            changeBanner={changeBanner}
            changeGallery={changeGallery}
            closeButton={closeButton}
            previewArray={previewArray}
          />
        </Grid>
        <Grid item xs={8}>
          <MainInfo />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Specs />
        </Grid>
      </Grid>
      <Box mt={10} align="center">
        <Button>Add mission</Button>
      </Box>
    </DYOMContent>
  );
}
