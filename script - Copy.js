
var submissions = [];
var app = angular.module("codeCafe", []);
app.controller("myCtrl",function($scope){

    $scope.status = "Accepted";
    $scope.requiredData = [];
    // $scope.levels = ["All", "Easy", "Medium", "Hard"];
    // $scope.languages = ["All", "C", "C++", "Python", "Java 7", "Java 8"];
    // $scope.selectedLevel = "All";
    // $scope.selectedLanguage = "All";



    //$scope.fetchData = fetchData();


        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        var db;
   (function () {     
        var submissionData = [];

        activate();

        function activate(){
            loadData();
        }

      function loadData() {
          for (var i = 1; i <=1; i++) {   
              URL = "http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page="+i;  
              $.ajax({url: URL, success: function(result){
                 //console.log(result["websites"].length);
                 submissionData = submissionData.concat(result["websites"]);
                 //console.log(submissionData);   
                 }               
              });
              // $scope.items = employeeData;
          }
          //console.log(submissionData);        
      }
      $(document).ajaxStop(function () {
        // 0 === $.active
        console.log("all black");
        //$scope.requiredData = submissionData;
        console.log(submissionData);
        console.log($scope.requiredData);  

        initDb();
        //fetchData();
        
      });
      
           

     

      function initDb() {
          //loadData();
          var request = indexedDB.open("newDatabase", 1);  
          request.onsuccess = function (evt) {
              db = request.result; 
              console.log("vipul");
              console.log(submissionData)
              console.log(db);                                                           
          };

          request.onerror = function (evt) {
              console.log("IndexedDB error: " + evt.target.errorCode);
          };

          request.onupgradeneeded = function (evt) {
              //console.log("vipul");
              //console.log(submissionData)
              var objectStore = evt.currentTarget.result.createObjectStore(
                       "submissions", { keyPath: "id", autoIncrement: false });

              objectStore.createIndex("compiler_status", "compiler_status", { unique: false });
              objectStore.createIndex("language", "language", { unique: false });
              objectStore.createIndex("level", "level", { unique: false });
              objectStore.createIndex("rating", "rating", { unique: false });
              objectStore.createIndex("users_attempted", "users_attempted", { unique: false });
              objectStore.createIndex("source_code", "source_code", { unique: false });
              objectStore.createIndex("title", "title", { unique: false });
              objectStore.createIndex('myindex', ['title', 'level', 'language'], {unique:false});

              // objectStore.createIndex("name", "name", { unique: false });
              // objectStore.createIndex("email", "email", { unique: true });
          
              for (i in submissionData) {
                  console.log(i)
                  objectStore.add({compiler_status:submissionData[i].compiler_status, id:parseInt(submissionData[i].id, 10), 
                    language:submissionData[i].language, level:submissionData[i].metadata.level, 
                    rating:submissionData[i].metadata.rating, users_attempted:submissionData[i].metadata.users_attempted, 
                    source_code:submissionData[i].source_code, title:submissionData[i].title, 
                    myindex: [submissionData[i].title, submissionData[i].metadata.level, submissionData[i].language]
                  });
              }
              

          };
      }

        $scope.fetchData =  function() {
          // onComplete: function() {
          //     loadData();
          //     initDb();
          // }
          //initDb();
          //loadData();            

          // btnAdd.addEventListener("click", function () {
          //     var name = document.getElementById("txtName").value;
          //     var email = document.getElementById("txtEmail").value;

          //     var transaction = db.transaction("people", IDBTransaction.READ_WRITE);
          //     var objectStore = transaction.objectStore("people");                    
          //     var request = objectStore.add({ name: name, email: email });
          //     request.onsuccess = function (evt) {
          //         // do something after the add succeeded
          //     };
          // }, false);

          // btnDelete.addEventListener("click", function () {
          //     var id = document.getElementById("txtID").value;

          //     var transaction = db.transaction("people", IDBTransaction.READ_WRITE);
          //     var objectStore = transaction.objectStore("people");
          //     var request = objectStore.delete(id);
          //     request.onsuccess = function(evt) {  
          //         // It's gone!  
          //     };
          // }, false);


          //btnPrint.addEventListener("click", function () {
              //console.log("vipul");
              //console.log(db); 
            var items = [];
            var output = document.getElementById("printOutput");
            output.textContent = "";

            var transaction = db.transaction("submissions", IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore("submissions");

            var lowerBound = ["1","Hard", "GNU C++11"];
            var upperBound = ["ZZZZZ","Hard","GNU C++11"];
            // var request = objectStore.index("compiler_status").openCursor(IDBKeyRange.lowerBound("Wrong"));
            // // console.log(request);
            // $scope.requiredData = [];
            // console.log($scope.requiredData);  

            //   request.onsuccess = function(evt) { 
            //       var cursor = evt.target.result;  
            //       //console.log(cursor.value);
            //       //console.log($scope.requiredData);  
            //       if (cursor) {  
            //             items.push(cursor.value);
            //             //console.log($scope.requiredData);  

            //           // output.textContent += "id: " + cursor.key + 
            //           //             " is " + cursor.value.compiler_status + " "  ;                            
            //           cursor.continue();  
            //       }  
            //       else {  
            //             $scope.requiredData = items;
            //           console.log("No more entries!");  
            //           console.log($scope.requiredData);
            //       }  
            //   };
              var request = objectStore.index("compiler_status").openCursor(IDBKeyRange.lowerBound("Wrong"));
                    request.onsuccess = function(evt) {  
                        var cursor = evt.target.result;  
                        //console.log(cursor.value);
                        if (cursor) {  
                            $scope.requiredData.push(cursor.value);
                            output.textContent += "id: " + cursor.key + 
                                        " is " + cursor.value.compiler_status + " "  ;                            
                            cursor.continue();  
                        }  
                        else {  
                            console.log($scope.requiredData[0].title);
                            console.log("No more entries!");  
                        }  
                    }; 
          //}, false);

      }



      //window.addEventListener("DOMContentLoaded", contentLoaded, false); 
   })();     
});  
