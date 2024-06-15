"use client";

import { FormEvent, useState } from "react";

export default function Stock() {
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const stock = formData.get("stock");
    console.log("stock", stock);
    const response = await fetch("/api/stockAnalysis", {
      method: "POST",
      body: JSON.stringify({ stock }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data, "data");

    if (response.ok) {
      setResult(data.analysis);
      setError(null);
    } else {
      setError(data.error);
      setResult(null);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Analysis</h1>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          type="text"
          name="stock"
          placeholder="Enter Stock Symbol"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Analyze
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {result && (
          <div className="mt-4 p-4 border rounded bg-gray-100">{result}</div>
        )}
      </form>
    </div>
  );
}
