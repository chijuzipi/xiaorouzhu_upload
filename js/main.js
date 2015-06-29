Parse.initialize("cMob1z3wF1FNpAWlw4o4vbalOP2EAGEcEzmnK4PI", "3tLjw7zJ9KGPGLCeWKDEZXL3c3xWjp1dh7XWl05j");

$(document).ready(function(){

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

    var productName = $("#productName").val();
    var productPrice = $("#productPrice").val();
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
      var product = new Parse.Object("Bag")
      product.set("product_name", productName);
      product.set("product_price", productPrice);
      for(i=0; i<fileArray.length; i++) {
        product.set("image"+"_"+i, fileArray[i]);
      }
      product.save();
      document.getElementById("save").disabled = false; 
      $( "body" ).append( "<p>upload successfully!</p>" );
    });

  });
});
