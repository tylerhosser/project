const express = require('express');
const bodyParser = require('body-parser');
const da = require("./data-access");
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/customers", async (req, res) => {
    const [cust, err] = await da.getCustomers();
    if(cust){
        res.send(cust);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.get("/reset", async (req, res) => {
    const [result, err] = await da.resetCustomers();
    if(result){
        res.send(result);
    }else{
        res.status(500);
        res.send(err);
    }   
});

app.post('/customers', async (req, res) => {
    const newCustomer = req.body;
    if (newCustomer === null) {
        res.status(400);
        res.send("missing request body");
    } else {
        const [status, id, errMessage] = await da.addCustomer(newCustomer);
        if (status === "success") {
            res.status(201);
            let response = { ...newCustomer };
            response["_id"] = id;
            res.send(response);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.get("/customers/:id", async (req, res) => {
    const id = req.params.id;
    const [cust, err] = await da.getCustomerById(id);
    if(cust){
        res.send(cust);
    }else{
        res.status(404);
        res.send(err);
    }   
});

app.put('/customers/:id', async (req, res) => {
    const id = req.params.id;
    const updatedCustomer = req.body;
    if (updatedCustomer === null) {
        res.status(400);
        res.send("missing request body");
    } else {
        delete updatedCustomer._id;
        const [message, errMessage] = await da.updateCustomer(updatedCustomer);
        if (message) {
            res.send(message);
        } else {
            res.status(400);
            res.send(errMessage);
        }
    }
});

app.delete("/customers/:id", async (req, res) => {
    const id = req.params.id;
    const [message, errMessage] = await da.deleteCustomerById(id);
    if (message) {
        res.send(message);
    } else {
        res.status(404);
        res.send(errMessage);
    }
});