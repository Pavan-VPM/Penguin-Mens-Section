import axios from 'axios';
import crypto from 'crypto';

const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID || 'PGTESTPAYUAT86';
const SALT_KEY = process.env.PHONEPE_SALT_KEY || '96434309-7796-489d-8924-ab56988a6076';
const SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1';

const BASE_URL = process.env.PHONEPE_ENV === 'PRODUCTION'
  ? 'https://api.phonepe.com/apis/hermes'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

/**
 * Generates SHA256 checksum required by PhonePe API
 */
export function generateChecksum(base64Payload, endpoint) {
  const stringToHash = base64Payload + endpoint + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  return `${sha256}###${SALT_INDEX}`;
}

/**
 * Initiates payment request with PhonePe
 */
export async function initiatePayment({ merchantTxnId, amountInPaise, customerId, redirectUrl, callbackUrl, mobileNumber }) {
  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: merchantTxnId,
    merchantUserId: customerId,
    amount: amountInPaise, // PhonePe expects amount in paise (e.g. ₹1999 = 199900)
    redirectUrl,
    redirectMode: 'REDIRECT',
    callbackUrl,
    mobileNumber: mobileNumber || undefined,
    paymentInstrument: { type: 'PAY_PAGE' },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
  const endpoint = '/pg/v1/pay';
  const checksum = generateChecksum(base64Payload, endpoint);

  const response = await axios.post(
    `${BASE_URL}${endpoint}`,
    { request: base64Payload },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      timeout: 10000,
    }
  );

  return response.data;
}

/**
 * Check transaction status directly with PhonePe Hermes API
 */
export async function checkPaymentStatus(merchantTxnId) {
  const endpoint = `/pg/v1/status/${MERCHANT_ID}/${merchantTxnId}`;
  const stringToHash = endpoint + SALT_KEY;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const checksum = `${sha256}###${SALT_INDEX}`;

  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-VERIFY': checksum,
      'X-MERCHANT-ID': MERCHANT_ID,
    },
    timeout: 10000,
  });

  return response.data;
}

/**
 * Verify Server-to-Server Webhook checksum from PhonePe
 */
export function verifyCallbackChecksum(xVerifyHeader, base64Response) {
  if (!xVerifyHeader || !base64Response) return false;
  const stringToHash = base64Response + SALT_KEY;
  const expectedHash = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const expectedChecksum = `${expectedHash}###${SALT_INDEX}`;
  return xVerifyHeader === expectedChecksum;
}
