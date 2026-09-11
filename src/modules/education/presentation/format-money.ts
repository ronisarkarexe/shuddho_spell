export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatBdt(amount: number): string {
  return `৳${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatLakh(bdt: number): string {
  const lakh = Math.round((bdt / 100_000) * 10) / 10;

  return String(lakh);
}
