/**
 * Payment Service for PayU Integration
 */

export interface PayUHashRequest {
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export const generatePayUHash = async (data: PayUHashRequest): Promise<string> => {
  const meta = import.meta as any;
  const key = meta.env.VITE_PAYU_MERCHANT_KEY || 'PLACEHOLDER_KEY';
  
  const response = await fetch('/api/payu/generate-hash', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...data, key }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to generate payment hash');
  }

  const { hash } = await response.json();
  return hash;
};

export const redirectToPayU = (formData: Record<string, string>) => {
  const meta = import.meta as any;
  const mode = meta.env.VITE_PAYU_MODE || 'sandbox';
  const url = mode === 'production' 
    ? 'https://secure.payu.in/_payment' 
    : 'https://test.payu.in/_payment';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = url;

  Object.entries(formData).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
