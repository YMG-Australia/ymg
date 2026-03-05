export interface DiscountCode {
  code: string;
  price: number;
  validUntil?: Date;
  description: string;
}

export const DISCOUNT_CODES: DiscountCode[] = [
  {
    code: "SSE26",
    price: 230,
    validUntil: new Date("2026-01-31T23:59:59"),
    description: "SSE26 discount",
  },
  {
    code: "devtest123",
    price: 1,
    description: "Dev testing",
  },
  {
    code: "PADRE",
    price: 200,
    description: "For Priests",
  },
  {
    code: "MelYMG",
    price: 230,
    description: "Melbourne YMG discount",
    validUntil: new Date("2026-04-01T23:59:59"),
  },
];
