var app = angular.module("codeCafe", ['angularUtils.directives.dirPagination']);

app.controller("myCtrl",function($scope, $http){

        $scope.requiredData = [];
        $scope.showFilters = 0;
        $scope.showProgress = 1;
        $scope.searchDropdown = ["title", "level", "language"];
        $scope.queryBy = "title";

        $scope.languagesFreq = [];
        $scope.topUsedLanguage = [];
        $scope.getTopUsedLanguage = 1;
        $scope.compiler_image = {};  

        $scope.totalsubmissions = 0;

        var submissionData = [] ;      

        document.getElementById("content").style.display = "none";
        $scope.status = "";
        
        //first fetch compiler images and languages frequency to display statistics in the Right half
        fetchCompilerImageAndLanguageFrequency();

        function fetchCompilerImageAndLanguageFrequency(){
            $http.get('compiler_image.json').success(function(response){
                console.log(response);
                for (i in response){
                    lng = response[i].language;
                    $scope.compiler_image[response[i].language]= {icon: response[i].icon, freq:0};
                }
                activate();
                // console.log(Object.keys($scope.compiler_image).length);
                // console.log($scope.compiler_image);
            }); 
        }
         
        //Initialize db and check whether your browser supports indexeddb or not
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        var db;

        if (!indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB.")
        }
        
        function activate(){            
            initDb();
        }

        //Load data from web api and store them into variable submissionData
        function loadData() {
            submissionData = [] ;
            //There are 1347 pages on this web api - change loop size to load large data
            for (var i = 1; i <=7; i++) {   
                 URL = "http://hackerearth.0x10.info/api/ctz_coders?type=json&query=list_submissions&page="+i;  
                 $.ajax({url: URL, success: function(result){
                    submissionData = submissionData.concat(result["websites"]);
                    }               
                 });
            }    
        }

        $(document).ajaxStop(function () {
            console.log("all black");
            cacheData();
        });

        //Initilize new database if doesn't exist one and open it
        function initDb() {
            var request = indexedDB.open("newDatabase", 1);  
            request.onsuccess = function (evt) {
                db = request.result; 
                console.log("vipul");
                console.log(db);

                $scope.showProgress = 0;
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

        //Caching of Data to local client maching: After fetching data from webapi store them into indexeddb database
        function cacheData(){
            var transaction = db.transaction("submissions", "readwrite");
            var objectStore = transaction.objectStore("submissions");
            
            for (i in submissionData) {
                // console.log(i)
                objectStore.add({compiler_status:submissionData[i].compiler_status, id:parseInt(submissionData[i].id, 10), 
                    language: submissionData[i].language, level:submissionData[i].metadata.level, 
                    rating:submissionData[i].metadata.rating, users_attempted:submissionData[i].metadata.users_attempted, 
                    source_code:submissionData[i].source_code, title:submissionData[i].title                
                });
            }
        }

        // fetch Statistic Data to display in the right half
        function loadStatistic() {

            for(i in $scope.compiler_image){
                $scope.compiler_image[i].freq=0;                        
            }

            var transaction = db.transaction("submissions", IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore("submissions");
            var index = objectStore.index("language");

            for (var i in $scope.compiler_image) { 

                var request1 = index.openCursor(IDBKeyRange.only(i));
                request1.onsuccess = function(evt){
                    cursor = evt.target.result;
                    if (cursor) {  
                        // count+=1;       
                        $scope.compiler_image[cursor.value.language].freq+=1;

                        cursor.continue();  
                    }  
                    else{ 
                        count=0;                        
                        // console.log($scope.languagesFreq);

                        // $scope.requiredData = tmp;
                        // console.log(window.JSON.parse(JSON.stringify(myFirstObject))); 
                        // console.log($scope.topUsedLanguage[i].language);   
                        console.log("No more entries!");  
                        // eventFire(document.getElementById($scope.status), 'click');
                    }  

                }
                transaction.oncomplete = function(){
                    // z=0;
                    // for(i in $scope.compiler_image){
                    //     console.log(i, $scope.compiler_image[i].freq);                        
                    // }
                    console.log("Statistic Loaded");
                }
            }

            $scope.getTopUsedLanguage = 0;

            //load total submissions
            var transaction1 = db.transaction("submissions", IDBTransaction.READ_WRITE);
            var objectStore1 = transaction.objectStore("submissions");
            var total = objectStore1.count();
            total.onsuccess = function(){
                $scope.totalsubmissions = total.result;
            }

            


            // console.log($scope.topUsedLanguage); 
        }

        $scope.fetchData = function () {
            var transaction = db.transaction("submissions", IDBTransaction.READ_WRITE);
            var objectStore = transaction.objectStore("submissions");
            //document.getElementById("loader").style.display = "none";

            // fetch Statistic data only once when site is refreshed
            if($scope.getTopUsedLanguage){
                loadStatistic();
            }                    

            // var lowerBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status];
            // var upperBound = [$scope.selectedLevel, $scope.selectedLanguage, $scope.status+"z"];

            //console.log(lowerBound,upperBound);
            
            // var request = objectStore.index("myindex").openCursor(IDBKeyRange.bound(lowerBound, upperBound));

            var tmp = [];
            var request = objectStore.index("compiler_status").openCursor(IDBKeyRange.bound($scope.status, $scope.status+"z"));

            request.onsuccess = function(evt) {  
                var cursor = evt.target.result;  
                if (cursor) {  
                    tmp = tmp.concat(cursor.value);                          
                    cursor.continue();  
                }  
                else {  
                    $scope.requiredData = tmp;
                    console.log($scope.requiredData);   
                    console.log("No more entries!");  
                    eventFire(document.getElementById($scope.status), 'click');
                }  
            } 
            //$scope.requiredData = tmp;
            };

        // Delete cacheData stored on the client machine 
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

        //click on any html element
        function eventFire(el, etype){
            console.log("Radio clicked");
            if (el.fireEvent) {
                el.fireEvent('on' + etype);
            } 
            else {
                var evObj = document.createEvent('Events');
                evObj.initEvent(etype, true, false);
                el.dispatchEvent(evObj);
            }
        }           
       
});