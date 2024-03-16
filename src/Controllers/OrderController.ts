import { Request, Response } from 'express';
import Order from '../models/Order'; 
import { simulateDeliveryProcess } from '../utils/simulateDeliveryProcess';

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = new Order({
      ...req.body,
      customerId: req.params.userId,
    });
    await order.save();
    simulateDeliveryProcess(order.id)
    res.status(201).send(
      `Seu pedido foi concluido com sucesso, iniciamos uma simulação do processo para que possa acompanhar sua entrega
      (a cada 1 minuto ela está em um novo destino mais próximo de você), solicitar troca, cancelar o pedido dependendo do local ou mesmo solicitar sua nota fiscal')`;
  } catch (error) {
    res.status(400).send(error);
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send();
    }
    order.status = req.body.status;
    await order.save();
    res.send(order);
  } catch (error) {
    res.status(400).send(error);
  }
};
