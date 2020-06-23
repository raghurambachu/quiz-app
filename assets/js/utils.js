// function randomQuizIdGenerator(len = 10){
//     let pattern = "q";
//     for(let i = 0; i < len; i++){
//         pattern += Math.floor(Math.random() * len)
//     }
//     return pattern;
// }

const quizCardHolder_DOM = document.querySelector(".quiz-card-holder");
let quizAppLocalStorageData = JSON.parse(localStorage.getItem("quizAppLocalStorageData")) || {};



class QuizCard{
    constructor(quizCardHolder_DOM,quizData){
        this.quizCardHolder_DOM = quizCardHolder_DOM;
        this.quizData = quizData;
        this.quizCategories = [...new Set(quizData.map(quizObj => quizObj.category))];
        this.functionHandlers();
    }
    createQuizPageLayout(){
        this.quizCardHolder_DOM.innerHTML = "";
        this.quizCardHolder_DOM.innerHTML = `
            ${
                this.quizCategories.map(category => {
                    let filterQuizData = this.quizData.filter(quizCardData => quizCardData.category === category )
                    return `
                        <div class="quiz-category">
                        <h3>${category.toUpperCase()}</h3>
                            <div class="flex quiz-category-container">
                            ${
                                filterQuizData.map(quizCardData => {
                                    return `
                                        <article class="quiz-card flex">
                                            <div class="quiz-image-holder">
                                                <img src=${quizCardData.quizImage} alt="${quizCardData.quizTitle}">
                                            </div>
                                            <div class="quiz-info-content flex">
                                                <h3 class="quiz-title">${quizCardData.quizTitle}</h3>
                                                <p class="quiz-description">${quizCardData.quizDescription}</p>
                                                <button data-id="${quizCardData.quizId}" class="btn btn-take-quiz">Take This Quiz</button>
                                            </div>
                                        </article>
                                    `
                                }).join("")
                            }
                            </div>
                        </div>
                    `
                }).join("")
            }
        `
    }

    handleClickOnBtnTakeQuiz(e){
        if(!e.target.closest(".btn-take-quiz"))return;
        let btnTakeQuiz = e.target.closest(".btn-take-quiz");
        const getQuizId = btnTakeQuiz.dataset.id;
      
        quizAppLocalStorageData["quizId"] = getQuizId;
        
        localStorage.setItem("quizAppLocalStorageData",JSON.stringify(quizAppLocalStorageData));
        window.location.href = "./quiz.html";
    }

    functionHandlers(){
        this.createQuizPageLayout();

        document.body.addEventListener("click",(e) => {
            this.handleClickOnBtnTakeQuiz(e)
        })

    }
        
    
}

const quizCards = new QuizCard(quizCardHolder_DOM,quizData)