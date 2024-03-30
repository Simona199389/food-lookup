import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import { FormControl } from "@mui/material";

export default function CreateFood() {
  const navigate = useNavigate();
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
    setProductData((prevState) => ({ ...prevState, [name]: newValue }));
  };

  async function CreateFood(food) {
    console.log(food);
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
    if (serverAnswearTitle == "Success") {
      navigate("/");
    }
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
      <form onSubmit={handleSubmit}>
        <h1>Create product</h1>
        <FormControl>
          <TextField
            label="Enter Food name"
            sx={{ marginBottom: "15px" }}
            type="text"
            inputProps={{ "aria-label": "description" }}
            value={productData.description}
            onChange={handleInputChange}
            name="description"
          />
          <TextField
            label="Enter protein"
            type="number"
            sx={{ marginBottom: "15px" }}
            inputProps={{ "aria-label": "protein" }}
            value={productData.protein}
            name="protein"
            onChange={handleInputChange}
          />
          <TextField
            label="Enter fats"
            type="number"
            sx={{ marginBottom: "15px" }}
            inputProps={{ "aria-label": "fat" }}
            value={productData.fat}
            name="fat"
            onChange={handleInputChange}
          />
          <TextField
            label="Enter carbs"
            type="number"
            sx={{ marginBottom: "15px" }}
            inputProps={{ "aria-label": "carbs" }}
            name="carbs"
            value={productData.carbs}
            onChange={handleInputChange}
          />
          <Button
            type="submit"
            sx={{ marginTop: "15px" }}
            aria-label="submit"
            variant="contained"
            disabled={!isFormValid}
          >
            Create
          </Button>
        </FormControl>
      </form>
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
