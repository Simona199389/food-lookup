import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SelectedProductsTable from "./SelectedProductsTable";
import SearchProductsTable from "./SearchProductsTable";
import { Link } from "react-router-dom";

export default function Home() {
  const [sharedData, setSharedData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("selectedRows");
    if (storedData) {
      setSharedData(JSON.parse(storedData));
    }
  }, []);

  const updateQuantity = (rowId, count) => {
    const newSharedData = sharedData.map((row) =>
      row.id === rowId ? { ...row, count: count } : row
    );
    setSharedData(newSharedData);

    localStorage.setItem("selectedRows", JSON.stringify(newSharedData));
  };

  return (
    <>
      <Link to="/create">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "20px",
          }}
        >
          <Button>Create Product</Button>
        </div>
      </Link>
      <div style={{ margin: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <SelectedProductsTable
            rows={sharedData}
            update_quantity={updateQuantity}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <SearchProductsTable onGenerateData={setSharedData} />
        </div>
      </div>
    </>
  );
}
