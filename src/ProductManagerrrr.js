import * as fs from 'fs';

export class ProductManager{
    #autoID;
    #path;

    constructor(pathFile){
            this.#path = pathFile;
            this.#autoID = 1;
    } 



    async _loadData(){
        try {
            const productsFile = await fs.promises.readFile(this.#path,"utf-8");
            const products = JSON.parse(productsFile);
            if(products.length === 0){
                return [];
            }
            return products; 
        } catch (error) {
            console.log("El archivo no existe");
            console.log(`creando ${this.#path} ...`);
            await fs.promises.writeFile(this.#path,JSON.stringify([]),"utf-8");
            return [];
        }
    }
    async addProduct(product){
        try {
            const {title,description,price,thumbnail,code,stock} = product;
            if(title === undefined || description === undefined || price === undefined || thumbnail === undefined || code=== undefined || stock=== undefined){ //operadores en cortocircuito (||)porque si no se cumple la condición de un término no se evalúa el resto de la operación.
                throw new Error("Todos los campos deben ser completados");
            }
            if(!title || !description || !price || !thumbnail || !code ){
                throw new Error("Error, Todos los campos deben ser completados");
            }
            const productsFile = await this._loadData();
            if(productsFile.length !== 0){
                const productExist = productsFile.find(element=> element.code === product.code);
                if(productExist){
                    throw new Error("Error, Ya existe un producto con el mismo codigo");
                }
                this.#autoID = productsFile[productsFile.length-1].id + 1;
            }
            productsFile.push({...product, id:this.#autoID});
            await fs.promises.writeFile(this.#path,JSON.stringify(productsFile,null,2),"utf-8");
            return "Producto agregado con éxito!";
        } catch (error) {
            return error.message;
        }

    }
    async getProducts(){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                return [];
            }
            return productsFile;    
        } catch (error) {
           return error.message;
           
        }
        }

    async getProductById(productId){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                return "La lista esta vacía";
            }
            const product = productsFile.find(element => element.id === productId);
            if(!product){
                throw new Error(`El producto con id ${productId} no existe`);
            }
            return product;
        } catch (error) {
            return `Error: ${error.message}`;
        }

    }

    async update(productId,product){
        try {
            const productsFile = await this._loadData();
            if(productsFile.length === 0){
                throw new Error("La lista esta vacía")
            }
            const exist = productsFile.find(element => element.id === productId);
            if(!exist){
                throw new Error(`El producto con id ${productId} no existe`);
            }
            const updatedList = this.#_updateList({...exist,...product},productsFile);
            await fs.promises.writeFile(this.#path,JSON.stringify(updatedList,null,2),"utf-8");
            return "Productos actualizados con éxito";
        } catch (error) {
            return error.message;
        }
    }
    async delete(productId){         
            try {
                const productsFile = await this._loadData();
                if(productsFile.length === 0){
                    throw new Error("La lista esta vacía")
                }
                const newProducts  = productsFile.filter(element => element.id !== productId);
                await fs.promises.writeFile(this.#path,JSON.stringify(newProducts,null,2),"utf-8");
                return "Elemento eliminado!"
            } catch (error) {
                return error.message;
            }
    }

    #_updateList(product,productlist){
        const index = productlist.findIndex(element => element.id === product.id);
        if(index === -1){
           throw new Error("el producto no se encuentra");
        } 
        productlist.splice(index,1,product);
        return productlist;
    }


}
export const productList=[
    {
        title:"RTX 3060TI",
        description:"Placa de video",
        price:600,
        thumbnail:"con foto",
        code:"abc1",
        stock:5,
    },
    {
        title:"RTX 3090TI",
        description:"Placa de video",
        price:900,
        thumbnail:"sin foto",
        code:"abc2",
        stock:20,
    },
    {
        title:"RTX 4060",
        description:"Placa de video",
        price:950,
        thumbnail:"imgrtx4060",
        code:"abc3",
        stock:15,
    },
    {
        title:"RTX 3070",
        description:"Placa de video",
        price:700,
        thumbnail:"sin foto",
        code:"abc4",
        stock:20,
    },
    {
        title:"GTX 1660s",
        description:"Placa de video",
        price:700,
        thumbnail:"sin foto",
        code:"abc5",
        stock:20,
    },
    {
        title:"GTX 1080",
        description:"Placa de video",
        price:700,
        thumbnail:"sin foto",
        code:"abc6",
        stock:20,
    },
    {
        title:"Logitech G PRO SUPERLIGHT",
        description:"Perifericos",
        price:100,
        thumbnail:"sin foto",
        code:"abc7",
        stock:20,
    },
    {
        title:"Logitech 203",
        description:"Perifericos",
        price:50,
        thumbnail:"sin foto",
        code:"abc8",
        stock:20,
    },
    {
        title:"Logitech 503",
        description:"Perifericos",
        price:50,
        thumbnail:"sin foto",
        code:"abc9",
        stock:20,
    },
    {
        title:"Logitech 900",
        description:"Perifericos",
        price:50,
        thumbnail:"sin foto",
        code:"abc10",
        stock:20,
    },
]
export default ProductManager;
