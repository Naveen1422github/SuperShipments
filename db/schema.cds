namespace supershiping;

entity ShipmentDetails {
    key trackingNumber : String(20);
    fromPincode        : String(10);
    fromPostOffice     : String(100);
    fromAddress        : String(255);
    fromDistrict       : String(100);
    fromState          : String(100);
    toPincode          : String(10);
    toPostOffice       : String(100);
    toAddress          : String(255);
    toDistrict         : String(100);
    toState            : String(100);
    category           : String(100);
    packing            : String(100);
    weightRange        : String(50);
    length             : Decimal(10, 2);
    breadth            : Decimal(10, 2);
    height             : Decimal(10, 2);
    weight             : Decimal(10, 2);
}
