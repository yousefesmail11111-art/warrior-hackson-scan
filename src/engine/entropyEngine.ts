/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Calculates the scientific Shannon Entropy of a byte buffer or simulated binary chunk.
 * Formula: H(X) = - SUM( p(i) * log2(p(i)) ) for i in [0..255]
 *
 * Entropy Scale:
 * - 0.0 - 5.5: Normal uncompressed code or plain text
 * - 5.6 - 7.1: Standard compiled DEX / bytecode / compressed assets
 * - 7.2 - 8.0: Strongly encrypted payload, dynamic DEX stager, or packed malware (DexProtector, Bangcle, SecShell)
 */
export function calculateShannonEntropy(byteData: Uint8Array): number {
  if (byteData.length === 0) return 0;

  const frequencies = new Array(256).fill(0);
  for (let i = 0; i < byteData.length; i++) {
    frequencies[byteData[i]]++;
  }

  const length = byteData.length;
  let entropy = 0;

  for (let i = 0; i < 256; i++) {
    if (frequencies[i] > 0) {
      const probability = frequencies[i] / length;
      entropy -= probability * Math.log2(probability);
    }
  }

  return Number(entropy.toFixed(4));
}

/**
 * Computes byte distribution histogram buckets (16 buckets of 16 values each)
 */
export function calculateByteDistribution(byteData: Uint8Array): { bucket: string; count: number; percentage: number }[] {
  if (byteData.length === 0) return [];

  const buckets = new Array(16).fill(0);
  for (let i = 0; i < byteData.length; i++) {
    const bucketIndex = Math.min(15, Math.floor(byteData[i] / 16));
    buckets[bucketIndex]++;
  }

  return buckets.map((count, index) => {
    const startHex = (index * 16).toString(16).padStart(2, '0').toUpperCase();
    const endHex = ((index + 1) * 16 - 1).toString(16).padStart(2, '0').toUpperCase();
    return {
      bucket: `0x${startHex}-0x${endHex}`,
      count,
      percentage: Number(((count / byteData.length) * 100).toFixed(1)),
    };
  });
}

/**
 * Generates simulated synthetic byte chunks for realistic Android DEX / APK testing
 */
export function generateSyntheticDexBytes(mode: 'PLAINTEXT' | 'STANDARD_DEX' | 'PACKED_MALWARE', sizeBytes = 4096): Uint8Array {
  const bytes = new Uint8Array(sizeBytes);

  if (mode === 'PLAINTEXT') {
    // Highly patterned, low entropy
    const pattern = [0x63, 0x6C, 0x61, 0x73, 0x73, 0x20, 0x4D, 0x61, 0x69, 0x6E, 0x20, 0x7B, 0x0A, 0x20, 0x20, 0x7D];
    for (let i = 0; i < sizeBytes; i++) {
      bytes[i] = pattern[i % pattern.length];
    }
  } else if (mode === 'STANDARD_DEX') {
    // Normal DEX bytecode distribution (~6.3 entropy)
    for (let i = 0; i < sizeBytes; i++) {
      // Skewed towards common opcodes and ASCII string table
      const rand = Math.random();
      if (rand < 0.4) {
        bytes[i] = Math.floor(Math.random() * 64) + 32; // printable ASCII
      } else if (rand < 0.7) {
        bytes[i] = Math.floor(Math.random() * 32); // dalvik opcodes & zero-padding
      } else {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
  } else {
    // PACKED_MALWARE: High entropy, quasi-uniform pseudo-random distribution (~7.6 - 7.95)
    for (let i = 0; i < sizeBytes; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }

  return bytes;
}

/**
 * Assesses the risk verdict of Shannon entropy value
 */
export function getEntropyVerdict(entropy: number): {
  verdict: 'NORMAL' | 'SUSPICIOUS' | 'PACKED_ENCRYPTED_PAYLOAD';
  riskScore: number;
  explanation: string;
} {
  if (entropy >= 7.35) {
    return {
      verdict: 'PACKED_ENCRYPTED_PAYLOAD',
      riskScore: 92,
      explanation: `Scientific Shannon Entropy of ${entropy.toFixed(2)} / 8.0 indicates high-density cryptographic obfuscation. Characteristic of dynamic malware droppers concealing raw DEX payloads from static analysis.`,
    };
  }
  if (entropy >= 6.85) {
    return {
      verdict: 'SUSPICIOUS',
      riskScore: 55,
      explanation: `Shannon Entropy of ${entropy.toFixed(2)} / 8.0 is higher than typical compiled Android bytecode. Indicates compressed native binaries or potential light obfuscation.`,
    };
  }
  return {
    verdict: 'NORMAL',
    riskScore: 10,
    explanation: `Shannon Entropy of ${entropy.toFixed(2)} / 8.0 corresponds to standard compiled Android Dalvik/ART bytecode and structured assets.`,
  };
}
