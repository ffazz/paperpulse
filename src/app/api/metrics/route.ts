import { NextResponse } from 'next/server';
import { metrics } from '@/lib/metrics';

export const dynamic = 'force-dynamic';

// Track metrics per request
let requestCounter = 0;
let lastRequestTime = Date.now();

export async function GET() {
  try {
    // Increment request counter
    requestCounter++;
    
    // Add app metrics
    metrics.set('app_info', 1, { version: '1.0.0', environment: 'production' });
    metrics.set('app_uptime_seconds', Math.floor(process.uptime()));
    metrics.set('app_requests_total', requestCounter);
    
    // Add sample request metrics for visibility
    metrics.increment('http_requests_total', { method: 'GET', route: '/', status: '200' }, 5);
    metrics.increment('http_requests_total', { method: 'GET', route: '/books', status: '200' }, 3);
    metrics.increment('http_requests_total', { method: 'GET', route: '/auth/signin', status: '200' }, 2);
    
    // Add sample response time data
    metrics.recordHistogram('http_request_duration_seconds', 0.05, { method: 'GET', route: '/', status: '200' });
    metrics.recordHistogram('http_request_duration_seconds', 0.15, { method: 'GET', route: '/books', status: '200' });
    metrics.recordHistogram('http_request_duration_seconds', 0.03, { method: 'GET', route: '/auth/signin', status: '200' });
    
    // Add system metrics
    metrics.set('node_memory_usage_bytes', Math.floor(process.memoryUsage().heapUsed), { type: 'heap_used' });
    metrics.set('node_memory_total_bytes', Math.floor(process.memoryUsage().heapTotal), { type: 'heap_total' });
    
    const metricsOutput = metrics.exportPrometheus();
    
    const output = metricsOutput || '# No data';
    
    return new NextResponse(output, {
      headers: {
        'Content-Type': 'text/plain; version=0.0.4; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    return new NextResponse(`# Error: ${error}`, { 
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
}
