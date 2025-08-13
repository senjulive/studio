import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    console.log('🔄 Starting market data update cron job...');
    
    // Fetch latest market data from CoinCap API
    const marketData = await fetchMarketData();
    
    // Update cache or database with new data
    await updateMarketCache(marketData);
    
    console.log('✅ Market data update completed');
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      updatedAssets: marketData.length,
      message: 'Market data updated successfully',
    });
    
  } catch (error) {
    console.error('❌ Market data update failed:', error);
    
    return NextResponse.json({
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

async function fetchMarketData() {
  const response = await fetch('https://api.coincap.io/v2/assets?limit=100', {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'AstralCore/1.0',
    },
  });
  
  if (!response.ok) {
    throw new Error(`Market data API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

async function updateMarketCache(marketData: any[]) {
  // In a real implementation, this would update Redis cache or database
  // For now, we'll just simulate the update
  
  console.log(`Updating cache with ${marketData.length} assets`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Log some sample data for verification
  if (marketData.length > 0) {
    const bitcoin = marketData.find(asset => asset.symbol === 'BTC');
    if (bitcoin) {
      console.log(`BTC Price: $${parseFloat(bitcoin.priceUsd).toFixed(2)}`);
    }
  }
}
