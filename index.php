<!DOCTYPE html>
<html lang="en-US">
<head>
    <title>Code Cafe</title>
    <!-- include bootstrape -->
    <link data-require="bootstrap-css@3.1.1" data-semver="3.1.1" rel="stylesheet" href="css/bootstrap.min.css" />
    <!-- include angularjs -->
    <script data-require="angular.js@1.3.0" data-semver="1.3.0" src="https://code.angularjs.org/1.3.0/angular.js"></script>
    <!-- include jquery -->
    <script data-require="jquery@*" data-semver="2.0.3" src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
    <script data-require="bootstrap@3.1.1" data-semver="3.1.1" src="js/bootstrap.min.js"></script>

    <!-- include local css file -->
    <link rel="stylesheet" href="css/style.css" />
    <!-- include local js file -->
    <script src="js/script.js"></script>
    <!-- include third party pagination library -->
    <script src="js/dirPagination.js"></script>
</head>

<body>
    <div ng-app="codeCafe" ng-controller="myCtrl">
        <div id="loader"></div>
        <div id="content">
            <div class="headContent" id="headContent">
                <img src="http://www.codestudents.co.uk/assets/img/cafe-logo.png" alt="Code Cafe" width="20%" height="10%">
                <!-- <span style="font-size:20px; color:blue;word-wrap: break-word;">
                    C<span style="color:green">ode</span> 
                    C<span style="color:green">afe</span>
                </span> -->
                <span style="font-size:20px;color:#ABBBBB">--code hub with states!</span>
                <span style="padding-left:20%"></span>
                <button style="vertical-align:middle;" ng-click="deleteIndexedDb()">Refresh Data</button>
            </div>

            <hr>

            <div id="mainContent">
                <div class="left w80 ">
                    <div class="third"style="color:blue;font-size:15px">
                        SearchBy: 
                        <select ng-model="queryBy" ng-options="x for x in searchDropdown" value="x"></select>                        
                        <input ng-model="query[queryBy]" placeholder="Search"/>
                    </div>
                    <!-- <div>                    
                        <button ng-model="showFilters" ng-click="showFilters=!showFilters;fetchData()"> 
                            <span ng-hide="showFilters">Use Filters</span>  
                            <span ng-show="showFilters">Hide Filter Options</span>  
                        </button>
                        <div ng-show="showFilters">
                            <select ng-model="selectedLevel" ng-options="x for x in levels"></select>
                            <select ng-model="selectedLanguage" ng-options="x for x in languages"></select>
                            <button ng-click="fetchData()">Search</button>
                        </div>
                    </div> -->
                    <hr>
                    <div class="borderB">
                        <div>
                            <ul style="background-color: #ab8e71;">
                                <li dir-paginate="submission in requiredData | filter:query| itemsPerPage: 10" pagination-id="submission">
                                    <div class="card">
                                        <div>
                                           <!-- <img class="left" src="https://images.alphacoders.com/511/511052.jpg" alt="Code Cafe" width="50" height="50"> -->
                                           <img class="left" src="{{compiler_image[submission.language].icon}} " alt="Code Cafe" width="50" height="50">

                                           <span style="font-size:30px; vertical-align:bottom; color:blue;">{{submission.title}}</span>
                                            <span style="float:right;font-size:25px; margin-right: 10px; color:purple;">Submission Id : {{submission.id}}</span>
                                           
                                        </div><br>

                                        <!-- <p class="test2">{{submission.source_code}}</p> -->
                                        <pre flex class="ng-binding" style="background-color:#73AD21;color:white;border-radius: 25px;">{{submission.source_code}}</pre>
                                        <hr>
                                        <div>
                                            <span style="font-size: 20px;color:#5f5f5f" >Submission Status: </span>
                                            <span class="test">{{submission.compiler_status}}</span>
                                            <span style="font-size: 20px;color:#5f5f5f" >Level: </span>
                                            <span class="test">{{submission.level}}</span>
                                            

                                        </div>
                                        <hr>
                                        <div>
                                            <span style="font-size: 20px;color:#bb2329" >Programmed In: </span>
                                            <span class="test">{{submission.language}}</span>
                                            <span style="font-size: 20px;color:#bb2329" >Rating: </span>
                                            <span class="test">{{submission.rating}}</span>
                                            <span style="font-size: 20px;color:#bb2329" >Users Attempted: </span>
                                            <span class="test">{{submission.users_attempted}}</span>
                                        </div> 
                                        <hr>               
                                    </div><br>
                                </li>
                            </ul>
                            
                        </div> 

                    </div>
                    <span style="margin-top:0">
                        <dir-pagination-controls pagination-id="submission"></dir-pagination-controls>                    

                    </span>

                </div>              
                <br>





                <div class="left w20 borderB">
                <div class="cardHead">Filter by Status</div>
                <div>
                    <br>
                    <input type="radio" ng-model="status" name="status" ng-change="fetchData()" id="Accepted" value="Accepted" checked>Accepted<br>
                    <input type="radio" ng-model="status" name="status" ng-change="fetchData()" id="Skipped" value="Skipped">Skipped<br>
                    <input type="radio" ng-model="status" name="status" ng-change="fetchData()" id="Memory" value="Memory">Memory / Time limit exceeded<br>
                    <input type="radio" ng-model="status" name="status" ng-change="fetchData()" id="Runtime" value="Runtime" >Runtime / Compilation error<br>
                    <input type="radio" ng-model="status" name="status" ng-change="fetchData()" id="Wrong" value="Wrong">Wrong Answer<br><br>
                </div>
                <hr>
                <div class="cardHead">Statical Analysis</div>
                   <!-- <select ng-model="selectAnalysis" ng-options="x for x in Analysis" value="x" ng-change="loadStatistic(x)"></select> -->
                    <ul>
                        <li>Submissions per Language:
                            <ul>
                            <li ng-repeat="(key, value) in compiler_image| orderBy:value.freq   " ng-if="value.freq!=0">{{key}}: {{value.freq}}</li>
                            </ul> 
                        </li>
                        <li>Number of Submissions per level:
                            <ul>
                                <li>Easy: 312</li>
                                <li>Medium: 415</li>
                                <li>Hard: 19</li>
                            </ul> 
                        </li>
                        <li>Total Submissions: {{totalsubmissions}}</li>
                    </ul>
                </div>       
            </div>
        </div>
    </div>

    <div ng-controller="OtherController" class="other-controller">
        <!-- <small>this is in "OtherController"</small> -->
        <div class="text-center">
            <dir-pagination-controls boundary-links="true" on-page-change="pageChangeHandler(newPageNumber)" template-url="dirPagination.tpl.html"></dir-pagination-controls>
        </div>
    </div> 

</body>
</html>