//BUDGET CONTROLLER
var budgetController = (function() {

	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function(type) {
		var sum = 0;
		data.allItems[type].forEach(function(cur) {
			sum = sum + cur.value;
			//sum += cur.value
		});
		data.totals[type] = sum;
		/*
		0
		[200, 400, 100]
		sum = 0 + 200
		sum = 200 + 400
		sum = 600 + 100 = 700
		*/
	};
	
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1 //use -1 to indicate that something is non-existent instead of 0
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//Create new ID


			if (data.allItems[type].length > 0)  {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;  //this is the last ID
			} else {
				ID = 0;
			}
			//Create new item based on 'inc' or 'exp'
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push new item into our data structure
			data.allItems[type].push(newItem);

			//return the new element
			return newItem;
		},

		calculateBudget: function() {
			

			// calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');


			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;
			//calculate the percentage of income that we spent

			if (data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		getBudget: function() {   //function that only retrieves data
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			};
		},

		testing: function() {
		console.log(data);
		}
	};

})();
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

//UI CONTROLLER
var UIController = (function() {

	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage'
	};

	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value,  //inc for income or exp for expense
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)  //use parseFloat() to turn a string into a number
			};
		},

		addListItem: function(obj, type) {
			var html, newHtml, element;


			/* an experiment with the empty string checker


			var emptyStringChecker = obj.description;
			console.log(emptyStringChecker.trim().length);
			
			if (emptyStringChecker.trim().length === 0){
				alert('help');
			}*/


			// Create HTML string with placeholder text
			if (type === 'inc'){
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete__btn"><i class="ion-ios-close-outline"></i></button></div></div> </div>';
			} else if (type === 'exp'){
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}
			//Replace the placeholder text with actual data
			newHtml = html.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);
			newHtml = newHtml.replace('%id%', obj.id);

			//Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		clearFields: function() {
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);  //querySelectorAll returns a list, NOT an ARRAY// Since it's a list, you can't call array methods on it, you must convert it to an array first.
			//console.log(fields);
			fieldsArr = Array.prototype.slice.call(fields); //since prototype.slice is a function you can use the .call method (any .call, you set the .this. variable first), so here we set the .this. variable to fields 
			
			fieldsArr.forEach(function(current, index, array) {  //can name the arguments anything here
				current.value = "";
			});
			fieldsArr[0].focus();
		},

		displayBudget: function(obj) {
			document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
			document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		getDOMstrings: function() {
			return DOMstrings;
		}
	};
})();



//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {   //pass the two arguments in here to connect them

	var setupEventListeners = function(){

		var DOM = UICtrl.getDOMstrings(); 

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		document.addEventListener('keypress', function(event) {
			if (event.which === 13 || event.keycode === 13) {
				ctrlAddItem();
			}
		}); 
	};

	var updateBudget = function() {
		//1. Calulate the budget
		budgetCtrl.calculateBudget();
		//2. Return the budget
		var budget = budgetCtrl.getBudget();
		//3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	var ctrlAddItem = function() {
		var input, newItem;



		// 1. Get the filed input data
		input = UIController.getInput(); 
		console.log(input.type);


		if(input.description.trim().length !== 0  && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);
			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);
			// 4. Clear the fields
			UIController.clearFields();
			//5. Caclulate and update budget
			updateBudget();
		}
	};

	return {
		init: function(){
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	};

})(budgetController, UIController);

controller.init();















