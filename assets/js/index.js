const quizContainer_DOM = document.querySelector(".quiz-container1");

class Question{
    constructor(title,options,correctAnswerIndex){
        this.title = title;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
    }
    isCorrect(answer){
        //answer would be array of indices;
        return JSON.stringify(this.correctAnswerIndex) === JSON.stringify(answer);
    }
    getCorrectAnswer(){
        return this.correctAnswerIndex.map(index => this.options[index]).join("");
    }
    createQuestionUI(){
        return `
            <form action="#">
                <h2 class="title">${this.title}</h2>
                <div class="options-container">
                    ${
                        this.options.map((option,index) => {
                            return `
                                <div class="form-group flex">
                                    <input class="checkbox" type="checkbox" id="option-${index}" value="${index}" name="option">
                                    <label class="checkbox-label" for="option-${index}">${option.toUpperCase()}</label><br/>
                                </div>
                            `
                        }).join("")
                    }
                </div>
            </form>
        `
    }
}

class Quiz{
    constructor(quizContainer_DOM,allQuestions,incrementBy,decrementBy,title){

        this.createQuizLayout();

        // DOM Variables
        this.quizData_DOM = document.querySelector(".quiz-data");
        this.quizContainer_DOM = quizContainer_DOM;
        this.questionContainer_DOM = quizContainer_DOM.querySelector(".question-container");
        this.nextBtn_DOM = this.quizContainer_DOM.querySelector(".btn-next");
        this.progress_DOM = this.quizContainer_DOM.querySelector(".progress");
        this.questionNumber_DOM = this.quizContainer_DOM.querySelector(".question-number");
        this.error_DOM = this.quizContainer_DOM.querySelector(".error");
        this.table_DOM = this.quizContainer_DOM.querySelector(".table-data");
        this.tbody_DOM = this.table_DOM.querySelector("tbody");
        this.btnShare_DOM = this.table_DOM.querySelector(".btn-share");
        this.retakeQuiz_DOM = this.table_DOM.querySelector(".btn-retake");
       

        // Instance variables
        this.allQuestions = allQuestions;

      
        this.selectedOptions = [];
        this.incrementBy = incrementBy;
        this.decrementBy = decrementBy;
        this.title = title;
        this.activeQuestionIndex =  0;
        this.score = 0;
        this.totalCorrect = 0;
        this.addEventListeners()
    }

    createQuizLayout(){
        quizContainer_DOM.innerHTML = `
                <div class="quiz-data">
                    <div class="progress-container">
                        <p class="question-number"></p>
                        <progress value="10" class="progress" max="100"> </progress>
                    </div>
                    <div class="question-container container">
                        
                    </div>
                    <div class="error-next flex">
                        <div class="error"></div>
                        <button class="btn btn-next">Next</button>
                        
                    </div>
                </div>
                <div class="table-data">
                    <button class="btn btn-retake">Retake Quiz</button>
                    <a class="btn btn-share" href="#">Share</a>
                    <table>
                        <caption>
                            Result of the Quiz.
                        </caption>
                        <thead>
                            <tr>
                            <th class="first"> Question</th>
                            <th class="second">Correct Answers</th>
                            <th class="third">You Selected</th>
                            <th class="fourth">Right or Wrong</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
        `
    }

    createQuizUI(){
        this.questionContainer_DOM.innerHTML = "";
        this.questionContainer_DOM.innerHTML = this.allQuestions[this.activeQuestionIndex].createQuestionUI();
        this.updateProgressBar();
    }



    createTable(){
       this.quizData_DOM.style.display = "none";
       this.table_DOM.style.display = "block";

       this.tbody_DOM.innerHTML = `
            ${this.allQuestions.map((question,index) => {
                return `
                    <tr>
                        <td class="first">
                            ${question.title}
                        </td>
                        <td class="second">
                            ${question.correctAnswerIndex.map(index => question.options[index]).join(",")}
                        </td>
                        <td class="third">
                            ${this.selectedOptions[index].map(index => question.options[index]).join(",")}
                        </td> 
                        <td class="fourth">
                            ${question.isCorrect(this.selectedOptions[index]) ? `<i class='far fa-check-circle'></i>` : `<i class='far fa-times-circle'></i>`}
                        </td>
                    </tr>
                `
            }).join("")}
       `
       this.tbody_DOM.innerHTML += `
            <td class="table-summary" colspan="2">
                Total Correct : ${this.totalCorrect}
            </td>
            <td class="table-summary" colspan="2">
                Score : ${this.score}
            </td>
       `

       if(this.score >= 7 ){
        this.btnShare_DOM.href = `https://twitter.com/intent/tweet/?text=Hey%20I%20scored%20${encodeURIComponent((this.score / this.allQuestions.length) * 100)}%25%20in%20How%20well%20do%20you%20know%20${encodeURIComponent(this.title)}.%20Find%20out%20yours%2C%20take%20the%20quiz%20here&url=${encodeURIComponent("https://tender-lamarr-0b111e.netlify.app/")}`;
        this.btnShare_DOM.style.display = "block";
    } else {
        this.btnShare_DOM.style.display = "none";
       }
    }

    nextQuestion(){
       if(this.activeQuestionIndex < this.allQuestions.length - 1){
        this.activeQuestionIndex++;
       
       
        this.createQuizUI();
       } else {
          //On Reaching the last question, need to create a table.

          this.createTable();
        }
    }

    updateProgressBar(){
        this.questionNumber_DOM.innerHTML = `${this.activeQuestionIndex + 1} / ${this.allQuestions.length}`;
        this.progress_DOM.value = (this.activeQuestionIndex + 1) / this.allQuestions.length * 100;
    }

    updateScore(isCorrect){
        if(isCorrect){
            this.totalCorrect++;
            this.score = this.score + this.incrementBy;
        } else {
            this.score = this.score - this.decrementBy;
        }

    }

    addEventListeners(){


        this.nextBtn_DOM.addEventListener("click",(e) => {
            const answer_DOM = this.quizContainer_DOM.querySelectorAll('input[name=option]:checked');
            if(!answer_DOM.length){
                this.error_DOM.innerHTML = "Please select atleast one of the option!"
                return;
            }
            this.error_DOM.innerHTML = "";
            const answers = [...answer_DOM].map(answer => +answer.value);
           
            //Store the selected options
            this.selectedOptions.push(answers);
            
            const currentQuestion = this.allQuestions[this.activeQuestionIndex];
            
            //Verify whether the answers are right
            const isCorrect = currentQuestion.isCorrect(answers);
            this.updateScore(isCorrect);
            
            this.nextQuestion();
            
        })

        this.retakeQuiz_DOM.addEventListener("click",() => {
            window.location.replace("./index.html");
            localStorage.removeItem("quizAppLocalStorageData");
        })
    }
}


// Create Question Instance;
function createQuestionInstances(questions){
    return questions.map(question => new Question(question.title,question.options,question.correctAnswerIndex))
}


window.addEventListener("load",() => {
    let quizAppLocalStorageData = JSON.parse(localStorage.getItem("quizAppLocalStorageData"));
    if(!quizAppLocalStorageData?.quizId) window.location.replace("./index.html");

    const quizQuestionsData = quizData.find(quiz => quiz.quizId === +quizAppLocalStorageData.quizId);
    
    
   

    
    const quiz = new Quiz(quizContainer_DOM,createQuestionInstances(quizQuestionsData.questions),1,0.25,quizQuestionsData.quizTitle);
    
    quiz.createQuizUI();
})