/**
 * @NApiversion 2.0
 * @NscriptType UserEventScript 
 */

define (['N/record' , 'N/log'] , function (record,log){

    function beforeLoad(context){
        try {
            var form = context.form 
            form.addButton({
                id: 'custpage_addwarehouseburden_button',
                label: 'Add Warehouse Burden',
                functionName: 'addwarehouseburden'
            })
            form.clientScriptModulePath = "SuiteScripts/TPC/ClientScripts/SC_TPC_addwarehouseburden_CS.js"
        }
        catch(error) {
            log.error(error.title,error.message)
        }

    }

    function afterSubmit(context) {
        try {
            if (context.type === context.UserEventType.CREATE) {
                var newRecord = context.newRecord;
                var itemReceiptId = newRecord.id;
                
                log.debug("AfterSubmit Function , new Record Id: ",itemReceiptId)

                // Load the saved record
                var itemReceiptRecord = record.load({
                    type: newRecord.type,
                    id: itemReceiptId,
                    isDynamic: true
                });

                var lineCount = itemReceiptRecord.getLineCount({ sublistId: 'item' });
                for (var i = 0; i < lineCount; i++) {
                    // Select the line dynamically
                    itemReceiptRecord.selectLine({
                        sublistId: 'item',
                        line: i
                    });

                    var quantity = itemReceiptRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity'
                    });

                    var warehouseBurdenAmount = itemReceiptRecord.getCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_cp_item_burden_amt'
                    });

                    // Checking if the item supports landed cost or not
                    var isLandedCostApplicable = itemReceiptRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'tracklandedcost' 
                    });

                    

                    // This line shall skip the item if it doesnt have landed cost subrecord button available on Item Sublist!
                    if (isLandedCostApplicable !== 'T') {
                    log.debug("Landed cost not applicable for line: " , i);
                    continue; // Skip to the next line if landed cost is not supported
                    }



                    var landedCostSubrecord = itemReceiptRecord.getCurrentSublistSubrecord({
                        sublistId: 'item',
                        fieldId: 'landedcost'
                    });

                    log.debug("Dynamic Mode landed cost subrecord: ",landedCostSubrecord)

                    if (landedCostSubrecord) {
                        // Update sublist values dynamically
                        landedCostSubrecord.setCurrentSublistValue({
                            sublistId: 'landedcostdata',
                            fieldId: 'amount',
                            value: warehouseBurdenAmount * quantity,
                            line: 0
                        });
                        
                        var internalIdForCostCategory = 7;
                        landedCostSubrecord.setCurrentSublistValue({
                            sublistId: 'landedcostdata',
                            fieldId: 'costcategory',
                            value: internalIdForCostCategory,
                            line: 0
                        });

                        log.debug("Updated Total for line " + i, warehouseBurdenAmount * quantity);
                        log.debug("Updated Cost Category for line " + i, internalIdForCostCategory);
                        log.debug("After Update Dynamic Mode landed cost subrecord for line: " + i,landedCostSubrecord)

                        // Commit the line change in dynamic mode

                        landedCostSubrecord.commitLine({ sublistId: 'landedcostdata' });

                        
                    }
                    itemReceiptRecord.commitLine({
                        sublistId: 'item'
                    });
                    
                }

                // Save the updated item receipt record
                itemReceiptRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });

                log.debug("Item Receipt Record updated and saved.");
            }



        } catch (error) {
            log.error("Error in afterSubmit function: ", error.message);
        }
    }

    return {
        beforeLoad : beforeLoad,
        afterSubmit : afterSubmit
    }

})
