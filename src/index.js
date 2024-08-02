window.onload = function() {
    const EMPLOYEE_TABLE = "employee";

    // Create the db when the page is loaded
    var initPromise = dbaccess.initDb("employee_db", 1, [ 
        function(db) {
            if (!db.objectStoreNames.contains(EMPLOYEE_TABLE)) {
                var newStore = db.createObjectStore(EMPLOYEE_TABLE, { keyPath: 'id', autoIncrement: true });
                newStore.createIndex("name", "name", { unique: false });
            }					
        }
    ]);
    initPromise.then(function() { 
        console.log("Database successfully initialized") 
    }, 
    function(e) {
        console.log("Database initialization failed. " + e);
    });

    document.getElementById("save-db-item-btn").onclick = function(e) {
        var name = document.getElementById("input_item_name").value;
        var birthday = document.getElementById("input_item_birthday").value;
        var wage = document.getElementById("input_item_wage").value;

        var savePromise = dbaccess.saveItem(EMPLOYEE_TABLE, { name: name, birthday: birthday, wage: wage });
        savePromise.then(function() { 
            console.log("Saved item successfully") 
        }, 
        function(e) {
            console.log("Unable to save item. " + e);
        });
    };

    document.getElementById("load-db-items-btn").onclick = function(e) {
        var readPromise = dbaccess.getAllItems(EMPLOYEE_TABLE);
        readPromise.then(function(e) { 
            var outputDiv = document.getElementById("all_items");
            var generatedTable = "<table id='all_items_table'>";
            generatedTable += "<thead>";
            generatedTable += "<tr>";
            generatedTable += "<th>Id</th>";
            generatedTable += "<th>Name</th>";
            generatedTable += "<th>Birthday</th>";
            generatedTable += "<th>Wage</th>";
            generatedTable += "</tr>";
            generatedTable += "</thead>";
            generatedTable += "<tbody>";
            e.forEach((employee) => {
                generatedTable += "<tr>";
                generatedTable += "<td>" + employee.id + "</td>";
                generatedTable += "<td>" + employee.name + "</td>";
                generatedTable += "<td>" + employee.birthday + "</td>";
                generatedTable += "<td>" + employee.wage + "</td>";
                generatedTable += "</tr>";
            });
            generatedTable += "</tbody>";
            generatedTable += "</table>";
            outputDiv.innerHTML = generatedTable;
        }, 
        function(e) {
            console.log("Unable to load item. " + e);
        });
    };
};