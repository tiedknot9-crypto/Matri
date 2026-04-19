import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import dotenv from "dotenv";
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server setup...");
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  let payuClient: any;
  try {
    const PayUModule = require('payu-websdk');
    const PayUConstructor = PayUModule.default || PayUModule;
    payuClient = new PayUConstructor({
      key: process.env.PAYU_MERCHANT_KEY || 'PLACEHOLDER_KEY',
      salt: process.env.PAYU_SALT || 'PLACEHOLDER_SALT',
    }, (process.env.VITE_PAYU_MODE?.toUpperCase() === 'PRODUCTION' ? 'PROD' : 'TEST'));
    console.log("PayU Client initialized successfully");
  } catch (err) {
    console.error("PayU initialization failed:", err);
  }

  // API Route for PayU Payment Initiation
  app.post("/api/payu/payment-initiate", async (req, res) => {
    try {
      if (!payuClient) {
        throw new Error("PayU client is not initialized. Please check server logs and configuration.");
      }
      const { amount, productinfo, firstname, email, phone, surl, furl } = req.body;
      const txnid = `TXN${Date.now()}`;
      
      // Attempt to get the origin from environment or request headers
      const host = req.get('host');
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const origin = process.env.APP_URL || `${protocol}://${host}`;

      const paymentData = {
        txnid,
        amount: Number(amount).toFixed(2),
        productinfo: String(productinfo || 'Wallet Recharge').trim(),
        firstname: String(firstname || 'User').trim(),
        email: String(email || 'user@example.com').trim(),
        phone: String(phone || '9999999999').trim(),
        surl: surl || `${origin}/api/payu/handle-response`,
        furl: furl || `${origin}/api/payu/handle-response`,
      };

      console.log("Initiating PayU with data:", { ...paymentData, email: '***', phone: '***' });
      const result = await payuClient.paymentInitiate(paymentData);
      // result is usually a string representing the HTML form to auto-submit
      res.json({ html: result, txnid });
    } catch (error: any) {
      console.error("PayU Initiate Error:", error);
      res.status(500).json({ error: error.message || "Failed to initiate payment" });
    }
  });

  // Verify Payment status
  app.get("/api/payu/verify-payment/:txnid", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const { txnid } = req.params;
      const result = await payuClient.verifyPayment(txnid);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Transaction Details
  app.get("/api/payu/transaction-details", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) return res.status(400).json({ error: "startDate and endDate are required" });
      const result = await payuClient.getTransactionDetails(startDate as string, endDate as string);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Settlement Details
  app.get("/api/payu/settlement-details/:identifier", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const { identifier } = req.params; // date or UTR
      const result = await payuClient.getSettlementDetails(identifier);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Net Banking Status
  app.get("/api/payu/netbanking-status", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const { bankCode } = req.query;
      const result = await payuClient.getNetbankingStatus(bankCode || 'default');
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get Checkout Details
  app.post("/api/payu/checkout-details", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const result = await payuClient.getCheckoutDetails(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create Invoice
  app.post("/api/payu/create-invoice", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const result = await payuClient.createInvoice(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Expire Invoice
  app.post("/api/payu/expire-invoice/:txnid", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const result = await payuClient.expireInvoice(req.params.txnid);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get EMI Interest Rates
  app.get("/api/payu/emi-amount-interest/:amount", async (req, res) => {
    try {
      if (!payuClient) throw new Error("PayU client not initialized");
      const result = await payuClient.getEmiAmountAccordingToInterest(req.params.amount);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Callback handler (POST from PayU)
  app.post("/api/payu/handle-response", (req, res) => {
    const response = req.body;
    console.log("PayU Response:", response);
    
    // Redirect back to frontend with status and txnid
    const status = response.status;
    const txnid = response.txnid;
    const amount = response.amount;
    
    let errorMsg = response.error_Message || response.field9 || response.error || '';
    
    // Normalize and clean error message
    const cleanError = String(errorMsg).trim();
    if (
      !cleanError || 
      cleanError === 'E000' || 
      cleanError.toLowerCase() === 'no error' || 
      cleanError.toLowerCase() === 'success' ||
      cleanError.toLowerCase() === 'undefined' ||
      cleanError.toLowerCase() === 'null'
    ) {
      errorMsg = '';
    }
    
    // Construct redirect URL, omitting error param if empty to keep it clean
    let redirectUrl = `/payment-callback?status=${status}&txnid=${txnid}&amount=${amount}`;
    if (errorMsg) {
      redirectUrl += `&error=${encodeURIComponent(errorMsg)}`;
    }
    
    res.redirect(redirectUrl);
  });

  // API Route for PayU Hash Generation (Old manual way, keeping for compatibility if needed)
  app.post("/api/payu/generate-hash", (req, res) => {
    const { key, txnid, amount, productinfo, firstname, email, udf1, udf2, udf3, udf4, udf5 } = req.body;
    const salt = process.env.PAYU_SALT;

    if (!salt) {
      return res.status(500).json({ error: "PAYU_SALT not configured on server" });
    }

    // Hash Formula: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1 || ""}|${udf2 || ""}|${udf3 || ""}|${udf4 || ""}|${udf5 || ""}||||||${salt}`;
    
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");
    
    res.json({ hash });
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical error starting server:", err);
  process.exit(1);
});
