import { FormEvent } from "react";

export default function StockForm() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Stock Analysis</h1>
      <form className="flex gap-2">
        <input
          type="text"
          name="stock"
          placeholder="Enter Stock Symbol"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Analyze
        </button>
      </form>
    </div>
  );
}
