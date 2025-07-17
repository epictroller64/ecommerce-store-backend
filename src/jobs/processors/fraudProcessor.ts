import { FraudValidationJob } from "../../types";
import { orderService } from '../../services';

export async function validateOrder(job: FraudValidationJob) {
    const { orderId } = job;
    console.log(`Validating order ${orderId}`);

    // TODO: Implement fraud validation logic
    // use IP, address, etc to validate
    // we dont have the advanced algorithm and data anyways, fake it
    // for now just sleep for 10 seconds
    await new Promise(resolve => setTimeout(resolve, 10000));

    await orderService.markOrderStatus(orderId, 'paid');
}