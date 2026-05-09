import fetch from 'node-fetch';

async function test() {
  const targetUrl = 'https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json';
  const fetchUrl = `${targetUrl}?ts=${Date.now()}`;
  
  try {
    const response = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log('Status:', response.status);
    const data = await response.json();
    console.log('Data sample:', JSON.stringify(data).slice(0, 500));
  } catch (e) {
    console.error('Test failed:', e);
  }
}

test();
