import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Bersihkan DOM setelah setiap test selesai agar tidak bentrok
afterEach(() => {
  cleanup();
});