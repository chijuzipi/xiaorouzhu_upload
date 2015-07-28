AV.initialize("81s57z30iss714rpsvmgm3rsuxiha4imqz7adqtozc9iyzhr", "4nrfo1hcwq6omwxa3maod5fmvwoc1gk3ogfh7ro9ookvdexh");
//Parse.initialize("cMob1z3wF1FNpAWlw4o4vbalOP2EAGEcEzmnK4PI", "3tLjw7zJ9KGPGLCeWKDEZXL3c3xWjp1dh7XWl05j");

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
    if (! $( "#counterDesc" ).length)
      $( "body" ).append( "<p id='counterDesc'>一共选择了" + L + "张图片</p>" );
    else
      $( "#counterDesc" ).html( "一共选择了" + L + "张图片" );
      
    if (! $( "#counter" ).length)
      $( "body" ).append( "<p id='counter'>已上传0张</p>" );

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
    var j = 0;
    var fileArray = [];
    
    //build the product
    var product = new AV.Object("Product")
    product.set("product_name"  , productName);
    product.set("product_price" , productPrice);
    product.set("product_desc"  , productDesc);
    product.set("product_type"  , productType);
    product.set("product_brand" , productBrand);

    var myInter = setInterval(function(){

      file = fileToSave[i];
      i++;
      var saveFile = new AV.File("photo_" + i + ".jpg", file);
      //var saveFile = new Parse.File("photo_" + i + ".jpg", file);

      fileArray.push(saveFile);

      //console.log("uploading file");
      if (i <= fileToSave.length){
        saveFile.save().then(function() {
          console.log("single image saved");
          product.set("image"+"_"+j, fileArray[j]);
          j++;
          $('#counter').html("已上传" + j + "张");
          if(j == fileToSave.length){
            product.save();
            document.getElementById("save").disabled = false; 
            console.log("upload DONE");
            $("#productName").val('')
            $("#productPrice").val('')
            $("#productDesc").val('')
          }
        })
      }
      else{
        console.log("uploading interval cleared");
        clearInterval(myInter);
      }

    }, 2000);
  });

  function buildDict(dict){
    dict['Handbag']      = ['Coach', 'MK', 'Rebecca_Minkoff', 'Kate_Spade', 'other'];
    dict['Bag']          = ['Coach', 'MK', 'Rebecca_Minkoff', 'Kate_Spade', 'other'];
    dict['Cloth']        = ['Tommy', 'CK', 'A_F', 'Levis', 'US_POLO_ASSN', 'shoe', 'other'];
    dict['Jewel']        = ['Swarovski', 'Juicy_Couture','other'];
    dict['Nutrition']    = ['GNC', 'MoveFree', 'Puritans_Pride','other'];
    dict['Cosmetics']    = ['Lancome', 'Clinique', 'Esteem_Lauder', 'Kiehls','Origins','other'];
    dict['Baby']         = ['baby_healthy', 'baby_feeding', 'baby_daily','other'];
    dict['Other']        = ['other'];
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
