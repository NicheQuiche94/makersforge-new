"use client";

import { useState, useMemo } from "react";
import { Minus, Plus, Check, ArrowRight, Users, Calendar, Shield, Target, Percent } from "lucide-react";
import Link from "next/link";

const CONTRACT_DURATIONS = [
  { value: 3, label: "3 months" },
  { value: 6, label: "6 months" },
  { value: 9, label: "9 months" },
  { value: 12, label: "12 months" },
];

const PRICING = {
  permanent: {
    individual: 10000,
    team: 8000,
  },
  contractor: {
    monthly: 1000,
    discountedMonthly: 850,
    discountThreshold: 3, // More than 3 contractors triggers discount
  },
  minimumHires: 4,
  paymentMonths: 6,
};

const INCLUDED_FEATURES = [
  { icon: Target, text: "Talent strategy session" },
  { icon: Calendar, text: "Prioritised hiring roadmap" },
  { icon: Shield, text: "Replacement guarantee on all hires" },
  { icon: Users, text: "Exclusive partnership" },
];

export function TeamBuildCalculator() {
  const [permanentHires, setPermanentHires] = useState(2);
  const [contractHires, setContractHires] = useState(2);
  const [contractDuration, setContractDuration] = useState(6);
  const [paymentOption, setPaymentOption] = useState<"single" | "monthly">("single");

  const totalHires = permanentHires + contractHires;
  const meetsMinimum = totalHires >= PRICING.minimumHires;
  const hiresToUnlock = PRICING.minimumHires - totalHires;
  
  // Check if contractor discount applies
  const contractorDiscountApplies = meetsMinimum && contractHires > PRICING.contractor.discountThreshold;
  const effectiveContractorRate = contractorDiscountApplies 
    ? PRICING.contractor.discountedMonthly 
    : PRICING.contractor.monthly;

  const calculations = useMemo(() => {
    const permanentIndividual = permanentHires * PRICING.permanent.individual;
    const permanentTeam = permanentHires * PRICING.permanent.team;
    
    // Individual contractor cost (always full rate)
    const contractorIndividualCost = contractHires * contractDuration * PRICING.contractor.monthly;
    
    // Team contractor cost (discounted if >3 contractors and meets minimum)
    const teamContractorRate = (meetsMinimum && contractHires > PRICING.contractor.discountThreshold)
      ? PRICING.contractor.discountedMonthly
      : PRICING.contractor.monthly;
    const contractorTeamCost = contractHires * contractDuration * teamContractorRate;
    
    const individualTotal = permanentIndividual + contractorIndividualCost;
    const teamTotal = permanentTeam + contractorTeamCost;
    
    const savings = individualTotal - teamTotal;
    const savingsPercent = individualTotal > 0 ? Math.round((savings / individualTotal) * 100) : 0;
    
    const monthlyPayment = Math.ceil(teamTotal / PRICING.paymentMonths);

    // Calculate contractor savings separately for display
    const contractorSavings = contractorIndividualCost - contractorTeamCost;

    return {
      permanentIndividual,
      permanentTeam,
      contractorIndividualCost,
      contractorTeamCost,
      contractorSavings,
      individualTotal,
      teamTotal,
      savings,
      savingsPercent,
      monthlyPayment,
      teamContractorRate,
    };
  }, [permanentHires, contractHires, contractDuration, meetsMinimum]);

  function adjustValue(
    setter: React.Dispatch<React.SetStateAction<number>>,
    current: number,
    delta: number,
    min: number = 0,
    max: number = 20
  ) {
    const newValue = current + delta;
    if (newValue >= min && newValue <= max) {
      setter(newValue);
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white font-heading mb-6">
          Configure Your Team
        </h3>

        {/* Permanent Hires */}
        <div className="mb-8">
          <label className="block text-white/70 text-sm mb-3">
            Permanent Hires
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => adjustValue(setPermanentHires, permanentHires, -1)}
              disabled={permanentHires === 0}
              className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-20 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{permanentHires}</span>
            </div>
            <button
              onClick={() => adjustValue(setPermanentHires, permanentHires, 1)}
              className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <span className="text-white/50 text-sm ml-2">
              @ {formatCurrency(PRICING.permanent.individual)} each
            </span>
          </div>
        </div>

        {/* Contract Hires */}
        <div className="mb-8">
          <label className="block text-white/70 text-sm mb-3">
            Contract Hires
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => adjustValue(setContractHires, contractHires, -1)}
              disabled={contractHires === 0}
              className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="w-20 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{contractHires}</span>
            </div>
            <button
              onClick={() => adjustValue(setContractHires, contractHires, 1)}
              className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="ml-2">
              <span className="text-white/50 text-sm">
                @ {formatCurrency(PRICING.contractor.monthly)}/month each
              </span>
              {contractHires > PRICING.contractor.discountThreshold && (
                <span className="block text-green-400 text-xs">
                  {formatCurrency(PRICING.contractor.discountedMonthly)}/mo with 4+ contractors
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Contract Duration */}
        {contractHires > 0 && (
          <div className="mb-8">
            <label className="block text-white/70 text-sm mb-3">
              Expected Contract Duration
            </label>
            <div className="flex flex-wrap gap-3">
              {CONTRACT_DURATIONS.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setContractDuration(duration.value)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    contractDuration === duration.value
                      ? "bg-brand-orange border-brand-orange text-white"
                      : "bg-white/5 border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contractor Volume Discount Notice */}
        {contractHires > 0 && contractHires <= PRICING.contractor.discountThreshold && meetsMinimum && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Percent className="w-4 h-4" />
              <span>Add {PRICING.contractor.discountThreshold - contractHires + 1} more contractor{PRICING.contractor.discountThreshold - contractHires + 1 !== 1 ? 's' : ''} to unlock £{PRICING.contractor.discountedMonthly}/mo rate</span>
            </div>
          </div>
        )}

        {/* Minimum Notice */}
        {!meetsMinimum && totalHires > 0 && (
          <div className="p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
            <p className="text-brand-orange text-sm">
              Add {hiresToUnlock} more hire{hiresToUnlock !== 1 ? "s" : ""} to unlock team pricing
            </p>
          </div>
        )}

        {totalHires === 0 && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-white/50 text-sm">
              Use the controls above to build your team
            </p>
          </div>
        )}
      </div>

      {/* Output Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white font-heading mb-6">
          Your Quote
        </h3>

        {totalHires > 0 ? (
          <>
            {/* Comparison */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Individual Pricing */}
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                  Individual Pricing
                </p>
                {permanentHires > 0 && (
                  <p className="text-white/70 text-sm">
                    {permanentHires} perm × {formatCurrency(PRICING.permanent.individual)}
                  </p>
                )}
                {contractHires > 0 && (
                  <p className="text-white/70 text-sm">
                    {contractHires} contract × {contractDuration}mo × {formatCurrency(PRICING.contractor.monthly)}
                  </p>
                )}
                <p className="text-white font-bold mt-2 pt-2 border-t border-white/10">
                  {formatCurrency(calculations.individualTotal)}
                </p>
              </div>

              {/* Team Pricing */}
              <div className={`p-4 rounded-xl ${meetsMinimum ? "bg-brand-orange/20 border border-brand-orange/30" : "bg-white/5 opacity-50"}`}>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-2">
                  Team Package
                </p>
                {permanentHires > 0 && (
                  <p className="text-white/70 text-sm">
                    {permanentHires} perm × {formatCurrency(PRICING.permanent.team)}
                  </p>
                )}
                {contractHires > 0 && (
                  <p className="text-white/70 text-sm">
                    {contractHires} contract × {contractDuration}mo × {formatCurrency(calculations.teamContractorRate)}
                    {contractorDiscountApplies && (
                      <span className="text-green-400 text-xs ml-1">(-15%)</span>
                    )}
                  </p>
                )}
                <p className="text-white font-bold mt-2 pt-2 border-t border-white/10">
                  {formatCurrency(calculations.teamTotal)}
                </p>
              </div>
            </div>

            {/* Savings Badge */}
            {meetsMinimum && calculations.savings > 0 && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6 text-center">
                <p className="text-green-400 font-bold text-lg">
                  You save {formatCurrency(calculations.savings)} ({calculations.savingsPercent}%)
                </p>
                {contractorDiscountApplies && calculations.contractorSavings > 0 && (
                  <p className="text-green-400/70 text-sm mt-1">
                    Includes {formatCurrency(calculations.contractorSavings)} contractor volume discount
                  </p>
                )}
              </div>
            )}

            {/* Payment Options */}
            {meetsMinimum && (
              <div className="mb-6">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Payment Option
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => setPaymentOption("single")}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      paymentOption === "single"
                        ? "bg-brand-orange/20 border-brand-orange/50"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Single Payment</p>
                        <p className="text-white/50 text-sm">Pay upfront</p>
                      </div>
                      <p className="text-white font-bold text-xl">
                        {formatCurrency(calculations.teamTotal)}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentOption("monthly")}
                    className={`w-full p-4 rounded-xl border text-left transition-colors ${
                      paymentOption === "monthly"
                        ? "bg-brand-orange/20 border-brand-orange/50"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Over 6 Months</p>
                        <p className="text-white/50 text-sm">Split payments</p>
                      </div>
                      <p className="text-white font-bold text-xl">
                        {formatCurrency(calculations.monthlyPayment)}<span className="text-white/50 text-sm font-normal">/mo</span>
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Included Features */}
            {meetsMinimum && (
              <div className="mb-6">
                <p className="text-white/50 text-xs uppercase tracking-wider mb-3">
                  Included
                </p>
                <div className="space-y-2">
                  {INCLUDED_FEATURES.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Check className="w-3 h-3 text-green-400" />
                      </div>
                      <span className="text-white/70 text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <Link
              href="/contact?type=team-build"
              className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${
                meetsMinimum
                  ? "bg-brand-orange text-white hover:bg-brand-orange/90"
                  : "bg-white/10 text-white/50 cursor-not-allowed"
              }`}
              onClick={(e) => !meetsMinimum && e.preventDefault()}
            >
              {meetsMinimum ? (
                <>
                  Book Your Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                `Add ${hiresToUnlock} more hire${hiresToUnlock !== 1 ? "s" : ""} to continue`
              )}
            </Link>

            {/* Minimum note */}
            <p className="text-white/30 text-xs text-center mt-4">
              Minimum 4 hires for team packages
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Users className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/50">
              Configure your team to see pricing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}