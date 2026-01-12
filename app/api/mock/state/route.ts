import { NextResponse } from 'next/server';

// Singleton state in the server process
declare global {
  var _MOCK_DB: {
    users: any[];
    otps: Map<string, { code: string; expires: number }>;
  } | undefined;
}

if (!global._MOCK_DB) {
  global._MOCK_DB = {
    users: [
      {
        id: 'U-MOCK-001',
        name: 'Demo Farmer',
        email: 'demo@seedo.ag',
        phone: '+254700000000',
        nationalId: '12345678',
        role: 'FARMER',
        provider: 'custom',
        isComplete: true,
        location: { lat: -1.2921, lng: 36.8219, address: 'Ngong Road, Nairobi' },
        produceType: ['Maize']
      }
    ],
    otps: new Map(),
  };
}

const db = global._MOCK_DB!;

export async function POST(request: Request) {
  const body = await request.json();
  const { action, ...data } = body;

  if (action === 'sendOTP') {
    const { identity } = data;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.otps.set(identity, { 
      code, 
      expires: Date.now() + 5 * 60 * 1000 
    });
    console.log(`[SERVER MOCK DB] OTP for ${identity}: ${code}`);
    return NextResponse.json({ success: true, code }); // Return code for debug
  }

  if (action === 'verifyOTP') {
    const { identity, code } = data;
    const stored = db.otps.get(identity);
    // Don't delete to allow reuse for login
    if (stored && stored.code === code && stored.expires > Date.now()) {
      return NextResponse.json({ valid: true });
    }
    return NextResponse.json({ valid: false });
  }

  if (action === 'register') {
    // Check if user already exists to update instead of push
    const existingIndex = db.users.findIndex(u => u.email === data.user.email);
    if (existingIndex >= 0) {
      db.users[existingIndex] = { ...db.users[existingIndex], ...data.user };
    } else {
      db.users.push(data.user);
    }
    return NextResponse.json({ success: true });
  }

  if (action === 'getUser') {
    const { email, phone } = data;
    const user = db.users.find(u => 
      (email && u.email === email) || 
      (phone && u.phone === phone)
    );
    return NextResponse.json({ user: user || null });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
