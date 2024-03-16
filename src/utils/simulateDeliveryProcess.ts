import DeliveryTracking from '../models/DeliveryTracking';
import Order from '../models/Order';


interface Location {
  description: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const simulateDeliveryProcess = async (orderId: string): Promise<void> => {
  // Simulação da criação do registro de entrega com a localização inicial
  const deliveryTracking =  new DeliveryTracking({
    orderId: orderId,
    status: 'preparing_for_shipment',
    locations: [{
      description: 'Pedido recebido',
      city: 'São Paulo',
      state: 'SP',
      postalCode: '00000-000',
      country: 'Brasil',
    }],
  });
  await deliveryTracking.save();

  const locations: Location[] = [
    { description: 'Em trânsito - Deixou o centro de distribuição', city: 'São Paulo', state: 'SP', postalCode: '11111-111', country: 'Brasil' },
    { description: 'Em trânsito - Chegou no centro de distribuição regional', city: 'Salvador', state: 'Bahia', postalCode: '22222-222', country: 'Brasil' },
    { description: 'Em trânsito - Deixou o centro de distribuição regional', city: 'Salvador', state: 'Bahia', postalCode: '22222-222', country: 'Brasil' },
    { description: 'Em trânsito - Chegou ao centro de distribuição local', city: 'Guanambi', state: 'Bahia', postalCode: '33333-333', country: 'Brasil' },
    { description: 'Em trânsito - Saiu para entrega', city: 'Guanambi', state: 'Bahia', postalCode: '33333-333', country: 'Brasil' },
  ];

  const timeIntervals = [60000, 60000, 60000, 60000, 60000];

  locations.forEach((location, index) => {
    setTimeout(async () => {      
      if (index === locations.length - 1) {
          await updateDeliveryTracking(orderId, 'delivered', []);
          endOrder(orderId)  
      } else await updateDeliveryTracking(orderId, 'in_transit', [location]);
    }, timeIntervals[index]);
  });
};

const updateDeliveryTracking = async (orderId, status, location) => {
  try {
    const deliveryTracking = await DeliveryTracking.findOne({ orderId: orderId});
    if (!deliveryTracking) {
      throw Error('Delivery tracking not found.');
    }
    deliveryTracking.locations.push(location)
    deliveryTracking.status = status;
    await deliveryTracking.save();
  } catch (error) {
    throw Error('Error to add new location');
  }
}

const endOrder = async (orderId) => {
  const order = await Order.find(orderId)
  if (!order) {
    throw Error('Order not found.');
  }

  order.status = 'completed'
  await order.save()
}



