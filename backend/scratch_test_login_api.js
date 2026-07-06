import http from "http";

const data = JSON.stringify({
  email: "admin@aarions.com",
  password: "password123"
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/admin/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log("Headers:", JSON.stringify(res.headers, null, 2));

  let body = "";
  res.on("data", (chunk) => {
    body += chunk;
  });

  res.on("end", () => {
    console.log("Response Body:", body);
  });
});

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
