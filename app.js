//BUDGET CONTROLLER
var budgetController = (function() {


})();


//UI CONTROLLER
var UIController = (function() {

	return {
		getinput: function(){
			var type = document.querySelector('.add__description').value;
			
		}
	};
})();



//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {   //pass the two arguments in here to connect them

	var ctrlAddItem = function() {
		// 1. Get the filed input data
			var x = document.querySelector('.add__description').value;
			var y = document.querySelector('.add__value').value;
			console.log(x);
			console.log(y);
		// 2. Add the item to the budget controller

		// 3. Add the item to the UI

		// 4. Calculate the budget

		// 5. Display the budget on the UI
		console.log('it works');
	};


	//Event Handler 
	document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);
	document.addEventListener('keypress', function(event) {
		if (event.which === 13 || event.keycode === 13) {
			ctrlAddItem();
		} else {
			console.log('Did not press "enter" key.');
		}
	}); 



})(budgetController, UIController);

















