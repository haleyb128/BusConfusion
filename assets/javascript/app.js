  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAphBva-VLBzafcuUgDcRnyPb8ZgTwAFi0",
    authDomain: "busconfusion.firebaseapp.com",
    databaseURL: "https://busconfusion.firebaseio.com",
    projectId: "busconfusion",
    storageBucket: "",
    messagingSenderId: "587237219002"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $('#submitButton').on('click', function(){
	
	var busName = $('#nameInput').val().trim();
	var destination = $('#destinationInput').val().trim();
	var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format("");
	var frequency = $('#frequencyInput').val().trim();

	var newBus = {
		name: busName,
		tdestination: destination,
		tFirst: firstTime,
		tfreq: frequency,
	}

    database.push(newBus);
    $('#nameInput').val("");
	$('#destinationInput').val("");
	$('#timeInput').val("");
	$('#frequencyInput').val("");

	return false;
});
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	// console.log(childSnapshot.val());

	//store everything into a variable
	var busName = childSnapshot.val().name;
	var destination = childSnapshot.val().tdestination;
	var firstTime = childSnapshot.val().tFirst;
	var frequency = childSnapshot.val().tfreq;

	//convert first time (push back 1 year to make sure it comes before current time)
	var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
	// console.log(firstTimeConverted);

	//current time
	var currentTime = moment();
	// console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	//difference between the times
	var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	// console.log("DIFFERENCE IN TIME: " + diffTime);

	//time apart (remainder)
	var tRemainder = diffTime % frequency;
	// console.log(tRemainder);

	//minute until bus
	var tMinutesTill = frequency - tRemainder;
	

	//next bus
	var nextBus = moment().add(tMinutesTill, "minutes");
	var nextBusConverted = moment(nextBus).format("hh:mm a");

	//add data into the table
	$("#bus-table > tbody").append("<tr><td>" + busName + "</td><td>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td>" + nextBusConverted + "</td><td>" + tMinutesTill + "</td></tr>");

});