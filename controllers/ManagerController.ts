import { Request, Response, NextFunction } from "express";
import { EditManagerInputs, ManagerLoginInput } from "../dto";
import { CreateProductInput } from "../dto/Product.dto";
import { Order, Product } from "../models";
import { GenerateSignature, ValidatePassword } from "../utility";
import { FindManager } from "./AdminController";

export const ManagerLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = <ManagerLoginInput>req.body;

  const existingManager = await FindManager("", email);

  if (existingManager !== null) {
    // Validation and giving access

    const validation = await ValidatePassword(
      password,
      existingManager.password,
      existingManager.salt
    );

    if (validation) {
      const signature = await GenerateSignature({
        _id: existingManager._id,
        email: existingManager.email,
        name: existingManager.name,
      });

      return res.json(signature);
    } else {
      return res.json({ message: "Password is wrong" });
    }
  }

  return res.json({ message: "Email or password is incorrect" });
};

export const GetManagerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const existingManager = await FindManager(user._id);

    return res.json(existingManager);
  }

  return res.json({ message: "Manager information not found" });
};

export const UpdateManagerProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, email } = <EditManagerInputs>req.body;

  const user = req.user;

  if (user) {
    const existingManager = await FindManager(user._id);

    if (existingManager !== null) {
      existingManager.name = name;
      existingManager.phone = phone;
      existingManager.email = email;

      const saveResult = await existingManager.save();

      return res.json(saveResult);
    }

    return res.json({ message: "Manager does not exist" });
  }

  return res.json({ message: "Manager information not found" });
};

export const AddProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const { name, description, category, productType, mrp, price, images } = <
      CreateProductInput
    >req.body;

    const manager = await FindManager(user._id);

    if (manager !== null) {
      const createProduct = await Product.create({
        name: name,
        description: description,
        category: category,
        productType: productType,
        mrp: mrp,
        price: price,
        images: images,
      });

      console.log();
      return res.json(createProduct);
    }

    return res.json({ message: "Manager not found" });
  }

  return res.json({ message: "Something went wrong" });
};

export const GetProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const Products = await Product.find();

    if (Products !== null) {
      return res.json(Products);
    }
  }

  return res.json({ message: "No product found" });
};

export const GetCurrentOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;

  if (user) {
    const orders = await Order.find().populate("items.product");

    if (orders != null) {
      return res.status(200).json(orders);
    }
  }

  return res.json({ message: "Orders not found!" });
};

export const GetOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.product");

    if (order != null) {
      return res.status(200).json(order);
    }
  }

  return res.json({ message: "Order not found!" });
};

export const ProcessOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const orderId = req.params.id;

  const { status, remarks, readyTime } = req.body; // ACCEPT // REJECT // UNDER-PROCESS // READY

  if (orderId) {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.orderStatus = status;
    order.remarks = remarks;
    console.log(readyTime, remarks)
    if (readyTime) {
      order.readyTime = readyTime;
    }

    const orderResult = await order.save();

    return res.status(200).json(orderResult);
  }

  return res.json({ message: "Unable to process the order!" });
};