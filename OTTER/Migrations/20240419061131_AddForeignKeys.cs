using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OTTER.Migrations
{
    /// <inheritdoc />
    public partial class AddForeignKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttemptAnswers");

            migrationBuilder.RenameColumn(
                name: "Organization",
                table: "Users",
                newName: "OrganizationOrgID");

            migrationBuilder.RenameColumn(
                name: "Module",
                table: "Quizzes",
                newName: "ModuleID");

            migrationBuilder.RenameColumn(
                name: "Module",
                table: "Questions",
                newName: "ModuleID");

            migrationBuilder.RenameColumn(
                name: "Module",
                table: "Certifications",
                newName: "ModuleID");

            migrationBuilder.RenameColumn(
                name: "Question",
                table: "AttemptQuestions",
                newName: "QuestionID");

            migrationBuilder.RenameColumn(
                name: "Attempt",
                table: "AttemptQuestions",
                newName: "AttemptID");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "Length",
                table: "Quizzes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "Feedback",
                table: "Answers",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<int>(
                name: "QuestionID",
                table: "Answers",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "AnswerAttemptQuestion",
                columns: table => new
                {
                    AnswersAnswerID = table.Column<int>(type: "INTEGER", nullable: false),
                    AttemptsAttemptQID = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnswerAttemptQuestion", x => new { x.AnswersAnswerID, x.AttemptsAttemptQID });
                    table.ForeignKey(
                        name: "FK_AnswerAttemptQuestion_Answers_AnswersAnswerID",
                        column: x => x.AnswersAnswerID,
                        principalTable: "Answers",
                        principalColumn: "AnswerID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnswerAttemptQuestion_AttemptQuestions_AttemptsAttemptQID",
                        column: x => x.AttemptsAttemptQID,
                        principalTable: "AttemptQuestions",
                        principalColumn: "AttemptQID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_OrganizationOrgID",
                table: "Users",
                column: "OrganizationOrgID");

            migrationBuilder.CreateIndex(
                name: "IX_Quizzes_ModuleID",
                table: "Quizzes",
                column: "ModuleID");

            migrationBuilder.CreateIndex(
                name: "IX_Questions_ModuleID",
                table: "Questions",
                column: "ModuleID");

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_ModuleID",
                table: "Certifications",
                column: "ModuleID");

            migrationBuilder.CreateIndex(
                name: "IX_Certifications_UserID",
                table: "Certifications",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_Attempts_QuizID",
                table: "Attempts",
                column: "QuizID");

            migrationBuilder.CreateIndex(
                name: "IX_Attempts_UserID",
                table: "Attempts",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_AttemptQuestions_AttemptID",
                table: "AttemptQuestions",
                column: "AttemptID");

            migrationBuilder.CreateIndex(
                name: "IX_AttemptQuestions_QuestionID",
                table: "AttemptQuestions",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_Answers_QuestionID",
                table: "Answers",
                column: "QuestionID");

            migrationBuilder.CreateIndex(
                name: "IX_AnswerAttemptQuestion_AttemptsAttemptQID",
                table: "AnswerAttemptQuestion",
                column: "AttemptsAttemptQID");

            migrationBuilder.AddForeignKey(
                name: "FK_Answers_Questions_QuestionID",
                table: "Answers",
                column: "QuestionID",
                principalTable: "Questions",
                principalColumn: "QuestionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AttemptQuestions_Attempts_AttemptID",
                table: "AttemptQuestions",
                column: "AttemptID",
                principalTable: "Attempts",
                principalColumn: "AttemptID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AttemptQuestions_Questions_QuestionID",
                table: "AttemptQuestions",
                column: "QuestionID",
                principalTable: "Questions",
                principalColumn: "QuestionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attempts_Quizzes_QuizID",
                table: "Attempts",
                column: "QuizID",
                principalTable: "Quizzes",
                principalColumn: "QuizID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Attempts_Users_UserID",
                table: "Attempts",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Certifications_Modules_ModuleID",
                table: "Certifications",
                column: "ModuleID",
                principalTable: "Modules",
                principalColumn: "ModuleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Certifications_Users_UserID",
                table: "Certifications",
                column: "UserID",
                principalTable: "Users",
                principalColumn: "UserID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Modules_ModuleID",
                table: "Questions",
                column: "ModuleID",
                principalTable: "Modules",
                principalColumn: "ModuleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Quizzes_Modules_ModuleID",
                table: "Quizzes",
                column: "ModuleID",
                principalTable: "Modules",
                principalColumn: "ModuleID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Organizations_OrganizationOrgID",
                table: "Users",
                column: "OrganizationOrgID",
                principalTable: "Organizations",
                principalColumn: "OrgID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Answers_Questions_QuestionID",
                table: "Answers");

            migrationBuilder.DropForeignKey(
                name: "FK_AttemptQuestions_Attempts_AttemptID",
                table: "AttemptQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_AttemptQuestions_Questions_QuestionID",
                table: "AttemptQuestions");

            migrationBuilder.DropForeignKey(
                name: "FK_Attempts_Quizzes_QuizID",
                table: "Attempts");

            migrationBuilder.DropForeignKey(
                name: "FK_Attempts_Users_UserID",
                table: "Attempts");

            migrationBuilder.DropForeignKey(
                name: "FK_Certifications_Modules_ModuleID",
                table: "Certifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Certifications_Users_UserID",
                table: "Certifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Modules_ModuleID",
                table: "Questions");

            migrationBuilder.DropForeignKey(
                name: "FK_Quizzes_Modules_ModuleID",
                table: "Quizzes");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Organizations_OrganizationOrgID",
                table: "Users");

            migrationBuilder.DropTable(
                name: "AnswerAttemptQuestion");

            migrationBuilder.DropIndex(
                name: "IX_Users_OrganizationOrgID",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Quizzes_ModuleID",
                table: "Quizzes");

            migrationBuilder.DropIndex(
                name: "IX_Questions_ModuleID",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Certifications_ModuleID",
                table: "Certifications");

            migrationBuilder.DropIndex(
                name: "IX_Certifications_UserID",
                table: "Certifications");

            migrationBuilder.DropIndex(
                name: "IX_Attempts_QuizID",
                table: "Attempts");

            migrationBuilder.DropIndex(
                name: "IX_Attempts_UserID",
                table: "Attempts");

            migrationBuilder.DropIndex(
                name: "IX_AttemptQuestions_AttemptID",
                table: "AttemptQuestions");

            migrationBuilder.DropIndex(
                name: "IX_AttemptQuestions_QuestionID",
                table: "AttemptQuestions");

            migrationBuilder.DropIndex(
                name: "IX_Answers_QuestionID",
                table: "Answers");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Length",
                table: "Quizzes");

            migrationBuilder.DropColumn(
                name: "QuestionID",
                table: "Answers");

            migrationBuilder.RenameColumn(
                name: "OrganizationOrgID",
                table: "Users",
                newName: "Organization");

            migrationBuilder.RenameColumn(
                name: "ModuleID",
                table: "Quizzes",
                newName: "Module");

            migrationBuilder.RenameColumn(
                name: "ModuleID",
                table: "Questions",
                newName: "Module");

            migrationBuilder.RenameColumn(
                name: "ModuleID",
                table: "Certifications",
                newName: "Module");

            migrationBuilder.RenameColumn(
                name: "QuestionID",
                table: "AttemptQuestions",
                newName: "Question");

            migrationBuilder.RenameColumn(
                name: "AttemptID",
                table: "AttemptQuestions",
                newName: "Attempt");

            migrationBuilder.AlterColumn<string>(
                name: "Feedback",
                table: "Answers",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "AttemptAnswers",
                columns: table => new
                {
                    Question = table.Column<int>(type: "INTEGER", nullable: false),
                    Answer = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttemptAnswers", x => new { x.Question, x.Answer });
                });
        }
    }
}
