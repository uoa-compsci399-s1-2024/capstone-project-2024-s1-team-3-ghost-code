[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/t8qno6SJ)

# OTTER: Online TMS Training Experience Reboot

> ### [Project Management Tool]()

## Contributors
* Lucas Fernandes Tavares (Team Leader, Front-end)
* Ayesha Essop (Co-Leader, Front-end)
* Sahil Kumar (Back-end, Front-end)
* Emily Zhao (Front-end)
* Bailey Alexander (Back-end)
* Angus Wright (Back-end)

## Project Description
The OTTER project has been to develop a new learning platform for clinicians using TMS (Transcranial Magnetic Stimulation) on stroke patients. The platform allows clinicians to take quizzes and become certified when using TMS. It allows for practice and final attempts over 6 modules and a recertification module for each clinician to complete each year. Previously clinicians have been completing these quizzes on Google Forms, but the client wanted a dedicated solution for the quizzes to provide better insights into the quiz attempts and automatic certifications. Following an attempt, clinicians are able to view feedback about specific answers, and what they should revise before attempting the quiz again. Admins can add and edit quiz questions and can upload images to support the question. They can also view statistics about quiz attempts, and view results from each clinician's profile including their certifications and certificates.

[Demonstration Video](https://youtu.be/IDDmtNcA6Jw)

## Technologies Used
* .NET 8
* Microsoft SQL Server
* React JS
* Figma
* Amazon Web Services
* GitHub
* Jira

### React library
```

  "dependencies": {
    "@fortawesome/free-solid-svg-icons": "^6.5.2",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "@ionic/react": "^8.0.1",
    "fortawesome": "^0.0.1-security",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet": "^6.1.0",
    "react-router-dom": "^6.22.3",
    "react-textarea-autosize": "^8.5.3",
    "react-tooltip": "^5.26.4",
    "redaxios": "^0.5.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.56.0",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.38",
    "react-css-modules": "^4.7.11",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.11"
  }

  ```

## Project Installation Instructions

### Front End
* Install Visual Studio Code
* Install Node.js (https://nodejs.org/en)
* Open project in Visual Studio Code
* In a new terminal, run `cd (path to Front End folder)`
* Run `npm install` in the terminal. This will download all of the dependencies stated in the package.json file.
* Run `npm run dev` in the terminal. This will then run the code on your local device and give a link which you can put in your browser to view the project. 


### Back End
* Install .NET 8
* Install Visual Studio 2022
* Open `OTTER.sln` file from within `Back End/OTTER`
> **_NOTE:_**  After opening the project in Visual Studio, you can run the program in a developer environment, however you may not have access to any services through AWS such as S3, Simple Email Service, or Database.
* To deploy, use AWS Explorer plug-in in Visual Studio and deploy to Elastic Beanstalk. You may also deploy to your own server.

### Google Apps Script
For pre-training survey to send email address to backend upon submission

* Copy the contents of the [PreSurveyFormSubmissionAppsScript.gs](PreSurveyFormSubmissionAppsScript.gs) file
* Open a new Google Apps Script project
* Paste the contents of the PreSurveyFormSubmissionAppsScript.gs file into the Code.gs file in the project
* Add the Google Form ID for the pre-training survey into the openById parameter when setting var surveyForm
* Run the setTriggers function in Apps Script to set the responseReceived function to run on form on form submit

When a form submission is received, the responseReceived function will send the email address to the TMS Training Quizzes back end to mark user as completing the pre-training survey.

## Usage Examples
Our platform is designed for use by clinicians training on how to use TMS on stroke patients. It is not intended for public use.

The clinicians can sign up and complete the quizzes for each module.

Admins can login and view clinicians, their statistics, edit quizzes, and edit settings.

## Website URL
[TMS Training Quizzes (tmstrainingquizzes.com)](https://www.tmstrainingquizzes.com/)

## Future Release Ideas
* Recalling Attempt Feedback and Better Statistics
  * Ability for clinicians and admins to go back and see what they got wrong
* Automatic Quiz Reminder Emails
  * 11 month reminder to get re-certified
* Screen Size Adaptability
  * Ability to attempt the quizzes on your phone or tablet
* Advanced Answer Types
  * Drag and drop answers onto a sentence or image
* Survey Integration
  * Complete pre or post training surveys on our platform

## Acknowledgements
