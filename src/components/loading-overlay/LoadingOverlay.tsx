"use client";

import { useLoadingStore } from "@/lib/loadingstore";
import "./loading-overlay.css";

export default function LoadingOverlay() {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="LoadingOverlay">
      <div className="LoadingBox">
        <span className="LoadingSpinner"></span>
        <p>{message}</p>
      </div>
    </div>
  );
}
