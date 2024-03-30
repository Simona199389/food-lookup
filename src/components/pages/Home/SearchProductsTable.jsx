import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function SearchProductsTable({ onGenerateData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:3001/?term=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRecords(data);
      } catch (error) {
        setError(error.message);
      }
    }

    if (searchTerm.length > 0) {
      fetchData();
    } else {
      setRecords([]);
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRowClick = (product) => {
    const storedData = localStorage.getItem("selectedRows");
    let existingProducts = storedData ? JSON.parse(storedData) : [];

    const isProductSelected = existingProducts.some(
      (selectedProduct) => selectedProduct.foodName === product.foodName
    );

    if (!isProductSelected) {
      const modifiedProduct = { ...product, count: 1 };
      existingProducts = [...existingProducts, modifiedProduct];
    } else {
      existingProducts = existingProducts.map((selectedProduct) =>
        selectedProduct.foodName === product.foodName
          ? { ...selectedProduct, count: selectedProduct.count + 1 }
          : selectedProduct
      );
    }
    setSelectedProducts(existingProducts);
    localStorage.setItem("selectedRows", JSON.stringify(existingProducts));
  };

  useEffect(() => {
    onGenerateData(selectedProducts);
  }, [selectedProducts, onGenerateData]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = records.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Paper
                component="form"
                style={{ display: "flex", alignItems: "center" }}
              >
                <InputBase
                  placeholder="Search"
                  inputProps={{ "aria-label": "search" }}
                  style={{ flex: 1 }}
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <IconButton type="button" aria-label="search">
                  <SearchIcon />
                </IconButton>
                <Divider orientation="vertical" flexItem />
              </Paper>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Kcal
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Protein(g)
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Fat(g)
            </TableCell>
            <TableCell align="right" style={{ fontWeight: "bold" }}>
              Carbs(g)
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((row) => (
            <TableRow key={row.foodName} onClick={() => handleRowClick(row)} sx={{cursor: "pointer"}}>
              <TableCell component="th" scope="row">
                {row.foodName}
              </TableCell>
              <TableCell align="right">{row.kcal}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.fats}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {records.length > postsPerPage && (
        <Stack spacing={2} style={{ marginTop: "20px", alignItems: "center" }}>
          <Pagination
            count={Math.ceil(records.length / postsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
          />
        </Stack>
      )}
    </TableContainer>
  );
}
