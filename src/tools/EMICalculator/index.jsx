import React, { useState, useMemo } from 'react';
import { Share2, DollarSign, Calculator, PieChart } from 'lucide-react';
import ToolCard from '../../components/ToolCard';
import InputField from '../../components/InputField';
import AdBanner from '../../components/AdBanner'; // Import AdBanner

const EMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [tenureType, setTenureType] = useState('months'); // 'months' or 'years'

  const results = useMemo(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) || 0;
    const time = parseFloat(tenure) || 0;

    if (principal === 0 || rate === 0 || time === 0) {
      return { emi: 0, totalInterest: 0, totalAmount: 0 };
    }

    const r = rate / 12 / 100;
    const n = tenureType === 'years' ? time * 12 : time;

    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalAmount = emi * n;
    const totalInterest = totalAmount - principal;

    return {
      emi: isFinite(emi) ? emi : 0,
      totalInterest: isFinite(totalInterest) ? totalInterest : 0,
      totalAmount: isFinite(totalAmount) ? totalAmount : 0,
      principalPercent: isFinite(totalAmount) && totalAmount > 0 ? (principal / totalAmount) * 100 : 0,
      interestPercent: isFinite(totalAmount) && totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 0
    };
  }, [loanAmount, interestRate, tenure, tenureType]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <ToolCard title="EMI Calculator" subtitle="Plan your loans and finances locally.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-white/20 dark:border-white/10">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
              <Calculator size={20} className="text-indigo-500" />
              Loan Details
            </h3>
            
            <div className="space-y-4">
              <InputField 
                label="Loan Amount"
                type="number"
                min="0"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
              />
              
              <InputField 
                label="Interest Rate (%)"
                type="number"
                min="0"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">Tenure</label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <InputField 
                      type="number"
                      min="1"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                    />
                  </div>
                  <div className="flex bg-gray-200 dark:bg-white/10 p-1 rounded-xl">
                    <button
                      onClick={() => setTenureType('years')}
                      className={`px-3 py-1 text-sm font-bold rounded-lg transition-all ${tenureType === 'years' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Yr
                    </button>
                    <button
                      onClick={() => setTenureType('months')}
                      className={`px-3 py-1 text-sm font-bold rounded-lg transition-all ${tenureType === 'months' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      Mo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <AdBanner format="rectangle" slotId="emi-sidebar" className="hidden lg:flex" />
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-sm font-medium text-indigo-200 uppercase tracking-widest mb-1">Monthly EMI</div>
            <div className="text-4xl font-black mb-6">{formatCurrency(results.emi)}</div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
               <div>
                 <div className="text-xs text-indigo-200 mb-1">Total Interest</div>
                 <div className="text-lg font-bold">{formatCurrency(results.totalInterest)}</div>
               </div>
               <div>
                 <div className="text-xs text-indigo-200 mb-1">Total Amount</div>
                 <div className="text-lg font-bold">{formatCurrency(results.totalAmount)}</div>
               </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-white/20 dark:border-white/10 flex flex-col items-center justify-center">
             <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 self-start flex items-center gap-2">
               <PieChart size={16} /> Breakdown
             </h3>
             
             <div className="relative w-48 h-48 rounded-full" style={{
               background: `conic-gradient(#818cf8 0% ${results.principalPercent}%, #c084fc ${results.principalPercent}% 100%)`
             }}>
               <div className="absolute inset-4 bg-gray-100 dark:bg-gray-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500">Principal</span>
                  <span className="font-bold text-indigo-500">{Math.round(results.principalPercent)}%</span>
                  <div className="h-px w-8 bg-gray-300 my-1"></div>
                  <span className="font-bold text-purple-500">{Math.round(results.interestPercent)}%</span>
                  <span className="text-xs text-gray-500">Interest</span>
               </div>
             </div>

             <div className="flex gap-6 mt-6">
               <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                 <div className="w-3 h-3 rounded-full bg-indigo-400"></div> Principal
               </div>
               <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                 <div className="w-3 h-3 rounded-full bg-purple-400"></div> Interest
               </div>
             </div>
          </div>

          <AdBanner format="mobile" slotId="emi-bottom" className="w-full" />
        </div>

      </div>
    </ToolCard>
  );
};

export default EMICalculator;
