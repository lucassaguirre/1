import  express  from 'express';
import { dirname } from 'path';
const app = express();
const pathFile = './Productos.json';
const productManager = new ProductManager(pathFile);
import _, { productList, ProductManager } from './ProductManagerrrr.js';
const port = 8088;
app.get('/products',async (req,res)=>{
     
    try {
        const products = await productManager.getProducts();
        const limit = Number(req.query.limit) || products.length;
        const productList = products.slice(0,limit);
        return res.status(200).send(productList);

    } catch (error) {
        res.send({status:"error", error:error.message});
    }
        
});
app.get('/products/:id',async (req, res) => {
    const id = req.params.id;
    const products = await productManager.getProducts();
    const producto = products.find(p => p.id === parseInt(id));
    if (!producto) {
      return res.status(404).send('Producto no encontrado');
    }
    res.send(producto);
  });
app.listen(port, () => {
    console.log('Servidor en el puerto  8088');
});
