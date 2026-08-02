import { useState } from "react";
import { evaluateAgent } from "../../services/underwritingService";

export default function LoanApplicationPage() {
  const [form, setForm] = useState({
    agent_id: "",
    agent_name: "",
    organization_name: "",
    agent_type: "Finance AI",

    trust_score: 90,
    reputation_score: 85,
    task_success_rate: 95,
    confidence_score: 96,

    wallet_balance: 150000,
    predicted_revenue: 200000,
    organization_trust: 92,

    loan_amount: 50000,
    active_loans: 0,

    fraud_score: 5,

    blockchain_verified: true,
    kill_switch: false,
    mission_critical: true,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;

      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await evaluateAgent(form);
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Unable to evaluate AI agent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-5xl font-bold text-slate-900">
            AI Credit Underwriting
          </h1>

          <p className="text-lg text-gray-600 mt-3">
            Evaluate autonomous AI agents for enterprise credit eligibility.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-2 gap-8"
        >

        <div className="col-span-2 bg-white rounded-xl shadow-md border p-6">

  <h2 className="text-2xl font-semibold mb-6">
    Agent Information
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium mb-2">
        Agent ID
      </label>

      <input
        type="text"
        name="agent_id"
        value={form.agent_id}
        onChange={handleChange}
        placeholder="AGT-001"
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Agent Name
      </label>

      <input
        type="text"
        name="agent_name"
        value={form.agent_name}
        onChange={handleChange}
        placeholder="Autonomous Finance Agent"
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Organization
      </label>

      <input
        type="text"
        name="organization_name"
        value={form.organization_name}
        onChange={handleChange}
        placeholder="AgentTrust Labs"
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Agent Type
      </label>

      <select
        name="agent_type"
        value={form.agent_type}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      >
        <option>Finance AI</option>
        <option>Trading AI</option>
        <option>Legal AI</option>
        <option>Healthcare AI</option>
        <option>Operations AI</option>
      </select>
    </div>

  </div>

</div>
  
    <div className="col-span-2 bg-white rounded-xl shadow-md border p-6">

  <h2 className="text-2xl font-semibold mb-6">
    Financial Information
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <label className="block text-sm font-medium mb-2">
        Wallet Balance
      </label>

      <input
        type="number"
        name="wallet_balance"
        value={form.wallet_balance}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Requested Loan Amount
      </label>

      <input
        type="number"
        name="loan_amount"
        value={form.loan_amount}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Predicted Revenue
      </label>

      <input
        type="number"
        name="predicted_revenue"
        value={form.predicted_revenue}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-2">
        Active Loans
      </label>

      <input
        type="number"
        name="active_loans"
        value={form.active_loans}
        onChange={handleChange}
        className="w-full border rounded-lg p-3"
      />
    </div>

  </div>

</div>

    <div className="col-span-2 bg-white rounded-xl shadow-md border p-6">

  <h2 className="text-2xl font-semibold mb-6">
    AI Trust Metrics
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <label className="font-medium block mb-2">
        Trust Score ({form.trust_score})
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="trust_score"
        value={form.trust_score}
        onChange={handleChange}
        className="w-full"
      />
    </div>

    <div>
      <label className="font-medium block mb-2">
        Reputation Score ({form.reputation_score})
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="reputation_score"
        value={form.reputation_score}
        onChange={handleChange}
        className="w-full"
      />
    </div>

    <div>
      <label className="font-medium block mb-2">
        Task Success Rate ({form.task_success_rate}%)
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="task_success_rate"
        value={form.task_success_rate}
        onChange={handleChange}
        className="w-full"
      />
    </div>

    <div>
      <label className="font-medium block mb-2">
        Confidence Score ({form.confidence_score}%)
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="confidence_score"
        value={form.confidence_score}
        onChange={handleChange}
        className="w-full"
      />
    </div>

  </div>

</div>
     
     <div className="col-span-2 bg-white rounded-xl shadow-md border p-6">

  <h2 className="text-2xl font-semibold mb-6">
    Risk Controls
  </h2>

  <div className="grid md:grid-cols-2 gap-6">

    <div>
      <label className="font-medium block mb-2">
        Fraud Score ({form.fraud_score})
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="fraud_score"
        value={form.fraud_score}
        onChange={handleChange}
        className="w-full"
      />
    </div>

    <div>
      <label className="font-medium block mb-2">
        Organization Trust ({form.organization_trust})
      </label>

      <input
        type="range"
        min="0"
        max="100"
        name="organization_trust"
        value={form.organization_trust}
        onChange={handleChange}
        className="w-full"
      />
    </div>

    <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
      <input
        type="checkbox"
        name="blockchain_verified"
        checked={form.blockchain_verified}
        onChange={handleChange}
      />
      Blockchain Verified
    </label>

    <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer">
      <input
        type="checkbox"
        name="mission_critical"
        checked={form.mission_critical}
        onChange={handleChange}
      />
      Mission Critical
    </label>

    <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer md:col-span-2">
      <input
        type="checkbox"
        name="kill_switch"
        checked={form.kill_switch}
        onChange={handleChange}
      />
      Kill Switch Enabled
    </label>

  </div>

</div>

    <div className="col-span-2 bg-slate-900 rounded-2xl p-8 text-white shadow-xl">

  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold">
      Live AI Underwriting Preview
    </h2>

    <span className="rounded-full bg-blue-600 px-4 py-2 text-sm">
      Real-Time Analysis
    </span>
  </div>

  <div className="grid md:grid-cols-4 gap-6">

    <div className="rounded-xl bg-slate-800 p-5">
      <p className="text-sm text-slate-400">
        Risk Level
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        {form.fraud_score < 30
          ? "LOW"
          : form.fraud_score < 70
          ? "MEDIUM"
          : "HIGH"}
      </h3>
    </div>

    <div className="rounded-xl bg-slate-800 p-5">
      <p className="text-sm text-slate-400">
        Estimated Credit
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        ₹
        {(
          form.wallet_balance * 2 +
          form.predicted_revenue * 0.4
        ).toLocaleString()}
      </h3>
    </div>

    <div className="rounded-xl bg-slate-800 p-5">
      <p className="text-sm text-slate-400">
        AI Confidence
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        {form.confidence_score}%
      </h3>
    </div>

    <div className="rounded-xl bg-slate-800 p-5">
      <p className="text-sm text-slate-400">
        Trust Index
      </p>

      <h3 className="mt-3 text-3xl font-bold">
        {Math.round(
          (
            form.trust_score +
            form.reputation_score +
            form.organization_trust
          ) / 3
        )}
      </h3>
    </div>

  </div>

  <div className="mt-8">

    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-blue-600 py-4 text-lg font-semibold transition hover:bg-blue-700 disabled:bg-gray-500"
    >
      {loading ? "Evaluating AI Agent..." : "Evaluate AI Agent"}
    </button>

  </div>

</div>

  {error && (
  <div className="col-span-2 rounded-lg bg-red-100 p-4 text-red-700">
    {error}
  </div>
)}

{result && (
  <div className="col-span-2 rounded-xl border bg-gray-50 p-6">
    <h2 className="mb-4 text-2xl font-bold">
      Evaluation Result
    </h2>

    <pre className="whitespace-pre-wrap text-sm">
      {JSON.stringify(result, null, 2)}
    </pre>
  </div>
)}

    </form>

      </div>

    </div>
  );
}