"use client"; // ✅ Make this a client component

import React from "react";
import BookNowClient from "./BookNowClient";
export const dynamic = "force-dynamic";

export default function BookNowPage() {
  return <BookNowClient />;
}
