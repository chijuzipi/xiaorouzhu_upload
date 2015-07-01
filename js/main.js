Parse.initialize("cMob1z3wF1FNpAWlw4o4vbalOP2EAGEcEzmnK4PI", "3tLjw7zJ9KGPGLCeWKDEZXL3c3xWjp1dh7XWl05j");

$(document).ready(function(){
  var productName; 
  var productPrice;
  var productDesc;
  var productType;
  var dict = {};
  buildDict(dict);


  $("#typeSelect").change(function(){
    productType    = $("#typeSelect option:selected").text();
    var brandArray = dict[productType];
    generateBrand(brandArray);
  });
    

  /* handle save button clicked */
  $( "#save" ).click(function() {
    console.log("upload clicked");
    document.getElementById("save").disabled = true;

    var fileuploadcontrol = $("#imageUpload")[0];
    var L = fileuploadcontrol.files.length;
    var fileToSave = [];
    if(L>0){
      fileToSave = fileuploadcontrol.files;
    }

    else{
      alert("please choose image to upload");
      document.getElementById("save").disabled = false; 
      return;
    }

    productName  = $("#productName").val();
    productPrice = $("#productPrice").val();
    productDesc  = $("#productDesc").val();
    productType  = $("#typeSelect option:selected").text();
    productBrand = $("#brandSelect option:selected").text();
    var fileSavePromises = [];
    
    var i = 0;
    var fileArray = [];

    //save individual files
    _.each(fileToSave, function(file) {
      var parseFile = new Parse.File("photo_" + i + ".jpg", file);
      i++;
      fileArray.push(parseFile);
      fileSavePromises.push(
        parseFile.save().then(function() {
          console.log("single image saved");
        })
      );
    });

    //connect the object with the saved file
    Parse.Promise.when(fileSavePromises).then(function() {
      // all files have saved now, do other stuff here
      console.log("infos saved successfully");
      var product = new Parse.Object("Product")
      product.set("product_name"  , productName);
      product.set("product_price" , productPrice);
      product.set("product_desc"  , productDesc);
      product.set("product_type"  , productType);
      product.set("product_brand" , productBrand);

      for(i=0; i<fileArray.length; i++) {
        product.set("image"+"_"+i, fileArray[i]);
      }
      product.save();
      document.getElementById("save").disabled = false; 
      $( "body" ).append( "<p>upload successfully!</p>" );
    });

  });
  
  function buildDict(dict){
    dict['Handbag']      = ['Coach', 'MK', 'Rebecca_Minkoff', 'Kate_Spade', 'wallet', 'other'];
    dict['Cloth']        = ['Tommy', 'CK', 'A_F', 'Levis', 'US_POLO_ASSN', 'shoe', 'other'];
    dict['Jewel']        = ['Swarovski', 'Juicy_Couture','other'];
    dict['Nutrition']    = ['GNC', 'MoveFree', 'Puritans_Pride','other'];
    dict['Cosmetics']    = ['Lancome', 'Clinique', 'Esteem_Lauder', 'Kiehls','Origins','other'];
    dict['Baby']         = ['baby_healthy', 'baby_feeding', 'baby_daily','other'];
  }

  function generateBrand(brandArray){
    var htmlString = "";
    for(i = 0; i < brandArray.length; i++){
      htmlString += 
        "<option value='" + brandArray[i] +
        "'>" + brandArray[i] + "</option>";
    }

    $('#brandSelect').html(htmlString);
  }

});
