import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
// import '../style/selectedProductsStyles.css';

export default function SelectedProductsTable({ rows, update_quantity }) {
  const [totals, setTotals] = useState({
    kcal: 0,
    protein: 0,
    fat: 0,
    carbs: 0,
  });

  const removeQuantity = (row) => {
    update_quantity(row.id, --row.count);
  };

  const addQuantity = (row) => {
    update_quantity(row.id, ++row.count);
  };

  useEffect(() => {
    const calculateTotals = () => {
      let totalKcal = 0;
      let totalProtein = 0;
      let totalFat = 0;
      let totalCarbs = 0;

      rows.forEach((row) => {
        totalKcal += parseFloat(row.kcal * row.count);
        totalProtein += parseFloat(row.protein * row.count);
        totalFat += parseFloat(row.fats * row.count);
        totalCarbs += parseFloat(row.carbs * row.count);
      });

      setTotals({
        kcal: totalKcal.toFixed(2),
        protein: totalProtein.toFixed(2),
        fat: totalFat.toFixed(2),
        carbs: totalCarbs.toFixed(2),
      });
    };

    calculateTotals();
  }, [rows]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="table-header-cell">Selected foods</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="table-header-cell">Description</TableCell>
            <TableCell align="center" className="table-header-cell">Quantity</TableCell>
            <TableCell align="center" className="table-header-cell">Kcal</TableCell>
            <TableCell align="center" className="table-header-cell">Protein(g)</TableCell>
            <TableCell align="center" className="table-header-cell">Fat(g)</TableCell>
            <TableCell align="center" className="table-header-cell">Carbs(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(
            (row) =>
              row.count > 0 && (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.foodName}
                  </TableCell>
                  <TableCell align="center">
                    <div className="quantity-container">
                      <div
                        onClick={() => removeQuantity(row)}
                        className="quantity-button"
                      >
                        -
                      </div>
                      <div>{row.count}</div>
                      <div
                        onClick={() => addQuantity(row)}
                        className="quantity-button"
                      >
                        +
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">{row.kcal * row.count}</TableCell>
                  <TableCell align="center">
                    {row.protein * row.count}
                  </TableCell>
                  <TableCell align="center">{row.fats * row.count}</TableCell>
                  <TableCell align="center">{row.carbs * row.count}</TableCell>
                </TableRow>
              )
          )}
        </TableBody>
        <TableBody>
          <TableRow className="total-row">
            <TableCell>Total</TableCell>
            <TableCell align="center"></TableCell>
            <TableCell align="center">{totals.kcal}</TableCell>
            <TableCell align="center">{totals.protein}</TableCell>
            <TableCell align="center">{totals.fat}</TableCell>
            <TableCell align="center">{totals.carbs}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}