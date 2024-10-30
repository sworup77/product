import "reflect-metadata";
import express, { Request, Response, Router } from "express";
import { DataSource } from "typeorm";
import { User } from "./user";

const app = express();
const router = Router();
const port = 3000;

app.use(express.json());

interface Product {
    productName: string;
    weight: number;
    quantity: number;
    price: number;
}

let cart: Product[] = [];

const createPackages = (cart: Product[]): Product[][] => {
    const packages: Product[][] = [];
    let currentPackage: Product[] = [];
    let currentWeight = 0;

    cart.forEach((product) => {
        const productWeight = product.weight * product.quantity;

        if (currentWeight + productWeight <= 100000) {
            currentPackage.push(product);
            currentWeight += productWeight;
        } else {
            packages.push(currentPackage);
            currentPackage = [product];
            currentWeight = productWeight;
        }
    });

    if (currentPackage.length) {
        packages.push(currentPackage);
    }

    return packages;
};

router.post("/add-to-cart", (req: Request, res: Response) => {
    const { productName, weight, quantity, price } = req.body as Product;

    if (!productName || !weight || !quantity || !price) {
        return res.status(400).json({ message: "Missing product details" });
    }

    cart.push({ productName, weight, quantity, price });
    return res.status(200).json({ message: "Product added to cart", cart });
});

router.get("/cart", (req: Request, res: Response) => {
    return res.status(200).json(cart);
});

router.get("/create-packages", (req: Request, res: Response) => {
    const packages = createPackages(cart);
    return res.status(200).json({ message: "Packages created", packages });
});

router.post("/clear-cart", (req: Request, res: Response) => {
    cart = [];
    return res.status(200).json({ message: "Cart cleared" });
});

app.use("/cart", router);

const appDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "hello",
    database: "typeorm_db",
    entities: [User],
    synchronize: true,
    logging: true,
});

appDataSource
    .initialize()
    .then(() => {
        console.log("Database connected successfully");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("Error connecting to the database:", err);
    });
