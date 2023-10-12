fetch('http://localhost:5001/api/v1/orders/get/guest')
  .then((response) => response.json())
  .then((data) => console.log(data));
