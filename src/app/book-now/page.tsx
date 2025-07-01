import dynamic from "next/dynamic";
import React from "react";

const BookNowClient = dynamic(() => import("./BookNowClient"), {
  ssr: false, // ✅ disables static rendering and fixes the build error
});

export default function BookNowPage() {
  return <BookNowClient />;
}
