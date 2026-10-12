/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Binary,
  BarChart3,
  BookOpen,
  Sparkles,
  Info,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import {
  calculateShannonEntropy,
  calculateByteDistribution,
  generateSyntheticDexBytes,
  getEntropyVerdict,
} from '../engine/entropyEngine';

export const ScientificEntropyViewer: React.FC = () => {
  const [simulationMode, setSimulationMode] = useState<'PLAINTEXT' | 'STANDARD_DEX' | 'PACKED_MALWARE'>(
    'PACKED_MALWARE'
  );
  const [byteSize, setByteSize] = useState<number>(4096);
  const [randomSeed, setRandomSeed] = useState<number>(1);

  // Generate bytes and calculate entropy
  const sampleBytes = useMemo(() => {
    return generateSyntheticDexBytes(simulationMode, byteSize);
  }, [simulationMode, byteSize, randomSeed]);

  const entropy = useMemo(() => {
    return calculateShannonEntropy(sampleBytes);
  }, [sampleBytes]);

  const distribution = useMemo(() => {
    return calculateByteDistribution(sampleBytes);
  }, [sampleBytes]);

  const verdict = getEntropyVerdict(entropy);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header Info */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Information Theory & Scientific Analysis
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1 flex items-center gap-2">
              <Binary className="w-5 h-5 text-purple-400" />
              Shannon Entropy & Binary Randomness Engine
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Anti-malware research relies on Shannon entropy to detect packed Android binaries,
              encrypted DEX stagers, and obfuscated native ELF libraries that evade signature-based
              scanning.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRandomSeed((prev) => prev + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Resample Bytes
            </button>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Simulation Controls & Formula */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Simulation Byte Stream Mode</h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSimulationMode('PLAINTEXT')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  simulationMode === 'PLAINTEXT'
                    ? 'bg-indigo-950/60 border-indigo-500/80 text-white ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">Plaintext</span>
                <span className="text-[10px] text-slate-500">Low Entropy (~3.5)</span>
              </button>

              <button
                onClick={() => setSimulationMode('STANDARD_DEX')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  simulationMode === 'STANDARD_DEX'
                    ? 'bg-indigo-950/60 border-indigo-500/80 text-white ring-1 ring-indigo-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">Dalvik DEX</span>
                <span className="text-[10px] text-slate-500">Normal (~6.3)</span>
              </button>

              <button
                onClick={() => setSimulationMode('PACKED_MALWARE')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  simulationMode === 'PACKED_MALWARE'
                    ? 'bg-rose-950/60 border-rose-500/80 text-white ring-1 ring-rose-500/40'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block text-rose-300">Packed Trojan</span>
                <span className="text-[10px] text-slate-500">High (&gt;7.5)</span>
              </button>
            </div>

            {/* Scientific Mathematical Definition */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                Information Theory Foundation
              </span>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center font-mono text-indigo-300 text-xs">
                H(X) = - &sum;<sub>i=0</sub><sup>255</sup> p(x<sub>i</sub>) &middot; log
                <sub>2</sub>(p(x<sub>i</sub>))
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Where <code>p(x_i)</code> represents the empirical frequency probability of byte
                value <code>x_i &isin; [0..255]</code> across the sampled binary chunk.
              </p>
            </div>

            {/* Live Entropy Result Card */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Computed Entropy</span>
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                    entropy >= 7.35
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : entropy >= 6.85
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {verdict.verdict}
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono">
                <span className="text-3xl font-extrabold text-slate-100">
                  {entropy.toFixed(4)}
                </span>
                <span className="text-xs text-slate-400">Max theoretical: 8.0000</span>
              </div>

              {/* Entropy Bar Meter */}
              <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    entropy >= 7.35
                      ? 'bg-gradient-to-r from-orange-500 to-rose-500'
                      : entropy >= 6.85
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  }`}
                  style={{ width: `${(entropy / 8.0) * 100}%` }}
                />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{verdict.explanation}</p>
            </div>
          </div>

          {/* Academic References */}
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Scientific Literature & Research References
            </h4>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block">
                  Entropy-based Detection of Packed Android Malware
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  IEEE Transactions on Dependable and Secure Computing (2022)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="font-semibold text-slate-200 block">
                  DEX Deobfuscation via Bytecode Shannon Distribution
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  ACM CCS Workshop on Mobile Security Technologies (MoST)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Byte Distribution Histogram */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-400" />
                  Empirical Byte Distribution Histogram (256 Byte Space)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  High entropy malware produces near-uniform flat distributions; structured code produces sharp opcode clusters.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {sampleBytes.length} bytes sampled
              </span>
            </div>

            {/* Histogram Bars */}
            <div className="h-64 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-2 bg-slate-950 rounded-xl border border-slate-800/80">
              {distribution.map((item, index) => {
                const maxPct = Math.max(...distribution.map((d) => d.percentage), 1);
                const heightPct = Math.max(5, (item.percentage / maxPct) * 100);

                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-mono text-slate-300 bg-slate-800 px-1 py-0.5 rounded mb-1 whitespace-nowrap pointer-events-none">
                      {item.percentage}%
                    </div>

                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        entropy >= 7.35
                          ? 'bg-rose-500/80 group-hover:bg-rose-400'
                          : entropy >= 6.85
                          ? 'bg-amber-500/80 group-hover:bg-amber-400'
                          : 'bg-indigo-500/80 group-hover:bg-indigo-400'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[9px] font-mono text-slate-500 mt-1 transform -rotate-45 origin-top-left hidden sm:inline">
                      {item.bucket.split('-')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800">
              <span>0x00 (Null Byte / Dalvik NOP)</span>
              <span>0x80 (Mid-Range Opcode Space)</span>
              <span>0xFF (Maximum Byte Value)</span>
            </div>

            {/* Explanatory Comparison Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="font-bold text-slate-300 block mb-0.5">Plaintext (H &lt; 5.0)</span>
                <p className="text-[11px] text-slate-400">
                  ASCII characters dominate. High frequency of letters, spaces, and punctuation.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                <span className="font-bold text-slate-300 block mb-0.5">Normal DEX (5.6 - 7.1)</span>
                <p className="text-[11px] text-slate-400">
                  Dalvik bytecodes mixed with constant pool strings and method references.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-900/40 bg-rose-950/10 text-xs">
                <span className="font-bold text-rose-300 block mb-0.5">Packed Trojan (&gt; 7.2)</span>
                <p className="text-[11px] text-slate-400">
                  Uniform random distribution caused by AES/ChaCha20 encrypted payload stager.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
