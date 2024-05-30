using OTTER.Models;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;
using OTTER.Dtos;
using System.Security.Cryptography;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Text;
using System.Runtime.ConstrainedExecution;
using Microsoft.AspNetCore.Components.Forms;
using iTextSharp.text.pdf;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Transfer;
using System;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Amazon.SimpleEmail;
using Amazon.SimpleEmail.Model;

namespace OTTER.Data
{
    public class DBOTTERRepo : IOTTERRepo
    {
        private readonly OTTERDBContext _dbContext;
        private readonly string _adminEmail = "gc@anguswright.com";
        private readonly string _bucketURL = "https://s3.ap-southeast-2.amazonaws.com/certificate.tmstrainingquizzes.com/";
        public DBOTTERRepo(OTTERDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void SendEmail(string requestEmail, string requestSubject, string requestBody, bool ccAdmin = false)
        {
            if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production") // Only sends if the environment is production to get accurate AWS credentials
            {
                var senderName = "VERIFY Study";
                var senderEmail = "noreply@tmstrainingquizzes.com";
                var templatePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Dtos", "emailTemplate.html");

                // Read the HTML template
                var htmlTemplate = File.ReadAllText(templatePath);
                var htmlBody = htmlTemplate.Replace("{{subject}}", requestSubject).Replace("{{body}}", requestBody);

                // Initialize Amazon SES client using InstanceProfileAWSCredentials
                var credentials = new InstanceProfileAWSCredentials();
                using (var client = new AmazonSimpleEmailServiceClient(credentials, RegionEndpoint.APSoutheast2))
                {
                    var sendRequest = new SendEmailRequest { };
                    if (ccAdmin)
                    {
                        sendRequest = new SendEmailRequest
                        {
                            Source = $"{senderName} <{senderEmail}>",
                            ReplyToAddresses = new List<string> { _adminEmail },
                            Destination = new Destination
                            {
                                ToAddresses = new List<string> { requestEmail },
                                CcAddresses = new List<string> { _adminEmail }
                            },
                            Message = new Message
                            {
                                Subject = new Content(requestSubject),
                                Body = new Body
                                {
                                    Html = new Content
                                    {
                                        Charset = "UTF-8",
                                        Data = htmlBody
                                    }
                                }
                            }
                        };
                    }
                    else
                    {
                        sendRequest = new SendEmailRequest
                        {
                            Source = $"{senderName} <{senderEmail}>",
                            ReplyToAddresses = new List<string> { _adminEmail },
                            Destination = new Destination
                            {
                                ToAddresses = new List<string> { requestEmail }
                            },
                            Message = new Message
                            {
                                Subject = new Content(requestSubject),
                                Body = new Body
                                {
                                    Html = new Content
                                    {
                                        Charset = "UTF-8",
                                        Data = htmlBody
                                    }
                                }
                            }
                        };
                    }

                    try
                    {
                        var response = client.SendEmailAsync(sendRequest);
                        Console.WriteLine("Email Sent");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to send email. Error: {ex.Message}");
                    }
                }
            }
        }

        public string CreateCertificate(Certification certification, Module module)
        {
            string templateFilename;
            if (module.ModuleID == 7)
            {
                templateFilename = "recerttemplate.pdf";
            }
            else
            {
                templateFilename = "certtemplate.pdf";
            }
            // Load the template PDF
            using (var reader = new PdfReader(_bucketURL + templateFilename))
            {
                using (var stream = new MemoryStream())
                {
                    var stamper = new PdfStamper(reader, stream);
                    var form = stamper.AcroFields;

                    string name = certification.User.FirstName + " " + certification.User.LastName;
                    string acheivedText = $"VERIFY: {module.Name}";
                    if (module.ModuleID <= 6)
                    {
                        acheivedText = acheivedText + " module";
                    }

                    // Populate fields with data
                    form.SetField("Name", $"{name}");
                    form.SetField("Module", acheivedText);
                    form.SetField("Date", certification.DateTime.ToString("dd MMMM yyyy"));
                    if (module.ModuleID == 7 || module.ModuleID == 8)
                    {
                        form.SetField("Expiry", "Expiry: " + certification.ExpiryDateTime.ToString("dd MMMM yyyy"));
                    }

                    // Flatten the form (optional)
                    stamper.FormFlattening = true;

                    stamper.Close();

                    byte[] bytes = stream.ToArray();

                    // Upload to S3
                    string certURI = $"certificates/{certification.DateTime.ToString("yyyyMMddhhmmss")}{name.Replace(" ", "")}{module.Name.Replace(" ", "")}.pdf";

                    if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production") // Only uploads if the environment is production to get accurate AWS credentials
                    {
                        UploadToS3(bytes, certURI);

                        return _bucketURL + certURI;
                    }
                    else // If not production, certificate not found
                    {
                        return _bucketURL + "404.html";
                    }
                }
            }
        }

        public string UploadQuestionImage(IFormFile file, Question question)
        {
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);
                byte[] bytes = stream.ToArray();

                // Upload to S3
                string imageURI = $"quizimages/{DateTime.UtcNow.ToString("yyyyMMddhhmmss")}QID{question.QuestionID}-{file.FileName}";

                if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Production") // Only uploads if the environment is production to get accurate AWS credentials
                {
                    UploadToS3(bytes, imageURI);

                    question.ImageURL = _bucketURL + imageURI;
                    _dbContext.SaveChanges();

                    return "Success - " + _bucketURL + imageURI;
                }
                else // If not production, certificate not found
                {
                    return "Failed - Non Production Environment";
                }
            }
        }

        static void UploadToS3(byte[] bytes, string key)
        {
            var credentials = new InstanceProfileAWSCredentials();
            using (var stream = new MemoryStream(bytes))
            {
                using (var client = new AmazonS3Client(credentials, RegionEndpoint.APSoutheast2))
                {
                    var transferUtility = new TransferUtility(client);
                    transferUtility.Upload(stream, "certificate.tmstrainingquizzes.com", key);
                }
            }
        }


        public IEnumerable<Module> GetModules()
        {
            return _dbContext.Modules.ToList<Module>();
        }
        public Module GetModuleByID(int id)
        {
            return _dbContext.Modules.FirstOrDefault(e => e.ModuleID == id);
        }

        public IEnumerable<Quiz> GetQuizzesByID(int id)
        {
            return _dbContext.Quizzes.Where(e => e.Module.ModuleID == id);
        }
        public Quiz GetQuizByID(int id)
        {
            return _dbContext.Quizzes.FirstOrDefault(e => e.QuizID == id);
        }

        public Question GetQuestionByID(int id)
        {
            return _dbContext.Questions.Include(e => e.Module).FirstOrDefault(e => e.QuestionID == id);
        }

        public IEnumerable<Question> GetQuestionsByModule(int id)
        {
            return _dbContext.Questions.Where(e => e.Module.ModuleID == id && e.Deleted == false).ToList<Question>();
        }

        public IEnumerable<AdminQuestionOutputDto> GetQuestionsByModuleAdmin(int id)
        {
            List<AdminQuestionOutputDto> output = new List<AdminQuestionOutputDto>();
            IEnumerable<Question> Qs = _dbContext.Questions.Where(e => e.Module.ModuleID == id && e.Deleted == false).ToList<Question>();
            foreach (Question q in Qs)
            {
                double correctRate;
                if (q.attemptTotal > 0)
                {
                    correctRate = ((double)q.correctTotal / (double)q.attemptTotal) * 100;
                } else
                {
                    correctRate = 0;
                }
                
                AdminQuestionOutputDto adminQuestionOutputDto = new AdminQuestionOutputDto { QuestionID = q.QuestionID, ModID = id, Title = q.Title, Description = q.Description, ImageURL = q.ImageURL, QuestionType = q.QuestionType, Topic = q.Topic, Answers = new List<AdminAnswerOutputDto>(), attemptTotal = q.attemptTotal, correctTotal = q.correctTotal, correctRate = correctRate };
                IEnumerable<Answer> As = _dbContext.Answers.Include(e => e.Question).Where(e => e.Question.QuestionID == q.QuestionID).ToList<Answer>();
                foreach (Answer a in As)
                {
                    AdminAnswerOutputDto adminAnswerOutputDto = new AdminAnswerOutputDto { AnswerID = a.AnswerID, QuestionID = q.QuestionID, AnswerType = a.AnswerType, AnswerText = a.AnswerText, CorrectAnswer = a.CorrectAnswer, Feedback = a.Feedback };
                    adminQuestionOutputDto.Answers.Add(adminAnswerOutputDto);
                }
                output.Add(adminQuestionOutputDto);
            }
            return output;
        }

        public IEnumerable<QuestionOutputDto> GetQuizQs(QuizInputDto quizInput)
        {
            Random random = new Random();
            List<QuestionOutputDto> output = new List<QuestionOutputDto>();
            if(GetQuestionsByModule(quizInput.ModuleID).Where(e => e.Deleted == false) != null)
            {
                Quiz quiz = GetQuizByID(quizInput.QuizID);
                Attempt attempt = AddAttempt(new Attempt { Quiz = quiz, User = GetUserByID(quizInput.UserID), DateTime = DateTime.UtcNow, Completed = "INCOMPLETE" });
                IEnumerable<Question> validQuestions = GetQuestionsByModule(quizInput.ModuleID).Where(e => e.Deleted == false).ToList<Question>();
                int topic = 1;
                int topicCount = 0;
                int percentage = 40;
                for (int i = 1; i < quiz.Length + 1; i++)
                {
                    IEnumerable<Question> validQuestions2 = validQuestions.Where(e => e.Topic == topic).ToList<Question>();
                    Console.WriteLine(validQuestions2.Count());
                    if (validQuestions2.Count() != 0)
                    {
                        int randnum = random.Next(0,validQuestions2.Count());
                        Question randq = validQuestions2.ElementAt(randnum);
                        if (output.FirstOrDefault(e => e.QuestionID == randq.QuestionID) != null)
                        {
                            if (validQuestions2.Count() == output.Where(e => e.Topic == topic).Count()) ;
                            {
                                topicCount = 0;
                                topic = (topic + 1) % 4;
                            }
                            i--;
                            continue;
                        }
                        QuestionOutputDto qOutputDto = new QuestionOutputDto { QuestionID = randq.QuestionID, Title = randq.Title, Description = randq.Description, ImageURL = randq.ImageURL, QuestionType = randq.QuestionType, Topic = randq.Topic };
                        List<AnswerOutputDto> aOutputDto = new List<AnswerOutputDto>();
                        foreach (Answer answer in _dbContext.Answers.Where(e => e.Question.QuestionID == randq.QuestionID))
                        {
                            AnswerOutputDto a = new AnswerOutputDto { AnswerID = answer.AnswerID, QuestionID = answer.Question.QuestionID, AnswerType = answer.AnswerType, AnswerText = answer.AnswerText };
                            aOutputDto.Add(a);
                        }
                        qOutputDto.Answers = aOutputDto;
                        AttemptQuestion attemptq = new AttemptQuestion { Attempt = GetAttemptByID(attempt.AttemptID), Question = GetQuestionByID(randq.QuestionID), Sequence = i, Answers = new List<Answer>() };
                        AddAttemptQuestion(attemptq);
                        qOutputDto.AttemptID = attempt.AttemptID;
                        output.Add(qOutputDto);
                        topicCount++;
                        if (i >= (quiz.Length / 100.0) * percentage)
                        {
                            topic = (topic + 1) % 4;
                            topicCount = 0;
                            percentage = percentage + 30;
                        }
                        else if (validQuestions.Where(e => e.Topic == topic).Count() == topicCount)
                        {
                            topic = (topic + 1) % 4; ;
                            topicCount = 0;
                        }
                    }
                    else
                    {
                        i--;
                        topic = (topic + 1) % 4;
                        continue;
                    }
                }
            }
            return output;
        }

        public Question AddQuestion(Question question)
        {
            EntityEntry<Question> e = _dbContext.Questions.Add(question);
            _dbContext.SaveChanges();
            return e.Entity;
        }

        public void DeleteQuestion(int id)
        {
            Question q = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == id);
            if (q != null)
            {
                q.Deleted = true;
                foreach (Answer a in _dbContext.Answers.Where(e => e.Question.QuestionID == q.QuestionID))
                {
                    a.Deleted = true;
                }
                _dbContext.SaveChanges();
            }
        }

        public Question EditQuestion(EditQuestionInputDto question)
        {
            Question oldQ = _dbContext.Questions.Include(e => e.Module).FirstOrDefault(e => e.QuestionID == question.QuestionID);
            if (oldQ != null)
            {
                DeleteQuestion(oldQ.QuestionID);
                Question newQ = new Question { Module = oldQ.Module, Title = question.Title, Description = question.Description, QuestionType = oldQ.QuestionType, ImageURL = oldQ.ImageURL, Topic = question.Topic, Deleted = false };
                AddQuestion(newQ);
                _dbContext.SaveChanges();
                foreach(EditAnswerInputDto answer in question.Answers)
                {
                    AddAnswer(new Answer { Question = newQ, AnswerType = newQ.QuestionType, AnswerText = answer.AnswerText, CorrectAnswer = answer.CorrectAnswer, Feedback = answer.Feedback, Attempts = new List<AttemptQuestion>(), Deleted = false });
                }
                newQ = _dbContext.Questions.FirstOrDefault(e => e.QuestionID == question.QuestionID);
                return newQ;
            }
            return null;


        }

        public IEnumerable<Answer> GetCorrectAnswersByQID(int id)
        {
            return _dbContext.Answers.Where(e => e.Question.QuestionID == id && e.CorrectAnswer == true);
        }

        public Answer GetAnswerByID(int id)
        {
            return _dbContext.Answers.FirstOrDefault(e => e.AnswerID == id);
        }

        public Answer AddAnswer(Answer answer)
        {
            EntityEntry<Answer> a = _dbContext.Answers.Add(answer);
            _dbContext.SaveChanges();
            return a.Entity;
        }

        public void DeleteAnswer(int id)
        {
            Answer a = _dbContext.Answers.FirstOrDefault(e => e.AnswerID == id);
            if (a != null)
            {
                _dbContext.Answers.Remove(a);
                _dbContext.SaveChanges();
            }
        }

        public IEnumerable<Attempt> GetAttempts()
        {
            return _dbContext.Attempts.Include(e => e.User).Include(e => e.Quiz).ThenInclude(e => e.Module).ToList<Attempt>();
        }

        public Attempt GetAttemptByID(int id)
        {
            return _dbContext.Attempts.Include(e => e.Quiz).FirstOrDefault(e => e.AttemptID == id);
        }

        public Attempt AddAttempt(Attempt attempt)
        {
            IEnumerable<Attempt> current = GetAttempts().Where(e => e.User.UserID == attempt.User.UserID && e.Completed == "INCOMPLETE");
            if(current != null)
            {
                foreach(Attempt next in current)
                {
                    IEnumerable<AttemptQuestion> question = _dbContext.AttemptQuestions.Include(e => e.Attempt).Where(e => e.Attempt.AttemptID == next.AttemptID);
                    if (question != null)
                    {
                        foreach (AttemptQuestion aQuestion in question)
                        {
                            _dbContext.AttemptQuestions.Remove(aQuestion);
                        }
                    }
                    _dbContext.Attempts.Remove(next);
                }
            }
            EntityEntry<Attempt> at = _dbContext.Attempts.Add(attempt);
            _dbContext.SaveChanges();
            return at.Entity;
        }

        public AttemptQuestion GetAttemptQuestionBySequenceAndUserAndAttempt(int s, int u, int a)
        {
            return _dbContext.AttemptQuestions.FirstOrDefault(e => e.Attempt.User.UserID == u && e.Sequence == s && e.Attempt.AttemptID == a);
        }

        public AttemptQuestion AddAttemptQuestion(AttemptQuestion attemptQ)
        {
            EntityEntry<AttemptQuestion> atQ = _dbContext.AttemptQuestions.Add(attemptQ);
            _dbContext.SaveChanges();
            return atQ.Entity;
        }

        public QuizSubMarksDto MarkQuiz(QuizSubmissionDto submission)
        {
            QuizSubMarksDto output = new QuizSubMarksDto { Sequence = new List<int>(), SelectedCorrect = new List<List<bool>>(), SelectedFeedback = new List<List<string>>(), MissedCorrectAID = new List<List<int>>()  };
            foreach (int sequence in submission.Sequence)
            {
                List<bool> correct = new List<bool>();
                List<string> feedback = new List<string>();
                List<int> missedCorrectAID = new List<int>();
                List<int> selectedAID = new List<int>();
                Question submittedQ = GetQuestionByID(submission.QuestionID.ElementAt(sequence - 1));
                submittedQ.attemptTotal = submittedQ.attemptTotal + 1;
                foreach (int AID in submission.AnswerID.ElementAt(sequence - 1))
                {
                    selectedAID.Add(AID);
                    AttemptQuestion aQ = GetAttemptQuestionBySequenceAndUserAndAttempt(sequence, submission.UserID, submission.AttemptID);
                    aQ.Answers.ToList().Add(GetAnswerByID(AID));
                    GetAnswerByID(AID).Attempts.ToList().Add(aQ);
                    correct.Add(GetAnswerByID(AID).CorrectAnswer);
                    feedback.Add(GetAnswerByID(AID).Feedback);
                }
                foreach (Answer correctAnswer in GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1))){
                    if(selectedAID.Contains(correctAnswer.AnswerID) == false)
                    {
                        missedCorrectAID.Add(correctAnswer.AnswerID);
                    }
                }
                output.MissedCorrectAID.Add(missedCorrectAID);
                output.SelectedCorrect.Add(correct);
                output.SelectedFeedback.Add(feedback);
                output.Sequence.Add(sequence);
            }
            _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "FAIL";
            _dbContext.SaveChanges();
            double mark = 0.0;
            double count = 0.0;

            foreach (int sequence in submission.Sequence)
            {
                double multiCount = GetCorrectAnswersByQID(submission.QuestionID.ElementAt(sequence - 1)).Count();
                double multiMark = 0.0;
                count++;
                foreach (bool correct in output.SelectedCorrect.ElementAt(sequence - 1))
                {
                    if(correct == true)
                    {
                        multiMark++;
                    } else if (correct == false)
                    {
                        multiMark--;
                    }
                }
                if (multiMark == multiCount)
                {
                    Question correctQ = GetQuestionByID(submission.QuestionID.ElementAt(sequence - 1));
                    correctQ.correctTotal = correctQ.correctTotal + 1;
                    mark++;
                } 
            }

            if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Final" && mark /count >= 0.8) //PASS FINAL
            {
                
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1)};
                string certificateURL = CreateCertificate(cert, GetQuestionByID(submission.QuestionID.ElementAt(0)).Module);
                cert.CertificateURL = certificateURL;
                AddCertification(cert);
                SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for completing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz. To view your certificate for this module, please <a href = '{cert.CertificateURL}'>click here.</a> Thank you for taking the time to do the self-directed study." +
                    $"<Br><Br>If you would like feedback regarding what questions you got correct and incorrect please email us at verify.study.tms@gmail.com." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team", true);
            } 
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Final" && mark / count < 0.8) //FAIL FINAL
            {
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                SendEmail(cert.User.UserEmail, $"Failed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for attempting the" +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz.<Br>Unfortunately you did not score 80% or above in the quiz. Please revisit the training materials and attempt the final quiz again when you feel ready. " +
                    $"There is no limit to the number of times the final quiz can be attempted." +
                    $"<Br><Br>Once you have successfully passed the final quiz feel free to email verify.study.tms@gmail.com to receive feedback regarding what questions you got correct and incorrect." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team");
            }
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Practice" && mark/count >= 0.7) //PASS PRACTICE
            {
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                AddCertification(cert);
                SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for completing the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz.<Br>You can now attempt the final quiz for this module, and if you score at least 80% in the final quiz you will be emailed a certificate of completion for this training module." +
                    $"<Br><Br>Please email us at verify.study.tms@gmail.com if you have any feedback regarding the VERIFY TMS training website or quizzes." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team");
            } 
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Practice" && mark / count < 0.7) //FAIL PRACTICE
            {
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                SendEmail(cert.User.UserEmail, $"Failed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for attempting the " +
                    $"{GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz.<Br>Unfortunately you did not score 70% or above in the quiz. Please revisit the training materials and attempt the practice quiz again when you feel ready. " +
                    $"There is no limit to the number of times the practice quiz can be attempted." +
                    $"<Br><Br>Please email us at verify.study.tms@gmail.com if you have any feedback regarding the VERIFY TMS training website or quizzes." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team");
            }
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Recert" && mark / count >= 0.8) //PASS RECERT
            {
                _dbContext.Attempts.FirstOrDefault(e => e.AttemptID == submission.AttemptID).Completed = "PASS";
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = GetAttemptByID(submission.AttemptID).Quiz.Name, DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                string certificateURL = CreateCertificate(cert, GetQuestionByID(submission.QuestionID.ElementAt(0)).Module);
                cert.CertificateURL = certificateURL;
                AddCertification(cert);
                SendEmail(cert.User.UserEmail, $"Passed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for completing the " +
                    $"TMS Recertification Quiz. To view your certificate please <a href = '{cert.CertificateURL}'>click here.</a>" +
                    $"<Br><Br>This certificate should be uploaded into the TMS training placeholder in WebDCU." +
                    $"<Br><Br>Please email us at verify.study.tms@gmail.com if you have any feedback regarding the VERIFY TMS training website or quizzes." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team", true);
            } 
            else if (GetAttemptByID(submission.AttemptID).Quiz.Stage == "Recert" && mark / count < 0.8) //FAIL RECERT
            {
                Certification cert = new Certification { User = GetUserByID(submission.UserID), Type = "TMS Training Recertification", DateTime = DateTime.UtcNow, ExpiryDateTime = DateTime.UtcNow.AddYears(1) };
                SendEmail(cert.User.UserEmail, $"Failed {GetAttemptByID(submission.AttemptID).Quiz.Name} Quiz", $"Hi {cert.User.FirstName},<br><br>Thank you for attempting the " +
                    $"TMS Recertification Quiz. Unfortunately you did not score 80% or above in the quiz. Please revisit the training materials and attempt the recertification quiz again when you feel ready. " +
                    $"There is no limit to the number of times this quiz can be attempted." +
                    $"<Br><Br>Please email us at verify.study.tms@gmail.com if you have any feedback regarding the VERIFY TMS training website or quizzes." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team");
            }

            output.Score = (int)(Math.Floor((mark / count) * 100));
            return output;
        }

        public IEnumerable<User> GetUsers()
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).ToList<User>();
        }

        public User GetUserByEmail(string email)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).FirstOrDefault(e => e.UserEmail == email);
        }

        public User GetUserByID(int id)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).FirstOrDefault(e => e.UserID == id);
        }
        public IEnumerable<User> GetUserBySearch(string search)
        {
            return _dbContext.Users.Include(e => e.Role).Include(e => e.Organization).Where(e => e.UserEmail.ToLower().Contains(search.ToLower()) || e.FirstName.ToLower().Contains(search.ToLower()) || e.LastName.ToLower().Contains(search.ToLower()) || e.Role.RoleName.ToLower().Contains(search.ToLower()) || e.Organization.OrgName.ToLower().Contains(search.ToLower())).OrderBy(e => e.FirstName);
        }

        public User AddUser(User user)
        {
            EntityEntry<User> u = _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
            if (user.Role == GetRoleByID(1) || user.Organization == GetOrganizationByID(1))
            {
                SendEmail(_adminEmail, "New Clinician Registered with 'Other' Discipline or Site", $"Hi Admin,<br><br>" +
                    $"A new clinician has registered on the site and has selected the 'Other' option for either their Discipline or Site. " +
                    $"You should contact them to find out what option they wanted to select, and manually add the option to the list of Disciplines or Sites." +
                    $"<br><br>Clinician Name: {user.FirstName} {user.LastName}<br>Clinician Email: {user.UserEmail}<br>Discipline: {user.Role.RoleName}<br>" +
                    $"Site: {user.Organization.OrgName}<br><br>This is a system generated email.");
            }
            return u.Entity;
        }

        public void DeleteUser(string email)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserEmail == email);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                _dbContext.SaveChanges();
            }
        }

        public User EditUser(int id, User user)
        {
            User u = _dbContext.Users.FirstOrDefault(e => e.UserID == id);
            if (u != null)
            {
                u.FirstName = user.FirstName;
                u.LastName = user.LastName;
                u.UserEmail = user.UserEmail;
                u.Organization = user.Organization;
                u.Role = user.Role;
                _dbContext.SaveChanges();
                u = _dbContext.Users.FirstOrDefault(e => e.UserID == id);
            }
            return u;
        }

        public IEnumerable<Certification> GetAllCertificationsByUser(int id)
        {
            return _dbContext.Certifications.Include(e => e.User).ThenInclude(e => e.Organization).Include(e => e.User).ThenInclude(e => e.Role).Where(e => e.User.UserID == id);
        }

        public IEnumerable<Certification> GetCertificationByID(int id)
        {
            return _dbContext.Certifications.Include(e => e.User).ThenInclude(e => e.Organization).Include(e => e.User).ThenInclude(e => e.Role).Where(e => e.User.UserID == id && (e.Type == "InitCertification" || e.Type == "Recertification Final"));
        }

        public IEnumerable<Certification> GetCertifications()
        {
            return _dbContext.Certifications.Include(e => e.User).ThenInclude(e => e.Organization).Include(e => e.User).ThenInclude(e => e.Role);
        }

        public Certification AddCertification(Certification certification)
        {
            
            if (certification.Type == "InitCertification")
            {
                string certificateURL = CreateCertificate(certification, new Module {ModuleID = 8, Name = "Complete TMS Training Certification"});
                certification.CertificateURL = certificateURL;
                SendEmail(certification.User.UserEmail, $"You are now fully certified with the VERIFY study!", $"Hi {certification.User.FirstName},<br><br>Thank you for completing the " +
                    $"TMS Practical Test. An admin has already entered your certification status and you are now certified until {certification.ExpiryDateTime.ToString("dd/MMMM/yyyy")}." +
                    $"<Br><Br>To view your certificate for this module, <a href = '{certification.CertificateURL}'>click here.</a> This certificate should be uploaded into the TMS training placeholder in WebDCU." +
                    $"<Br><Br>To remain certified, you must complete the TMS Recertification Quiz which will become available to access via the Quiz Dashboard 1 month before the expiration date." +
                    $"<Br><Br>Thank you,<Br>VERIFY Team", true);
            }
            EntityEntry<Certification> c = _dbContext.Certifications.Add(certification);
            _dbContext.SaveChanges();
            return c.Entity;
        }

        public Certification EditCertification(Certification certification)
        {
            Certification c = _dbContext.Certifications.FirstOrDefault(e => e.CertificationID == certification.CertificationID);
            if (c != null)
            {
                c.DateTime = certification.DateTime;
                c.ExpiryDateTime = certification.ExpiryDateTime;
                _dbContext.SaveChanges();
                c = _dbContext.Certifications.FirstOrDefault(e => e.CertificationID == certification.CertificationID);
            }
            return c;
        }

        public IEnumerable<Organization> GetOrganizations()
        {
            Organization other = _dbContext.Organizations.First(r => r.OrgName == "Other");
            IEnumerable<Organization> list = _dbContext.Organizations.Where(r => r.OrgName != "Other").OrderBy(o => o.OrgName).ToList<Organization>();
            list = list.Append(other);
            return list;
        }

        public Organization GetOrganizationByID(int id)
        {
            return _dbContext.Organizations.FirstOrDefault(e => e.OrgID == id);
        }

        public Organization GetOrganizationByNameLower(string name)
        {
            return _dbContext.Organizations.FirstOrDefault(e => e.OrgName.ToLower() == name.ToLower());
        }

        public Organization AddOrganization(Organization organization)
        {
            EntityEntry<Organization> o = _dbContext.Organizations.Add(organization);
            _dbContext.SaveChanges();
            return o.Entity;
        }

        public void DeleteOrganization(Organization organization)
        {
            IEnumerable<User> usersWithOrg = _dbContext.Users.Where(u => u.Organization == organization);
            Organization other = _dbContext.Organizations.First(r => r.OrgName == "Other");
            foreach (User u in usersWithOrg)
            {
                u.Organization = other;
            }
            _dbContext.Organizations.Remove(organization);
            _dbContext.SaveChanges();
        }

        public Organization EditOrganization(Organization organization)
        {
            Organization o = _dbContext.Organizations.FirstOrDefault(e => e.OrgID == organization.OrgID);
            if (o != null)
            {
                o.OrgName = organization.OrgName;
                _dbContext.SaveChanges();
                o = _dbContext.Organizations.FirstOrDefault(e => e.OrgID == organization.OrgID);
            }
            return o;
        }

        public IEnumerable<Role> GetRoles()
        {
            Role other = _dbContext.Roles.First(r => r.RoleName == "Other");
            IEnumerable<Role> list = _dbContext.Roles.Where(r => r.RoleName != "Other").OrderBy(o => o.RoleName).ToList<Role>();
            list = list.Append(other);
            return list;
        }
        
        public Role GetRoleByID(int id)
        {
            return _dbContext.Roles.FirstOrDefault(e => e.RoleID == id);
        }

        public Role GetRoleByNameLower(string name)
        {
            return _dbContext.Roles.FirstOrDefault(e => e.RoleName.ToLower() == name.ToLower());
        }

        public Role AddRole(Role role)
        {
            EntityEntry<Role> r = _dbContext.Roles.Add(role);
            _dbContext.SaveChanges();
            return r.Entity;
        }
        
        public void DeleteRole(Role role)
        {
            IEnumerable<User> usersWithRole = _dbContext.Users.Where(u => u.Role == role);
            Role other = _dbContext.Roles.First(r => r.RoleName == "Other");
            foreach (User u in usersWithRole)
            {
                u.Role = other;
            }
            _dbContext.Roles.Remove(role);
            _dbContext.SaveChanges();
        }
        
        public Role EditRole(Role role)
        {
            Role r = _dbContext.Roles.FirstOrDefault(e => e.RoleID == role.RoleID);
            if (r != null)
            {
                r.RoleName = role.RoleName;
                _dbContext.SaveChanges();
                r = _dbContext.Roles.FirstOrDefault(e => e.RoleID == role.RoleID);
            }
            return r;
        }
        
        public bool validAdmin(string email, string password)
        {
            Admin admin = _dbContext.Admins.FirstOrDefault(e => e.Email == email && e.Password == password);
            if (admin == null)
                return false;
            else
                return true;
        }

        public IEnumerable<Admin> GetAdmins()
        {
            return _dbContext.Admins.ToList<Admin>();
        }

        public IEnumerable<Admin> SearchAdmins(string search)
        {
            return _dbContext.Admins.Where(e => e.FirstName.ToLower().Contains(search.ToLower()) || e.LastName.ToLower().Contains(search.ToLower()) || e.Email.ToLower().Contains(search.ToLower()));
        }

        public Admin GetAdminByID(int id)
        {
            return _dbContext.Admins.FirstOrDefault(e => e.AdminID == id);
        }

        public Admin GetAdminByEmail(string email)
        {
            return _dbContext.Admins.FirstOrDefault(e => e.Email == email);
        }

        public Admin AddAdmin(Admin admin)
        {
            EntityEntry<Admin> a = _dbContext.Admins.Add(admin);
            _dbContext.SaveChanges();
            return a.Entity;
        }

        public void DeleteAdminRequest(Admin requestor, Admin admin)
        {
            AdminDeleteRequest request = new AdminDeleteRequest { Admin = admin, Requestor = requestor, Expiry = DateTime.UtcNow.AddHours(1), Token = Guid.NewGuid().ToString() };
            _dbContext.AdminDeleteRequests.Add(request);
            _dbContext.SaveChanges();
            SendEmail(_adminEmail, $"Request to delete admin {admin.FirstName} {admin.LastName}", $"ACTION REQUIRED<br><br>" +
                $"A request to delete the following admin has been lodged by {requestor.FirstName} {requestor.LastName} ({requestor.Email}).<br><br>" +
                $"Please use either of the links below to approve or deny this request.<br><br>" +
                $"Admin to delete: {admin.FirstName} {admin.LastName}<br>" +
                $"Email: {admin.Email}<br><br>" +
                $"<a href='https://api.tmstrainingquizzes.com/action/ApproveAdminDelete?token={request.Token}'>Approve Request (Delete)</a><br><br>" +
                $"<a href='https://api.tmstrainingquizzes.com/action/DenyAdminDelete?token={request.Token}'>Deny Request (Do Not Delete)</a><br><br>" +
                $"If you do nothing, this request will expire within 1 hour.<br><br>" +
                $"This is a system generated email. For security reasons, do not forward.");
        }

        public void DeleteAdmin(AdminDeleteRequest request)
        {
            IEnumerable<AdminDeleteRequest> adminDeleteRequests = _dbContext.AdminDeleteRequests.Where(e => e.Admin == request.Admin);
            foreach (AdminDeleteRequest adr in adminDeleteRequests)
            {
                _dbContext.AdminDeleteRequests.Remove(adr);
            }
            _dbContext.SaveChanges();
            _dbContext.Admins.Remove(request.Admin);
            _dbContext.SaveChanges();
        }

        public void RemoveAdminDeleteRequest(AdminDeleteRequest request)
        {
            _dbContext.AdminDeleteRequests.Remove(request);
            _dbContext.SaveChanges();
        }

        public AdminOutputDto EditAdmin(AdminEditDto admin)
        {
            Admin a = _dbContext.Admins.First(e => e.AdminID == admin.AdminID);
            a.FirstName = admin.FirstName;
            a.LastName = admin.LastName;
            a.Email = admin.Email;
            _dbContext.SaveChanges();
            a = _dbContext.Admins.First(e => e.AdminID == admin.AdminID);
            AdminOutputDto newAdmin = new AdminOutputDto { AdminID = a.AdminID, FirstName = a.FirstName, LastName = a.LastName, Email = a.Email };
            return newAdmin;
        }

        public void ResetPassword(string email)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.Email == email);
            if (a != null)
            {
                Random rnd = new Random();
                a.PasswordResetToken = Convert.ToString(rnd.Next(112233,998877));
                a.ResetTokenExpires = DateTime.Now.AddMinutes(30);
                _dbContext.SaveChanges();

                SendEmail(a.Email, "Password reset request",
                    $"Hi {a.FirstName},<br><br>We have received a request to reset your password.<br><br>Reset code: {a.PasswordResetToken}" +
                    $"<br><br>This code is valid for 30 minutes.<br><br>Thank you,<br>VERIFY Team");
            }
        }

        public bool CheckPasswordReset(string token)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.PasswordResetToken == token);
            if (a != null)
            {
                if (a.ResetTokenExpires > DateTime.Now) { return true; }
                else { return false; }
            }
            else { return false; }
        }

        public bool SubmitPasswordReset(PasswordResetDto passwordResetDto)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.PasswordResetToken == passwordResetDto.Token);
            if (a != null)
            {
                if (a.ResetTokenExpires > DateTime.Now) { 
                    a.Password = BCrypt.Net.BCrypt.HashPassword(passwordResetDto.Password);
                    a.PasswordResetToken = null;
                    a.ResetTokenExpires = null;
                    _dbContext.SaveChanges();
                    return true;
                }
                else { return false; }
            }
            else { return false; }
        }

        public void SetLastAdminLogin(int id)
        {
            Admin a = _dbContext.Admins.FirstOrDefault(e => e.AdminID == id);
            a.PreviousLogin = a.LastLogin;
            a.LastLogin = DateTime.Now;
            _dbContext.SaveChanges();
        }

        public AdminDeleteRequest GetAdminDeleteRequest(string token)
        {
            return _dbContext.AdminDeleteRequests.Include(e => e.Admin).Include(e => e.Requestor).FirstOrDefault(e => e.Token == token);
        }

        public void AddEmailToSurveyEmailTable(string email)
        {
            User user = _dbContext.Users.FirstOrDefault(e => e.UserEmail == email);
            if (user == null)
            {
                SurveyEmail s = _dbContext.SurveyEmails.FirstOrDefault(e => e.Email == email);
                if (s == null)
                {
                    s = new SurveyEmail { Email = email };
                    _dbContext.SurveyEmails.Add(s);
                    _dbContext.SaveChanges();
                }
            }
            else
            {
                user.SurveyComplete = true;
                _dbContext.SaveChanges();
            }
        }

        public bool CheckSurveyEmailTable(string email, bool removeValue = false)
        {
            SurveyEmail s = _dbContext.SurveyEmails.FirstOrDefault(e => e.Email == email);
            if (s == null)
            {
                return false;
            }
            else
            {
                if (removeValue)
                {
                    _dbContext.Remove(s);
                    _dbContext.SaveChanges();
                }
                return true;
            }
        }
    }
}
