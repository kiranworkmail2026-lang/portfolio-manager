"use client";

import { useRouter } from "next/navigation";
import { PrivateRoute } from "@/components/PrivateRoute";
import { FileUpload } from "@/components/FileUpload";

export default function UploadPage() {
  const router = useRouter();
  return (
    <PrivateRoute>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Upload Portfolio</h1>
        <p className="text-gray-600 mb-4 text-sm">
          Upload an Excel file with columns: Symbol, Name, Quantity, BuyPrice, CurrentPrice, Sector, AssetType.
        </p>
        <FileUpload onSuccess={() => setTimeout(() => router.push("/dashboard"), 500)} />
      </div>
    </PrivateRoute>
  );
}
