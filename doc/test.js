const axios = require('axios');

const url = 'https://recognition-backend.onrender.com/recognise';
const data = {
  records: [
    'https://uploadthing.com/f/da64d984-c9b1-4bbc-8afb-dad3e3fc5664-f2q4gk.jpg',
    'https://uploadthing.com/f/8d0104a2-3d3b-49cb-acc4-87838e3f2f7d-u7kbiu.jpg',
  ],
  image:
    'https://uploadthing.com/f/6c481778-4088-4c5c-9679-1f51d17748f9-7uz4k4.jpg',
  excemption: [],
};

const options = {
  headers: {
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDA3NDMzODAsInN1YiI6Imd1cnUifQ.diBRasDQC_c9f9Fbu410cQo0saqwZmZ68W6DdTlq4YQ',
  },
};
axios
  .post(url, data, options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
