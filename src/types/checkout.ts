export interface CheckoutResult {
  checkout_id: string;
  reservation: {
    id: string;
    priority: 'low' | 'medium' | 'high';
    status: string;
    quote: {
      amount_cents: number;
      currency: string;
      rate: number;
      provider: string;
    };
    created_at: string;
  };
}
