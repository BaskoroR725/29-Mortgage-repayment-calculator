import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import * as z from "zod";
import "./App.css";

// Helper format number
const formatNumber = (value: string) => {
  if (!value) return "";
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Helper sanitize input
const sanitizeInt = (value: string) => value.replace(/\D/g, "");
const sanitizeFloat = (value: string) => {
  // Hanya ambil angka dan titik
  let cleaned = value.replace(/[^0-9.]/g, "");
  // Pastikan hanya ada satu titik desimal
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  return cleaned;
};

//1.Schema validation zod
const schema = z.object({
  amount: z.string().min(1, "This field is required"),
  term: z.string().min(1, "This field is required"),
  rate: z.string().min(1, "This field is required"),
  type: z.enum(["repayment", "interest-only"], {
    message: "This field is required",
  }),
});

type formData = z.infer<typeof schema>;

function App() {
  const [results, setResults] = useState<{
    monthly: string;
    total: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schema),
  });

  const mortgageType = watch("type");

  //2. Function Mortgage calculation
  const onSubmit = (data: formData) => {
    const P = parseFloat(data.amount.replace(/,/g, ""));
    const r = parseFloat(data.rate) / 100 / 12;
    const n = parseFloat(data.term) * 12;

    if (data.type === "repayment") {
      const monthly = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      const total = monthly * n;
      setResults({
        monthly: monthly.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        total: total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
    } else {
      const monthly = (P * parseFloat(data.rate)) / 100 / 12;
      const total = monthly * n + P;
      setResults({
        monthly: monthly.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        total: total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
      });
    }
  };

  const clearAll = () => {
    reset();
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 md:p-8">
      <main className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row shadow-xl md:rounded-3xl overflow-hidden">
        {/* Left section: form */}
        <section className="flex-1 p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              Mortgage calculator
            </h1>
            <button
              className="text-slate-700 underline underline-offset-2 hover:text-slate-900 transition-colors"
              onClick={clearAll}
            >
              Clear All
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* amount */}
            <div className="space-y-2 ">
              <label htmlFor="amount" className="text-slate-700 font-medium">
                Mortgage Amount
              </label>
              <div
                className={`group flex border rounded-lg overflow-hidden transition-colors ${
                  errors.amount
                    ? "border-red"
                    : "border-slate-300 focus-within:border-lime"
                }`}
              >
                <span
                  className={`px-4 py-3 font-bold transition-colors ${
                    errors.amount
                      ? "bg-red text-white"
                      : "bg-slate-100 text-slate-700 group-focus-within:bg-lime group-focus-within:text-slate-900"
                  }`}
                >
                  £
                </span>
                <input
                  {...register("amount")}
                  type="text"
                  inputMode="decimal"
                  id="amount"
                  className="w-full px-4 py-3 outline-none font-bold text-slate-900 cursor-pointer"
                  onChange={(e) => {
                    const formatted = formatNumber(e.target.value);
                    setValue("amount", formatted, { shouldValidate: true });
                  }}
                />
              </div>
              {errors.amount && (
                <p className="text-red text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* term */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="term" className="text-slate-700 font-medium">
                  Mortgage Term
                </label>
                <div
                  className={`group flex border rounded-lg overflow-hidden transition-colors ${
                    errors.term
                      ? "border-red"
                      : "border-slate-300 focus-within:border-lime"
                  }`}
                >
                  <input
                    {...register("term")}
                    type="text"
                    inputMode="numeric"
                    id="term"
                    className="w-full px-4 py-3 outline-none font-bold text-slate-900 cursor-pointer"
                    onChange={(e) => {
                      const sanitized = sanitizeInt(e.target.value);
                      setValue("term", sanitized, { shouldValidate: true });
                    }}
                  />
                  <span
                    className={`px-4 py-3 font-bold transition-colors ${
                      errors.term
                        ? "bg-red text-white"
                        : "bg-slate-100 text-slate-700 group-focus-within:bg-lime group-focus-within:text-slate-900"
                    }`}
                  >
                    years
                  </span>
                </div>
                {errors.term && (
                  <p className="text-red text-sm">{errors.term.message}</p>
                )}
              </div>

              {/* interest rate */}
              <div className="space-y-2">
                <label htmlFor="rate" className="text-slate-700 font-medium">
                  Interest Rate
                </label>
                <div
                  className={`group flex border rounded-lg overflow-hidden transition-colors ${
                    errors.rate
                      ? "border-red"
                      : "border-slate-300 focus-within:border-lime"
                  }`}
                >
                  <input
                    {...register("rate")}
                    step="0.1"
                    id="rate"
                    type="text"
                    className="w-full px-4 py-3 outline-none font-bold text-slate-900 cursor-pointer"
                    onChange={(e) => {
                      const sanitized = sanitizeFloat(e.target.value);
                      setValue("rate", sanitized, { shouldValidate: true });
                    }}
                  />
                  <span
                    className={`px-4 py-3 font-bold transition-colors ${
                      errors.rate
                        ? "bg-red text-white"
                        : "bg-slate-100 text-slate-700 group-focus-within:bg-lime group-focus-within:text-slate-900"
                    }`}
                  >
                    %
                  </span>
                </div>
                {errors.rate && (
                  <p className="text-red text-sm">{errors.rate.message}</p>
                )}
              </div>
            </div>

            {/* Mortgage Type */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">
                Mortgage Type
              </label>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors font-bold ${
                    errors.type
                      ? "border-red"
                      : mortgageType === "repayment"
                        ? "border-lime bg-lime/10"
                        : "border-slate-300 hover:border-lime"
                  }`}
                >
                  <input
                    {...register("type")}
                    type="radio"
                    value="repayment"
                    className="w-4 h-4 accent-lime"
                  />
                  Repayment
                </label>
                <label
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors font-bold ${
                    errors.type
                      ? "border-red"
                      : mortgageType === "interest-only"
                        ? "border-lime bg-lime/10"
                        : "border-slate-300 hover:border-lime"
                  }`}
                >
                  <input
                    {...register("type")}
                    type="radio"
                    value="interest-only"
                    className="w-4 h-4 accent-lime"
                  />
                  Interest Only
                </label>
              </div>
              {errors.type && (
                <p className="text-red text-sm">{errors.type.message}</p>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full md:w-fit cursor-pointer flex items-center justify-center gap-3 bg-lime text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-opacity-70 transition-all"
            >
              <img src="assets/images/icon-calculator.svg" alt="" />
              Calculate Repayments
            </motion.button>
          </form>
        </section>

        {/* --- RIGHT SECTION: Results --- */}
        <section className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center md:text-left md:rounded-bl-[80px] bg-slate-900">
          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <img
                  src="assets/images/illustration-empty.svg"
                  alt=""
                  className="mb-6"
                />
                <h2 className="text-white text-2xl font-bold mb-4">
                  Results shown here
                </h2>
                <p className="text-slate-300">
                  Complete the form and click "calculate repayments" to see what
                  your monthly repayments would be.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full"
              >
                <h2 className="text-white text-2xl font-bold mb-4">
                  Your results
                </h2>
                <p className="text-slate-300 mb-8">
                  Your results are shown below based on the information you
                  provided. To adjust the results, edit the form and click
                  "calculate repayments" again.
                </p>

                <div className="bg-slate-900/50 p-6 md:p-8 rounded-xl border-t-4 border-lime shadow-2xl bg-black/20">
                  <div className="mb-8 border-b border-slate-700 pb-8">
                    <p className="text-slate-300 mb-2">
                      Your monthly repayments
                    </p>
                    <p className="text-lime text-5xl md:text-6xl font-bold">
                      £{results.monthly}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-300 mb-2">
                      Total you'll repay over the term
                    </p>
                    <p className="text-white text-2xl font-bold">
                      £{results.total}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <footer className="mt-8 text-center text-xs text-slate-500">
        Challenge by{" "}
        <a
          href="https://www.frontendmentor.io?ref=challenge"
          className="text-slate-700 hover:text-lime underline transition-colors"
        >
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a
          href="https://github.com/BaskoroR725"
          className="text-slate-700 hover:text-lime underline transition-colors"
        >
          Baskoro Ramadhan
        </a>
        .
      </footer>
    </div>
  );
}

export default App;
