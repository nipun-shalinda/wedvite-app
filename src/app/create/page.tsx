"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getDefaultCard, encodeCardData } from "@/lib/card-data";
import type { CardData } from "@/lib/card-data";
import { saveCardToSheet } from "@/lib/google-sheet";
import StepDetails from "@/components/create/StepDetails";
import StepImage from "@/components/create/StepImage";
import StepGoogleSheet from "@/components/create/StepGoogleSheet";
import StepCustomize from "@/components/create/StepCustomize";
import StepPin from "@/components/create/StepPin";

const STEPS = ["Details", "Image", "Google Sheet", "Customize", "PIN"];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CardData>(getDefaultCard());

  function update(field: keyof CardData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }
  function prev() {
    if (step > 0) setStep(step - 1);
  }

  async function handleFinish() {
    const encoded = encodeCardData(form, true);
    const shareUrl = `/create/share?data=${encoded}`;

    // Save to localStorage
    localStorage.setItem("wedvite_my_card", shareUrl);
    if (form.googleScriptUrl) {
      localStorage.setItem("wedvite_sheet_url", form.googleScriptUrl);
      // Backup card data to Google Sheet
      await saveCardToSheet(form.googleScriptUrl, encoded);
    }

    router.push(shareUrl);
  }

  const isValid = () => {
    if (step === 0) return form.groom && form.bride && form.groomParents && form.brideParents && form.date && form.time && form.venue && form.mapLink && (!form.showPoruwa || form.poruwaTime);
    if (step === 4) return form.pin.length === 4;
    return true;
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-[family-name:var(--font-playfair)] text-gray-800">Create Your Invitation</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress */}
        <div className="flex items-center gap-1 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1.5 rounded-full transition-colors ${i <= step ? "bg-[#b8860b]" : "bg-gray-200"}`} />
              <span className={`text-[10px] ${i <= step ? "text-[#b8860b]" : "text-gray-400"}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-gray-50 rounded-xl shadow-sm p-8 border border-gray-200 mb-6">
          {step === 0 && <StepDetails form={form} update={update} />}
          {step === 1 && <StepImage form={form} update={update} />}
          {step === 2 && <StepGoogleSheet form={form} update={update} />}
          {step === 3 && <StepCustomize form={form} update={update} />}
          {step === 4 && <StepPin form={form} update={update} />}
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={prev} className="flex-1 border-2 border-gray-300 text-gray-700 rounded-lg py-3 font-semibold hover:bg-gray-50 transition">
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={next} disabled={!isValid()}
              className="flex-1 bg-[#b8860b] text-white rounded-lg py-3 font-semibold hover:bg-[#a07608] transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
              Next →
            </button>
          ) : (
            <button onClick={handleFinish} disabled={!isValid()}
              className="flex-1 bg-[#b8860b] text-white rounded-lg py-3 font-semibold hover:bg-[#a07608] transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
              Preview & Share ✨
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
