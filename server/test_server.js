const http = require('http');

http.get('http://localhost:5000/api/health', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('HEALTH CHECK:', data);
    process.exit(0);
  });
}).on('error', (err) => {
  console.error('ERROR REACHING SERVER:', err.message);
  process.exit(1);
});
