using supershiping from '../db/schema';

service ShipmentService {
    entity ShipmentDetails as projection on supershiping.ShipmentDetails;
}
