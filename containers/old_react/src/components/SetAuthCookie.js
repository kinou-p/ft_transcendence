import React, { useEffect } from 'react';
import axios from 'axios';

function MyComponent() {
  useEffect(() => {
    const api = axios.create({
      baseURL: 'https://api.example.com',
      withCredentials: true, // this is required to send cookies
      headers: {
        'X-Custom-Header': 'foobar', // you can also set other default headers
      },
    });

    const response = api.get('/some-endpoint').then((response) => {
      console.log(response.data);
	  response.data.username
    });
  }, []);

  return <div>My Component</div>;
}

export default MyComponent;