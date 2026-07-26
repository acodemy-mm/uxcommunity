export type BankDetails = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  notes?: string;
};

export function getEnrollBankDetails(): BankDetails {
  return {
    bankName: process.env.ENROLL_BANK_NAME || "KBZ Bank",
    accountName: process.env.ENROLL_BANK_ACCOUNT_NAME || "UX Community",
    accountNumber: process.env.ENROLL_BANK_ACCOUNT || "0000000000",
    notes:
      process.env.ENROLL_BANK_NOTES ||
      "Use your full name as the transfer reference.",
  };
}

export function formatMmk(amount: number): string {
  return `${amount.toLocaleString("en-US")} MMK`;
}
