sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageToast, History) {
    "use strict";
    return Controller.extend("supershiping.supershiping.controller.home", {
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel();
            oModel.loadData("data/data.json");
            console.log("json data  ", oModel.getData());
            oModel.attachRequestCompleted(function () {
                this.getView().setModel(oModel, "postOffices");
                this._loadSavedValues();
            }.bind(this));
        },
        onSave: function () {
            var sFromPincode = this.getView().byId("fromPincode").getValue();
            var sFromPostOffice = this.getView().byId("fromPostOffice").getValue();
            var sToPincode = this.getView().byId("toPincode").getValue();
            var sToPostOffice = this.getView().byId("toPostOffice").getValue();
            var sFromAddress = this.getView().byId("fromAddress").getValue();
            var sFromDistrict = this.getView().byId("fromDistrict").getValue();
            var sFromState = this.getView().byId("fromState").getValue();
            var sToAddress = this.getView().byId("toAddress").getValue();
            var sToDistrict = this.getView().byId("toDistrict").getValue();
            var sToState = this.getView().byId("toState").getValue();

            var oHomeData = {
                fromPincode: sFromPincode,
                fromPostOffice: sFromPostOffice,
                fromAddress: sFromAddress,
                fromDistrict: sFromDistrict,
                fromState: sFromState,
                toPincode: sToPincode,
                toPostOffice: sToPostOffice,
                toAddress: sToAddress,
                toDistrict: sToDistrict,
                toState: sToState
            };

            // Save data to a model
            var oModel = new JSONModel(oHomeData);
            this.getOwnerComponent().setModel(oModel, "homeData");

            // Navigate to the next view
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteshippingDetails");
        },
        onFromPincodeChange: function (oEvent) {
            var sPincode = oEvent.getParameter("value");
            this._saveToLocalStorage("fromPincode", sPincode);

            var oModel = this.getView().getModel("postOffices");
            if (oModel) {
                var aFilteredPostOffices = this._getPostOfficesByPincode(sPincode, oModel);
                console.log("filtered Post Offices:", aFilteredPostOffices);

                var oFromPostOfficeComboBox = this.getView().byId("fromPostOffice");
                var oFilteredModel = new JSONModel({ PostOffices: aFilteredPostOffices });
                oFromPostOfficeComboBox.setModel(oFilteredModel, "filteredPostOffices");
                oFromPostOfficeComboBox.bindItems({
                    path: 'filteredPostOffices>/PostOffices',
                    template: new sap.ui.core.Item({
                        key: "{filteredPostOffices>PostOfficeName}",
                        text: "{filteredPostOffices>PostOfficeName}"
                    })
                });

                if (aFilteredPostOffices.length > 0) {
                    var oFirstPostOffice = aFilteredPostOffices[0];
                    this.getView().byId("fromDistrict").setValue(oFirstPostOffice.District);
                    this.getView().byId("fromState").setValue(oFirstPostOffice.State);
                } else {
                    this.getView().byId("fromDistrict").setValue("");
                    this.getView().byId("fromState").setValue("");
                }
            }
        },

        onToPincodeChange: function (oEvent) {
            var sPincode = oEvent.getParameter("value");
            this._saveToLocalStorage("toPincode", sPincode);

            var oModel = this.getView().getModel("postOffices");
            if (oModel) {
                var aFilteredPostOffices = this._getPostOfficesByPincode(sPincode, oModel);
                var oToPostOfficeComboBox = this.getView().byId("toPostOffice");
                var oFilteredModel = new JSONModel({ PostOffices: aFilteredPostOffices });
                oToPostOfficeComboBox.setModel(oFilteredModel, "filteredPostOffices");
                oToPostOfficeComboBox.bindItems({
                    path: 'filteredPostOffices>/PostOffices',
                    template: new sap.ui.core.Item({
                        key: "{filteredPostOffices>PostOfficeName}",
                        text: "{filteredPostOffices>PostOfficeName}"
                    })
                });

                if (aFilteredPostOffices.length > 0) {
                    var oFirstPostOffice = aFilteredPostOffices[0];
                    this.getView().byId("toDistrict").setValue(oFirstPostOffice.District);
                    this.getView().byId("toState").setValue(oFirstPostOffice.State);
                } else {
                    this.getView().byId("toDistrict").setValue("");
                    this.getView().byId("toState").setValue("");
                }
            }
        },

        onFromPostOfficeChange: function (oEvent) {
            var sPostOffice = oEvent.getParameter("value");
            this._saveToLocalStorage("fromPostOffice", sPostOffice);

            var sPincode = this.getView().byId("fromPincode").getValue();
            var oModel = this.getView().getModel("postOffices");
            var aFilteredPostOffices = this._getPostOfficesByPincode(sPincode, oModel);

            var bValid = aFilteredPostOffices.some(function (item) {
                return item.PostOfficeName === sPostOffice;
            });

            var oFromPostOfficeInput = this.getView().byId("fromPostOffice");
            if (!bValid) {
                oFromPostOfficeInput.addStyleClass("inputError");
                oFromPostOfficeInput.setValue(""); // Clear the input
                this._removeFromLocalStorage("fromPostOffice"); // Remove from local storage
                MessageToast.show("The entered Post Office and Pincode do not match. Please change the Pincode or the Post Office.", {
                    duration: 6000,
                    my: "center center",
                    at: "center center"

                });
                setTimeout(() => {

                    oFromPostOfficeInput.removeStyleClass("inputError");
                }, 400);
            } else {
                oFromPostOfficeInput.removeStyleClass("inputError");
            }
        },

        onToPostOfficeChange: function (oEvent) {
            var sPostOffice = oEvent.getParameter("value");
            this._saveToLocalStorage("toPostOffice", sPostOffice);

            var sPincode = this.getView().byId("toPincode").getValue();
            var oModel = this.getView().getModel("postOffices");
            var aFilteredPostOffices = this._getPostOfficesByPincode(sPincode, oModel);

            var bValid = aFilteredPostOffices.some(function (item) {
                return item.PostOfficeName === sPostOffice;
            });

            var oToPostOfficeInput = this.getView().byId("toPostOffice");
            if (!bValid) {
                oToPostOfficeInput.addStyleClass("inputError");
                oToPostOfficeInput.setValue(""); // Clear the input
                this._removeFromLocalStorage("toPostOffice"); // Remove from local storage
                MessageToast.show("The entered Post Office and Pincode do not match. Please change the Pincode or the Post Office.", {
                    duration: 6000,
                    my: "center center",
                    at: "center center"
                });
                setTimeout(() => {

                    oToPostOfficeInput.removeStyleClass("inputError");
                }, 400);
            } else {
                oToPostOfficeInput.removeStyleClass("inputError");
            }
        },

        _getPostOfficesByPincode: function (sPincode, oModel) {
            console.log("_getPostOfficesByPincode called");
            console.log("Pincode:", sPincode);
            var aData = oModel.getProperty("/Sheet1");

            return aData.filter(function (item) {
                return item.Pincode === sPincode;
            });
        },

        _saveToLocalStorage: function (sKey, sValue) {
            localStorage.setItem(sKey, sValue);
        },

        _removeFromLocalStorage: function (sKey) {
            localStorage.removeItem(sKey);
        },

        _loadSavedValues: function () {
            var sFromPincode = localStorage.getItem("fromPincode");
            var sFromPostOffice = localStorage.getItem("fromPostOffice");
            var sToPincode = localStorage.getItem("toPincode");
            var sToPostOffice = localStorage.getItem("toPostOffice");

            if (sFromPincode) {
                this.getView().byId("fromPincode").setValue(sFromPincode);
                this.onFromPincodeChange({ getParameter: () => sFromPincode });
            }
            if (sFromPostOffice) {
                this.getView().byId("fromPostOffice").setValue(sFromPostOffice);
            }
            if (sToPincode) {
                this.getView().byId("toPincode").setValue(sToPincode);
                this.onToPincodeChange({ getParameter: () => sToPincode });
            }
            if (sToPostOffice) {
                this.getView().byId("toPostOffice").setValue(sToPostOffice);
            }
        }

    });
});
