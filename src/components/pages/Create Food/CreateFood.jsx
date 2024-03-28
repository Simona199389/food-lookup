import React, { useState, useEffect } from "react";
import {
  Button,
  InputBase,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function CreateFood() {
  const [productData, setProductData] = useState({
    description: "",
    kcal: "",
    protein: "",
    fat: "",
    carbs: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState(null);
  const [serverAnswearTitle, setServerAnswearTitle] = useState("");
  const [serverAnswear, setServerAnswear] = useState("");

  const updateKcal = () => {
    const newValue =
      productData.protein * 4 + productData.carbs * 4 + productData.fat * 9;
    setProductData((prevData) => {
      return { ...prevData, kcal: newValue };
    });
  };

  useEffect(() => {
    const { kcal, ...rest } = productData;
    const isEmpty = Object.values(rest).some((value) => value === "");
    setIsFormValid(!isEmpty);
    
  }, [productData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newValue =
      name === "description" ? value : Math.max(parseFloat(value), 0);
    setProductData(
      (prevState) => ({ ...prevState, [name]: newValue })
    );
  };

  async function CreateFood(food) {
    try {
      const response = await fetch("http://localhost:3001/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: food }),
      });

      const responseData = await response.json();
      setServerAnswear(responseData.message);
      setServerAnswearTitle(responseData.messageTitle);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateKcal();
  };
  
  useEffect(() => {
    if (productData.description && productData.kcal) {
      CreateFood(productData);
      setProductData({
        description: "",
        kcal: "",
        protein: "",
        fat: "",
        carbs: "",
      });
      setOpenDialog(true);
    }
  }, [productData]);
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "70%",
          margin: 20,
        }}
        onSubmit={handleSubmit}
      >
        <InputBase
          sx={{ ml: 1, flex: 1, width: "50%" }}
          placeholder="Description"
          inputProps={{ "aria-label": "description" }}
          type="text"
          name="description"
          value={productData.description}
          onChange={handleInputChange}
        />
        <InputBase
          sx={{ ml: 1, flex: 1, width: "50%" }}
          placeholder="Protein (g)"
          inputProps={{ "aria-label": "protein" }}
          type="number"
          name="protein"
          value={productData.protein}
          onChange={handleInputChange}
        />
        <InputBase
          sx={{ ml: 1, flex: 1, width: "50%" }}
          placeholder="Fat (g)"
          inputProps={{ "aria-label": "fat" }}
          type="number"
          name="fat"
          value={productData.fat}
          onChange={handleInputChange}
        />
        <InputBase
          sx={{ ml: 1, flex: 1, width: "50%" }}
          placeholder="Carbs (g)"
          inputProps={{ "aria-label": "carbs" }}
          type="number"
          name="carbs"
          value={productData.carbs}
          onChange={handleInputChange}
        />
        <Button
          type="submit"
          sx={{ p: "10px", width: "30%" }}
          aria-label="submit"
          variant="contained"
          disabled={!isFormValid}
        >
          Create
        </Button>
      </Paper>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{serverAnswearTitle}</DialogTitle>
        <DialogContent>{serverAnswear}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}