//var submissions = [];
      var app = angular.module("codeCafe", []);
      app.controller("myCtrl",function($scope){
        $scope.requiredData = [];
        $scope.showFilters = 0;

        $scope.levels = ["Easy", "Medium", "Hard"];
        $scope.languages = ["C", "GNU C++", "GNU C++11", "Python", "Java 7", "Java 8"];
        $scope.selectedLevel = "Easy";
        $scope.selectedLanguage = "C";
        $scope.status = "Accepted";

         var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        var db;

         //prefixes of implementation that we want to test
         // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
         
         //prefixes of window.IDB objects
         // window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
         // window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
         
         if (!indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
         }
         
         const employeeData = [];

         var submissionData = [] ;
         // $scope.submissions = [];
         
         // $scope.init = function(){
         //       submissions = [] ;
         //       for (var i = 1; i <=2; i++) {   
         //          URL = "http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page="+i;  
         //          $.ajax({url: URL, success: function(result){
         //             //console.log(result["websites"].length);
         //             submissions = submissions.concat(result["websites"]);
         //             console.log(submissions);   
         //             }               
         //          });
         //       // $scope.items = employeeData;
         //       }
         //       console.log(submissions);
               

         // }
      activate();

        function activate(){
            loadData();
        }
        var myFirstObject = {firstName: "Richard", favoriteAuthor: "Conrad"};

         function loadData() {
            submissionData = [] ;
             for (var i = 1; i <=10; i++) {   
                 URL = "http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page="+i;  
                 $.ajax({url: URL, success: function(result){
                    //console.log(result["websites"].length);
                    submissionData = submissionData.concat(result["websites"]);
                    //console.log(submissionData);   
                    }               
                 });
                 // $scope.items = employeeData;
             }
             console.log(submissionData);        
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
                  objectStore.createIndex('myindex', ['level', 'language', 'compiler_status'], {unique:false});

                  // objectStore.createIndex("name", "name", { unique: false });
                  // objectStore.createIndex("email", "email", { unique: true });
              
                  for (i in submissionData) {
                      console.log(i)
                      objectStore.add({compiler_status:submissionData[i].compiler_status, id:parseInt(submissionData[i].id, 10), 
                        language:submissionData[i].language, level:submissionData[i].metadata.level, 
                        rating:submissionData[i].metadata.rating, users_attempted:submissionData[i].metadata.users_attempted, 
                        source_code:submissionData[i].source_code, title:submissionData[i].title, 
                        myindex: [submissionData[i].metadata.level, submissionData[i].language, submissionData[i].compiler_status]
                      });
                  }
                  

              };
          }
         $scope.fetchData = function () {
                    //console.log("vipul");
                    //console.log(db); 
                    // var output = document.getElementById("printOutput");
                    // output.textContent = "";
 
                    var transaction = db.transaction("submissions", IDBTransaction.READ_WRITE);
                    var objectStore = transaction.objectStore("submissions");

                    var lowerBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status];
                    var upperBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status+"z"];

                    console.log(lowerBound,upperBound);
                    var tmp = [];
                    //$scope.requiredData = [];
                    if($scope.showFilters){
                        console.log("in if statement");
                        var request = objectStore.index("myindex").openCursor(IDBKeyRange.bound(lowerBound, upperBound));

                    }
                    else{
                        var request = objectStore.index("compiler_status").openCursor(IDBKeyRange.bound($scope.status, $scope.status+"z"));

                    }
                    request.onsuccess = function(evt) {  
                        var cursor = evt.target.result;  
                        // console.log(cursor.value);
                        if (cursor) {  
                             console.log(cursor.value);
                            tmp = tmp.concat(cursor.value);
                            //$scope.requiredData = $scope.requiredData.concat(cursor.value);
                            // tmp.push(window.JSON.parse(cursor.value));
                            // output.textContent += "id: " + cursor.key + 
                            //             " is " + cursor.value.compiler_status + " "  ;                            
                            cursor.continue();  
                        }  
                        else {  
                            $scope.requiredData = tmp;
                            // console.log(window.JSON.parse(JSON.stringify(myFirstObject))); 
                            console.log($scope.requiredData);   
                            console.log("No more entries!");  
                        }  
                    } 
                    //$scope.requiredData = tmp;
            };             
         $scope.fetchData2 = function(){               
               $scope.requiredData = submissionData; 
               console.log($scope.requiredData);        

         }
         $scope.fetchData1 = function(){               
               $scope.requiredData = [
                    {title:"abcd", source_code:"badfjecdl"},
                    {title:"sfsdf", source_code:"sm as abouve"}

               ]; 
               console.log($scope.requiredData);        

         }
         function get_type(thing){
            if(thing===null)return "[object Null]"; // special case
            return Object.prototype.toString.call(thing);
        }
         // console.log("employeeData"+ employeeData);
         
         
        
         
         
         
         // function add() {
         //    var request = db.transaction(["submission"], "readwrite")
         //    .objectStore("submission")
         //    .add(Submissions);
            
         //    request.onsuccess = function(event) {
         //       alert("Kenny has been added to your database.");
         //    };
            
         //    request.onerror = function(event) {
         //       alert("Unable to add data\r\nKenny is aready exist in your database! ");
         //    }
         // }
         
       
      });