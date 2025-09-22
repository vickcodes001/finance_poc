import * as dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db';
connectDB();

import axios from 'axios';
import * as express from 'express';
import { createClient } from '@sanity/client';
import * as cors from 'cors';
import authRoutes from './routes/auth';

// this is the sanity setup
const sanityClient = createClient({
  projectId: '8zihpsao',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
});

const app = express();
const PORT = 5000;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// this is the check for required environment variables on startup
if (!process.env.MONO_SECRET_KEY) {
  console.error('MONO_SECRET_KEY environment variable is required');
  process.exit(1);
}

// this is to use route for users sign ups
app.use('/api/auth', authRoutes);

// Route to initiate account connection in test mode
app.post('/connect-account-test', async (req, res) => {
  try {
    const uniqueRef = `test_ref_${Date.now()}`;

    const response = await axios.post(
      'https://api.withmono.com/v2/accounts/initiate',
      {
        meta: { ref: uniqueRef },
        scope: 'auth',
        redirect_url: 'http://localhost:5173/',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'mono-sec-key': process.env.MONO_SECRET_KEY,
          accept: 'application/json',
        },
      }
    );

    console.log('Test mode connection initiated with ref:', uniqueRef);
    res.json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to initiate account connection',
      details: error.response?.data || error.message,
    });
  }
});

// Add this new endpoint to get accounts first
app.get('/accounts', async (req, res) => {
  try {
    const response = await axios.get('https://api.withmono.com/v2/accounts', {
      headers: {
        'Content-Type': 'application/json',
        'mono-sec-key': process.env.MONO_SECRET_KEY,
        accept: 'application/json',
      },
    });
    res.json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch accounts',
      details: error.response?.data || error.message,
    });
  }
});

// ending to sanity
app.post('/save-account-to-sanity/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    // First, get the account from Mono
    const monoResponse = await axios.get(
      `https://api.withmono.com/v2/accounts/${accountId}`,
      {
        headers: {
          'mono-sec-key': process.env.MONO_SECRET_KEY,
          accept: 'application/json',
        },
      }
    );

    const accountData = monoResponse.data.data;

    // Transform data for Sanity
    const sanityDocument = {
      _type: 'bankAccount',
      monoId: accountData.id,
      accountName: accountData.name,
      accountNumber: accountData.account_number,
      currency: accountData.currency,
      balance: accountData.balance,
      authMethod: accountData.auth_method,
      status: accountData.status,
      bvn: accountData.bvn,
      accountType: accountData.type,
      institution: {
        id: accountData.institution.id,
        name: accountData.institution.name,
        type: accountData.institution.type,
        bankCode: accountData.institution.bank_code,
      },
      customer: {
        id: accountData.customer.id,
        name: accountData.customer.name,
        email: accountData.customer.email,
      },
    };

    // Save to Sanity
    const result = await sanityClient.create(sanityDocument);

    res.json({
      success: true,
      message: 'Account saved to Sanity',
      sanityId: result._id,
      accountData: result,
    });
  } catch (error: any) {
    console.error('Error saving to Sanity:', error);
    res.status(500).json({
      error: 'Failed to save account to Sanity',
      details: error.response?.data || error.message,
    });
  }
});

// Check what's actually in Sanity
app.get('/debug-env', (req, res) => {
  res.json({
    hasSanityToken: !!process.env.SANITY_API_TOKEN,
    tokenPreview: process.env.SANITY_API_TOKEN?.substring(0, 8) + '...',
    projectId: '8zihpsao', // This is hardcoded, so should be fine
    dataset: 'production',
  });
});

// Test Sanity connection only
app.get('/test-sanity-connection', async (req, res) => {
  try {
    console.log('🔍 Testing Sanity connection...');
    console.log('Token exists:', !!process.env.SANITY_API_TOKEN);
    console.log('Project ID:', process.env.SANITY_PROJECT_ID || '8zihpsao');

    // Try to create a simple test document
    const testDoc = {
      _type: 'bankAccount',
      monoId: 'test-123',
      accountName: 'Test Account',
      accountNumber: '1234567890',
      currency: 'NGN',
      balance: 1000,
    };

    console.log('📝 Attempting to create test document...');
    const result = await sanityClient.create(testDoc);
    console.log('✅ Success! Created document with ID:', result._id);

    res.json({
      success: true,
      message: 'Sanity connection working',
      documentId: result._id,
      document: result,
    });
  } catch (error: any) {
    console.error('Sanity connection failed:', error);
    res.status(500).json({
      error: 'Sanity connection failed',
      details: {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
