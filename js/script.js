//var submissions = [];
      var app = angular.module("codeCafe", ['angularUtils.directives.dirPagination']);
      app.controller("myCtrl",function($scope, $http){
        $scope.requiredData = [];
        $scope.showFilters = 0;
        $scope.showProgress = 1;
        $scope.searchDropdown = ["title", "level", "language"];
        $scope.queryBy = "title";

        $scope.topUsedLanguage = [];
        $scope.getTopUsedLanguage = 1;

        console.log($scope.showProgress,"progress initialization");
        document.getElementById("content").style.display = "none";
        // $scope.levels = ["Easy", "Medium", "Hard"];
        // $scope.languages = ["C", "GNU C++", "GNU C++11", "Python", "Java 7", "Java 8"];
        // $scope.selectedLevel = "Easy";
        // $scope.selectedLanguage = "C";
        $scope.status = "Accepted";

        $scope.compiler_image = {};
        $http.get('compiler_image.json').success(function(response){
            console.log(response);
            for (i in response){
                lng = response[i].language;
                $scope.compiler_image[response[i].language]= response[i].icon;
                $scope.topUsedLanguage.push({language:response[i].language, count:0});

            }
            activate();
            console.log($scope.compiler_image);
            console.log($scope.topUsedLanguage);

        });



        
        

         var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        var db;

         if (!indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
         }
         
      

         var submissionData = [] ;
        //activate();

        function activate(){            
            initDb();
            console.log($scope.compiler_image);

        }

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

              // initDb();
              //fetchData();
              cacheData();
              
         });
        function initDb() {
            //$scope.showProgress = 0;
            var request = indexedDB.open("newDatabase", 1);  
            request.onsuccess = function (evt) {
              db = request.result; 
              console.log("vipul");
              console.log(submissionData)
              console.log(db);     
                $scope.showProgress = 0;
                console.log($scope.showProgress,"progress bar");
                document.getElementById("loader").style.display = "none";
                document.getElementById("content").style.display = "inline";
                


            };

            request.onerror = function (evt) {
              console.log("IndexedDB error: " + evt.target.errorCode);
            };

            request.onupgradeneeded = function (evt) {
                console.log("upgradeneededvipul");
                var objectStore = evt.currentTarget.result.createObjectStore(
                           "submissions", { keyPath: "id", autoIncrement: false });
                objectStore.createIndex("compiler_status", "compiler_status", { unique: false });
                objectStore.createIndex('language', 'language', {unique:false});                
                objectStore.createIndex("level", "level", { unique: false });
                objectStore.createIndex("rating", "rating", { unique: false });
                objectStore.createIndex("users_attempted", "users_attempted", { unique: false });
                objectStore.createIndex("source_code", "source_code", { unique: false });
                objectStore.createIndex("title", "title", { unique: false });
                loadData();  
                


            };
            
          
        }
        function cacheData(){
            var transaction = db.transaction("submissions", "readwrite");
            var objectStore = transaction.objectStore("submissions");
            
            for (i in submissionData) {
              console.log(i)
              objectStore.add({compiler_status:submissionData[i].compiler_status, id:parseInt(submissionData[i].id, 10), 
                language: submissionData[i].language, level:submissionData[i].metadata.level, 
                rating:submissionData[i].metadata.rating, users_attempted:submissionData[i].metadata.users_attempted, 
                source_code:submissionData[i].source_code, title:submissionData[i].title
                
              });
            }
        }
         $scope.fetchData = function () {
                    var transaction = db.transaction("submissions", IDBTransaction.READ_WRITE);
                    var objectStore = transaction.objectStore("submissions");
                    //document.getElementById("loader").style.display = "none";
                    if($scope.getTopUsedLanguage){
                        var count=0;
                        var index = objectStore.index("language");
                        // console.log(request);
                        for(i in $scope.topUsedLanguage){
                            count=0;
                            request = index.openCursor(IDBKeyRange.only($scope.topUsedLanguage[i].language));
                            request.onsuccess = function(evt){
                                cursor = evt.target.result;
                                if (cursor) {  
                                    $scope.topUsedLanguage[i].count+=1;                         
                                    cursor.continue();  
                                }  
                                else {  
                                    // $scope.requiredData = tmp;
                                    // console.log(window.JSON.parse(JSON.stringify(myFirstObject))); 
                                    console.log( $scope.topUsedLanguage[i].count);   
                                    console.log("No more entries!");  
                                    eventFire(document.getElementById($scope.status), 'click');
                                }  

                            }

                        }
                        $scope.getTopUsedLanguage = 0;
                    }
 
                    

                    // var lowerBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status];
                    // var upperBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status+"z"];

                    //console.log(lowerBound,upperBound);
                    var tmp = [];
                    //$scope.requiredData = [];
                    // if($scope.showFilters){
                    //     console.log("in if statement");
                    //     var request = objectStore.index("myindex").openCursor(IDBKeyRange.bound(lowerBound, upperBound));

                    // }
                    // else{
                    var request = objectStore.index("compiler_status").openCursor(IDBKeyRange.bound($scope.status, $scope.status+"z"));

                    // }
                    // var count = request.result.count();
                    // count.onsuccess = function() {
                    //     console.log(count.result);
                    // }
                    request.onsuccess = function(evt) {  
                        var cursor = evt.target.result;  
                        //console.log(evt.target.result.count());
                        if (cursor) {  
                             console.log(cursor.value);
                            tmp = tmp.concat(cursor.value);                          
                            cursor.continue();  
                        }  
                        else {  
                            $scope.requiredData = tmp;
                            // console.log(window.JSON.parse(JSON.stringify(myFirstObject))); 
                            console.log($scope.requiredData);   
                            console.log("No more entries!");  
                            eventFire(document.getElementById($scope.status), 'click');
                        }  
                    } 
                    //$scope.requiredData = tmp;
            }; 
        $scope.deleteIndexedDb = function(){
            var req = indexedDB.deleteDatabase("newDatabase");
            req.onsuccess = function () {
                console.log("Deleted database successfully");
            };
            req.onerror = function () {
                console.log("Couldn't delete database");
            };
            req.onblocked = function () {
                window.alert("Can't delete Cached Data. Please delete Cached Data manually from your browser.")
                console.log("Couldn't delete database due to the operation being blocked");
            };
        }

        function eventFire(el, etype){
            console.log("radio clicked");
          if (el.fireEvent) {
            el.fireEvent('on' + etype);
          } else {
            var evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            el.dispatchEvent(evObj);
          }
        }           
       
      });