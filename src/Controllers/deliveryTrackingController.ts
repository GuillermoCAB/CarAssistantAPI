import { Request, Response } from 'express';
import DeliveryTracking from '../models/DeliveryTracking';


export const createDeliveryTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderId, status, location } = req.body;
    const deliveryTracking = new DeliveryTracking({
      orderId,
      status,
      locations: [location], 
    });
    await deliveryTracking.save();
    res.status(201).send(deliveryTracking);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const addLocationToDeliveryTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryTracking = await DeliveryTracking.findOne({ orderId: req.params.orderId });
    if (!deliveryTracking) {
      return res.status(404).send('Delivery tracking not found.');
    }
    deliveryTracking.locations.push(req.body.location);
    await deliveryTracking.save();
    res.send(deliveryTracking);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateDeliveryTrackingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryTracking = await DeliveryTracking.findOne({ orderId: req.params.orderId });
    if (!deliveryTracking) {
      return res.status(404).send('Delivery tracking not found.');
    }
    deliveryTracking.status = req.body.status;
    await deliveryTracking.save();
    res.send(deliveryTracking);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const updateDeliveryTracking = async (req: Request, res: Response): Promise<void> => {
  try {
    const deliveryTracking = await DeliveryTracking.findOne({ orderId: req.params.orderId });
    if (!deliveryTracking) {
      return res.status(404).send();
    }

    if (req.body.status) {
      deliveryTracking.status = req.body.status;
    }

    if (req.body.locations && req.body.locations.length) {
      deliveryTracking.locations.push(...req.body.locations);
    }

    await deliveryTracking.save();
    res.send(deliveryTracking);
  } catch (error) {
    res.status(400).send(error);
  }
};
