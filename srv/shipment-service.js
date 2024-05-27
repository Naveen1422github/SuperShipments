const cds = require('@sap/cds');

module.exports = cds.service.impl(async function() {
    const { ShipmentDetails } = this.entities;

    this.on('CREATE', 'ShipmentDetails', async (req) => {
        const {
            fromPincode, fromPostOffice, fromAddress, fromDistrict, fromState,
            toPincode, toPostOffice, toAddress, toDistrict, toState,
            category, packing, weightRange, length, breadth, height, weight
        } = req.data;

        const trackingNumber = generateTrackingNumber();

        await INSERT.into(ShipmentDetails).entries({
            trackingNumber,
            fromPincode, fromPostOffice, fromAddress, fromDistrict, fromState,
            toPincode, toPostOffice, toAddress, toDistrict, toState,
            category, packing, weightRange, length, breadth, height, weight
        });

        return { trackingNumber };
    });

    function generateTrackingNumber() {
        return 'TRACK' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    }
});
