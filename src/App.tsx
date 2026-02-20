import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "./App.css";

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
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(schema),
  });

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
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md: p-8">
      <div className="bg-white w-full max-w-[1000px] flex flex-col md:flex-row shadow-xl md:rounded-3xl overflow-hidden">
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
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">
                Mortgage Amount
              </label>
              <div
                className={`flex border rounded-lg overflow-hidden transition-colors ${errors.amount ? "border-red" : "border-slate-300 hover:border-slate-900"}`}
              >
                <span
                  className={`px-4 py-3 font-bold ${errors.amount ? "bg-red text-white" : "bg-slate-100 text-slate-700"}`}
                >
                  £
                </span>
                <input
                  {...register("amount")}
                  type="text"
                  className="w-full px-4 py-3 outline-none font-bold text-slate-900"
                />
              </div>
              {errors.amount && (
                <p className="text-red text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* term */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-700 font-medium">
                  Mortgage Term
                </label>
                <div
                  className={`flex border rounded-lg overflow-hidden transition-colors ${errors.term ? "border-red" : "border-slate-300 hover:border-slate-900"}`}
                >
                  <input
                    {...register("term")}
                    type="number"
                    className="w-full px-4 py-3 outline-none font-bold text-slate-900"
                  />
                  <span
                    className={`px-4 py-3 font-bold ${errors.term ? "bg-red text-white" : "bg-slate-100 text-slate-700"}`}
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
                <label className="text-slate-700 font-medium">
                  Interest Rate
                </label>
                <div
                  className={`flex border rounded-lg overflow-hidden transition-colors ${errors.rate ? "border-red" : "border-slate-300 hover:border-slate-900"}`}
                >
                  <input
                    {...register("rate")}
                    step="0.1"
                    type="number"
                    className="w-full px-4 py-3 outline-none font-bold text-slate-900"
                  />
                  <span
                    className={`px-4 py-3 font-bold ${errors.rate ? "bg-red text-white" : "bg-slate-100 text-slate-700"}`}
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
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors font-bold ${errors.type ? "border-red" : "border-slate-300 hover:border-lime"}`}
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
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors font-bold ${errors.type ? "border-red" : "border-slate-300 hover:border-lime"}`}
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
            <button
              type="submit"
              className="w-full md:w-fit flex items-center justify-center gap-3 bg-lime text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-opacity-70 transition-all"
            >
              <img src="/assets/images/icon-calculator.svg" alt="" />
              Calculate Repayments
            </button>
          </form>
        </section>
        
        {/* --- RIGHT SECTION: Results --- */}
        <section className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center text-center md:text-left md:rounded-bl-[80px] bg-slate-900">
          {!results ? (
            <div className="flex flex-col items-center">
              <img
                src="/assets/images/illustration-empty.svg"
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
            </div>
          ) : (
            <div className="w-full">
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
                  <p className="text-slate-300 mb-2">Your monthly repayments</p>
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
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
