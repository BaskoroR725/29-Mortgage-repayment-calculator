import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "../App";

describe("Mortgage Calculator", () => {
  it("harus menampilkan ilustrasi kosong di awal", () => {
    render(<App />);
    expect(screen.getByText(/Results shown here/i)).toBeInTheDocument();
  });

  it("harus memformat input amount dengan koma secara otomatis", () => {
    render(<App />);
    const amountInput = screen.getByLabelText(/Mortgage Amount/i);
    fireEvent.change(amountInput, { target: { value: "1000" } });
    expect(amountInput).toHaveValue("1,000");
  });

  it("harus menghitung Repayment dengan benar", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Mortgage Amount/i), {
      target: { value: "300000" },
    });
    fireEvent.change(screen.getByLabelText(/Mortgage Term/i), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), {
      target: { value: "5.25" },
    });

    fireEvent.click(screen.getByLabelText(/Repayment/i));
    fireEvent.click(
      screen.getByRole("button", { name: /calculate repayments/i }),
    );

    // Tunggu sampai header hasil muncul (spesifik sebagai heading)
    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", { name: /your results/i }),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Menggunakan regex untuk mencocokkan angka tanpa peduli pemisah desimal/ribuan
    // Hasil: 1,797.74 atau 1.797,74
    expect(screen.getByText(/1.*797.*74/)).toBeInTheDocument();
  });

  it("harus menghitung Interest Only dengan benar", async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/Mortgage Amount/i), {
      target: { value: "300000" },
    });
    fireEvent.change(screen.getByLabelText(/Mortgage Term/i), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByLabelText(/Interest Rate/i), {
      target: { value: "5" },
    }); // 5% biarkan mudah

    fireEvent.click(screen.getByLabelText(/Interest Only/i));
    fireEvent.click(
      screen.getByRole("button", { name: /calculate repayments/i }),
    );

    // Bunga saja: (300,000 * 0.05) / 12 = 1250
    await waitFor(
      () => {
        expect(screen.getByText(/1.*250.*00/)).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
  });
});
