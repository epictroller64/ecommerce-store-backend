import { OrderService } from "../../services/order.service";
import { FraudValidationJob } from "../../types";

export async function validateOrder(job: FraudValidationJob) {
    const { orderId } = job
    console.log(`Validating order ${orderId}`);
    // TODO: Implement fraud validation logic
    // use IP, address, etc to validate
    // we dont have the advanced algortihtm and data anyways, fake it
    // for now just sleep for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));
    const orderService = new OrderService();
    await orderService.markOrderStatus(orderId, 'paid');
}