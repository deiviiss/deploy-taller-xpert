"use client"

import { Orders, Title } from "@/components";
import { Button } from "@/components/button/Button";
import { CardItem } from "@/components/dashboard-orders/cardItem";
import { NewClient } from "@/components/dashboard-orders/newClient";
import { NewItem } from "@/components/dashboard-orders/newItem";
import { useState } from "react";

export default function OrdersPage() {

  const [products, setProducts] = useState([])

  const date = new Date();
  const day = date.getDate()
  const month = date.getMonth() + 1;
  const year = date.getFullYear()

  const guardarOrden = () => {
    console.log("orden Nueva")
  }

  const cancelarOrden = () => {
    console.log("orden cancelada")
  }

  return (
    <div>
      <div className="flex flex-row justify-between mb-7">
        
      </div>
    </div>
  );
}