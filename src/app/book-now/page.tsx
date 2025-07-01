import React, { Suspense } from "react";
import BookNow from "./client/BookNow";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading booking form...</div>}>
      <BookNow />
    </Suspense>
  );
}
