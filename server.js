const express = require('express');
const da = require("./data-access");
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers", async (req, res) => {
    const cust = await da.getCustomers();
    res.send(cust);
   });