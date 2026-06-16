const http = require('http');

http.get('http://localhost:5000/api/bikes/approved?limit=1', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('API Response:', data);
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
