/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/log', 'N/currentRecord'], function(record, log, currentRecordModule) {

    function addwarehouseburden (context){ 
        saveRecord()
     }

    function saveRecord(context) {
        try {
            var currentRecord = currentRecordModule.get();
            log.debug("Save Record Triggered");

            var landedCostCheckbox = currentRecord.getValue({ fieldId: 'landedcostperline' });
            log.debug("Landed Cost per line Checkbox: ", landedCostCheckbox);
            if (!landedCostCheckbox) {
                currentRecord.setValue({ fieldId: 'landedcostperline', value: true });
                log.debug("Landed Cost per line Checkbox set to true.");
            }

            // Record will be saved, and the afterSubmit User Event will handle the rest
            return true; 
        } catch (error) {
            log.error("updated Error in saveRecord function: ", error.message);
            return false;
        }
    }

    return {
        addwarehouseburden : addwarehouseburden,
        saveRecord: saveRecord
    };
});

    
    
    
    
    
    
    
    
    
    
    
    // /**
    //  * @NapiVersion 2.0
    //  * @NscriptType ClientScript 
    //  */

    // define (["N/record" , 'N/log' ,'N/currentRecord'] , function(record,log,currentRecordModule){

    //     function pageInit(context){
        
    //     }

    //     function addwarehouseburden (context){
    //         try {
    //             console.log(" Add Warehouse Burden Button Clicked! ")
    //         log.debug("Add Warehouse Burden Button Clicked!")
    //         var sublistname = 'item'
                
    //         var currentrecord = currentRecordModule.get();

    //         log.debug("updated Loading record of type: ", currentrecord.type);

    //         // landedcostperline  columnheader_landedcostdata_amount custcol_cp_item_burden_amt
    //         // var itemreceiptId = Number(location.search.match(/id=([^&]+)/)[1])

            
    //         var landedCostcheckbox = currentrecord.getValue({ fieldId: 'landedcostperline'})
    //         log.debug("Landed Cost per line Checkbox : ",landedCostcheckbox)
    //         if (landedCostcheckbox !== true){
    //             currentrecord.setValue({ fieldId: 'landedcostperline' , value: true })
    //         }
    //         var updatedlandedCostcheckbox = currentrecord.getValue({ fieldId: 'landedcostperline'})
    //         log.debug("Landed Cost per line Checkbox after IF statement: ",updatedlandedCostcheckbox)

    //         var linecount = currentrecord.getLineCount({ sublistId : 'item' })
    //         for (var i=0 ;i < linecount;i++){
    //             var quantity = currentrecord.getSublistValue({
    //                 sublistId : sublistname,
    //                 fieldId : 'quantity',
    //                 line: i
    //             })
    //             log.debug("Quantity: " , quantity)

    //             var warehouseburdenamount = currentrecord.getSublistValue({
    //                 sublistId: sublistname,
    //                 fieldId : 'custcol_cp_item_burden_amt',
    //                 line: i
    //             })
    //             log.debug("Sublist Warehouse Burden Amount: " , warehouseburdenamount)

    //              // Attempt to get or initialize the landed cost subrecord
    //              var landedCostSubrecord;
    //              try {
    //                  landedCostSubrecord = currentrecord.getSublistSubrecord({
    //                      sublistId: 'item',
    //                      fieldId: 'landedcost',
    //                      line: i
    //                  });
    //              } catch (error) {
    //                  log.debug("Subrecord not found or initialized for line " + i, error.message);
                     
    //              }



    //             if (landedCostSubrecord) {
    //                 var totalLandedCostAmount = landedCostSubrecord.setValue({
    //                     fieldId: 'total',
    //                     value: warehouseburdenamount * quantity 
    //                 });
    //                 log.debug("updated! Total Landed Cost Amount: ", totalLandedCostAmount);
    //             }

    //         }
            


    //         }
    //         catch(error){
    //             log.error("Error on function addwarehouseburden :" , error.message)
    //         }

    //     }

        
    //     return{
    //         pageInit : pageInit,
    //         addwarehouseburden : addwarehouseburden
    //     }
    // })