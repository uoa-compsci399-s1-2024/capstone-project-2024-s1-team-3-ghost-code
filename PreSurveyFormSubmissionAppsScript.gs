// Deployment steps
// 1. Paste this code into a new Google Apps Script project under Code.gs file.
// 2. Add the Google Form ID for the pre-training survey into the openById parameter when setting var surveyForm below.
// 3. Run the setTriggers function in Apps Script to set the responseReceived function to run on form on form submit.
// When a form submission is received, the responseReceived function will send the email address to the TMS Training Quizzes website to mark user as completing the pre-training survey.

var surveyForm = FormApp.openById(""); // Add the Form ID into the openById paramter

function setTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  ScriptApp.newTrigger("responseReceived")
    .forForm(surveyForm)
    .onFormSubmit()
    .create();
}

function responseReceived(e) {
  var email = e.response.getRespondentEmail();

  var url =
    "https://api.tmstrainingquizzes.com/webapi/ClinicianSurveyCompletion";

  // Create the JSON object
  var data = {
    email: email,
  };

  // Convert the JSON object to a string
  var payload = JSON.stringify(data);

  // Set up the options for the UrlFetchApp.fetch() call
  var options = {
    method: "post",
    contentType: "application/json",
    payload: payload,
    muteHttpExceptions: true,
  };

  // Make the POST request
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.log(response.getContentText());
  } catch (error) {
    Logger.log("Error: " + error);
  }
}
