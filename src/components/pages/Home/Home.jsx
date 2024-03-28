import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import SelectedProductsTable from "./SelectedProductsTable";
import SearchProductsTable from "./SearchProductsTable";
// import { Link } from "react-router-dom";

export default function Home() {
  const [sharedData, setSharedData] = useState([]);

  const updateQuantity = (rowId, count) => {
    const newSharedData = [...sharedData]
    const row = newSharedData.find(a=> a.id === rowId)
    row.count = count
    setSharedData(newSharedData)
  }

  useEffect(()=>{
    
  },[setSharedData])

  return (
    <>
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px"}}>
        <Button>Create Product</Button>
        </div>
      <div style={{margin: "20px"}}>
        <div style={{marginBottom: "20px"}}>
      <SelectedProductsTable rows={sharedData} update_quantity={updateQuantity}/>
      </div>
      <div style={{marginTop: "20px"}}>
      <SearchProductsTable onGenerateData={setSharedData}/>
      </div>
      </div>
    </>
  );
}