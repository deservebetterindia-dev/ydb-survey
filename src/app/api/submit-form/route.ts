import { NextRequest, NextResponse } from 'next/server';
import { JWT } from 'google-auth-library';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting form submission process');
    const { formData, questions } = await request.json();
    console.log('📝 Form data received:', Object.keys(formData));
    console.log('📝 Questions received:', questions?.length || 0);
    
    console.log('🔑 Environment check:');
    console.log('- Sheet ID:', process.env.GOOGLE_SHEET_ID ? 'Present' : 'Missing');
    console.log('- Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Present' : 'Missing');
    console.log('- Private Key:', process.env.GOOGLE_PRIVATE_KEY ? 'Present' : 'Missing');
    
    // Create JWT client for service account
    const jwtClient = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    console.log('🔐 JWT client created');

    // Get access token
    console.log('🎫 Getting access token...');
    const tokens = await jwtClient.authorize();
    console.log('✅ Access token obtained');
    
    // Check if headers exist, if not create them
    console.log('🔍 Checking for existing headers...');
    const checkResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1!A1:Z1`, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    if (!checkResponse.ok) {
      const errorText = await checkResponse.text();
      console.error('❌ Error checking headers:', checkResponse.status, errorText);
      throw new Error(`Failed to check headers: ${checkResponse.status}`);
    }
    
    const checkData = await checkResponse.json();
    console.log('📊 Header check result:', checkData);
    
    // If no data or empty, add headers using question text
    if (!checkData.values || checkData.values.length === 0) {
      console.log('📋 No headers found, creating them from questions...');
      
      // Create headers from question text
      const headers = ['Timestamp', ...questions.map((q: any) => q.question)];
      
      const headerResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1!A1:${String.fromCharCode(65 + headers.length - 1)}1?valueInputOption=RAW`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: [headers] })
      });
      
      if (!headerResponse.ok) {
        const errorText = await headerResponse.text();
        console.error('❌ Error creating headers:', headerResponse.status, errorText);
      } else {
        console.log('✅ Headers created successfully');
      }
    } else {
      console.log('✅ Headers already exist');
    }
    
    // Add form data in the same order as questions
    console.log('💾 Adding form data to sheet...');
    const rowData = [
      new Date().toISOString(),
      ...questions.map((q: any) => {
        const value = formData[q.questionId];
        if (Array.isArray(value)) {
          return value.join(', ');
        }
        return value || '';
      })
    ];
    
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values: [rowData] })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Google Sheets API error:', response.status, errorText);
      throw new Error(`Failed to submit to Google Sheets: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Form data added successfully:', responseData);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('💥 Complete error details:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit form' }, { status: 500 });
  }
}