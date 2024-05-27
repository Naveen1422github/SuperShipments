sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function(Controller, MessageToast) {
    "use strict";

    return Controller.extend("supershiping.supershiping.controller.shippingDetails", {
        onNextPress: function() {
            var oView = this.getView();
            var oWeightInput = oView.byId("weightInput");
            var oWeightSelection = oView.byId("weightSelection");

            if (!oWeightInput || !oWeightSelection) {
                MessageToast.show("Error: Could not find required elements.");
                return;
            }

            var sWeightInput = oWeightInput.getValue();
            var sSelectedWeightRange = oWeightSelection.getSelectedKey();

            if (!this._isWeightValid(sWeightInput, sSelectedWeightRange)) {
                MessageToast.show("Invalid weight. Please enter a value within the selected range.");
                return;
            }

            var oModel = this.getOwnerComponent().getModel("homeData");
            if (!oModel) {
                MessageToast.show("Error: Could not access home data.");
                return;
            }

            var oHomeData = oModel.getData();

            var oData = {
                fromPincode: oHomeData.fromPincode,
                fromPostOffice: oHomeData.fromPostOffice,
                fromAddress: oHomeData.fromAddress,
                fromDistrict: oHomeData.fromDistrict,
                fromState: oHomeData.fromState,
                toPincode: oHomeData.toPincode,
                toPostOffice: oHomeData.toPostOffice,
                toAddress: oHomeData.toAddress,
                toDistrict: oHomeData.toDistrict,
                toState: oHomeData.toState,
                category: oView.byId("categorySelection").getSelectedButton().getText(),
                packing: oView.byId("packingSelection").getSelectedButton().getText(),
                weightRange: sSelectedWeightRange,
                length: oView.byId("lengthInput").getValue(),
                breadth: oView.byId("breadthInput").getValue(),
                height: oView.byId("heightInput").getValue(),
                weight: sWeightInput
            };

            this.onSubmit(oData);
        },

        onSubmit: async function() {
            var oModel = this.getOwnerComponent().getModel(); // Get the OData model
            var oView = this.getView();
        
            // Get the data from the view - From Details
            var sFromPincode = oView.byId("fromPincode").getValue();
            var sFromPostOffice = oView.byId("fromPostOffice").getValue();
            var sFromAddress = oView.byId("fromAddress").getValue();
            var sFromDistrict = oView.byId("fromDistrict").getValue();
            var sFromState = oView.byId("fromState").getValue();
        
            // Get the data from the view - To Details
            var sToPincode = oView.byId("toPincode").getValue();
            var sToPostOffice = oView.byId("toPostOffice").getValue();
            var sToAddress = oView.byId("toAddress").getValue();
            var sToDistrict = oView.byId("toDistrict").getValue();
            var sToState = oView.byId("toState").getValue();
        
            // Get the data from the view - Shipping Details
            var sSelectedCategory = oView.byId("categorySelection").getSelectedButton().getText();
            var sSelectedPacking = oView.byId("packingSelection").getSelectedButton().getText();
            var sSelectedWeightRange = oView.byId("weightSelection").getSelectedKey();
            var sLength = oView.byId("lengthInput").getValue();
            var sBreadth = oView.byId("breadthInput").getValue();
            var sHeight = oView.byId("heightInput").getValue();
            var sWeight = oView.byId("weightInput").getValue();
        
            // Create a new entry object
            var oEntry = {
                fromPincode: sFromPincode,
                fromPostOffice: sFromPostOffice,
                fromAddress: sFromAddress,
                fromDistrict: sFromDistrict,
                fromState: sFromState,
                toPincode: sToPincode,
                toPostOffice: sToPostOffice,
                toAddress: sToAddress,
                toDistrict: sToDistrict,
                toState: sToState,
                category: sSelectedCategory,
                packing: sSelectedPacking,
                weightRange: sSelectedWeightRange,
                length: sLength,
                breadth: sBreadth,
                height: sHeight,
                weight: sWeight
                // Add other fields here as needed
            };
        
            try {
                // Create an array to hold the batch requests
                var aBatchRequests = [];
        
                // Push a POST request for each entry in the data
                aBatchRequests.push(oModel.createEntry("/ShipmentDetails", {
                    properties: oEntry
                }));
        
                // Submit the batch requests
                await Promise.all(aBatchRequests.map(request => {
                    return new Promise((resolve, reject) => {
                        oModel.submitChanges({
                            success: resolve,
                            error: reject,
                            batchGroupId: "batchGroupId"
                        });
                    });
                }));
        
                sap.m.MessageToast.show("Data saved successfully.");
            } catch (error) {
                sap.m.MessageToast.show("Failed to save data: " + error.message);
            }
        }
    
        ,
        

        _isWeightValid: function(weightInput, weightRange) {
            var fWeightInput = parseFloat(weightInput);
            if (isNaN(fWeightInput)) {
                return false;
            }

            var aWeightRanges = {
                "1-500g": [0, 0.5],
                "500g-2kg": [0.5, 2],
                "2kg-5kg": [2, 5],
                "5kg-50kg": [5, 50]
            };

            var aSelectedRange = aWeightRanges[weightRange];
            if (!aSelectedRange) {
                return false;
            }

            return fWeightInput >= aSelectedRange[0] && fWeightInput <= aSelectedRange[1];
        }
    });
});
