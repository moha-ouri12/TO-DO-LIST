var taskNumber=0;
var taskValid=0;
var alertTimeout;
var pourcentage="0%";

document.getElementById("prr").style.width=pourcentage;
document.getElementById("topspan").textContent=taskValid+" / "+taskNumber;

function Newtask(){
    let input = document.getElementById("value").value.trim();
    document.getElementById("value").value = "";
    if (input != "") {
        document.getElementById('errorMsg').style.display="none";
        let x = document.getElementById("task");
        let y = document.createElement("div");
        y.setAttribute("class", " mt-4 d-flex flex-row p-2 diiv");
        let a = "<div  contenteditable=\"false\" onblur=\" blurdiv(this); \">" +input+ "</div>";
        let c = "<button type=\"button\" class=\"btn \" onclick=\"Edit(this)\"><i class=\"bi bi-pencil\"></i></button>";
        let b = "<button type=\"button\" class=\"btn \" onclick=\"Delete(this)\"><i class=\"bi bi-trash\"></i></button>";
        let d = "<button type=\"button\" class=\"btn \" onclick=\"validd(this)\" ><i class=\"bi bi-check-square\"></i> </button>";
        y.innerHTML = a + c + b + d;
        x.append(y);
        taskNumber += 1;
        document.getElementById("topspan").textContent=taskValid+" / "+taskNumber;
        prc();  
        savetasks();  
    }
    else{
        document.getElementById('errorMsg').style.display="block";
    }
    completedtasks();
}

function Delete(x){
    let b=false;
    if(taskNumber==taskValid){
        b=true;
    }
    if(x.nextElementSibling.getAttribute("class") =="btn btn-success"){
        taskValid -= 1;
    }
    taskNumber -=1 ;
    let y = x.parentNode;
    y.parentNode.removeChild(y);
    let z=document.getElementById("alert1");
    let h=document.getElementById("textoo");
    h.innerHTML="Task deleted";  
    if(taskValid==taskNumber && taskNumber!=0 && !b){
        h.innerHTML="Congratulations tasks completed !";
        confetti();
    }
    z.setAttribute("class","d-flex justify-content-center");
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout =setTimeout(() => {
     z.setAttribute("class","d-none justify-content-center");
     alertTimeout = null;
    }, 1500);
  
    document.getElementById("topspan").textContent=taskValid+" / "+taskNumber;
    prc();
    savetasks();
    completedtasks();
}

function validd(x){
    let a=x.previousElementSibling.previousElementSibling.previousElementSibling;
    if(x.getAttribute("class") !="btn btn-success"){
        taskValid += 1;
        x.setAttribute("class","btn btn-success");
        a.setAttribute("class","taskdiv");
    }else{ taskValid -= 1;
        x.setAttribute("class","btn ");
        a.classList.remove("taskdiv");
    }
    let z=document.querySelector("#textoo");
    if(taskValid==taskNumber){
        z.innerHTML="Congratulations tasks completed !";
        confetti();
    }
    else if(x.getAttribute("class")=="btn btn-success"){
        z.innerHTML="Task done";
    }else{
         z.innerHTML="Task not done";
    }
    z.parentNode.parentNode.setAttribute("class","d-flex justify-content-center");
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout =setTimeout(() => {
       z.parentNode.parentNode.setAttribute("class","d-none justify-content-center");
       alertTimeout = null;
    }, 1500);
    document.getElementById("topspan").textContent=taskValid+" / "+taskNumber;
    prc();
    savetasks();
    completedtasks();
}

function hideAlert(){
    document.getElementById("alert1").setAttribute("class","d-none justify-content-center");
}

function Edit(x){
    let y = x.previousElementSibling;
    y.setAttribute("contenteditable", "true");
    y.focus();
    placeCaretAtEnd(y);
}

function placeCaretAtEnd(el){
    if (typeof window.getSelection !== "undefined" && typeof document.createRange !== "undefined") {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false); // false = fin du texte
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} 

function blurdiv(x){
    x.setAttribute('contenteditable', 'false');
    x.textContent = x.textContent.trim();  
    savetasks();
}

function prc(){
    if(taskNumber!=0){
     pourcentage= taskValid*100/taskNumber+"%";
     document.getElementById("prr").style.width=pourcentage;
    }else{
        document.getElementById("prr").style.width=0;
    }
}

function completedtasks(){
    if(taskNumber==taskValid && taskNumber!=0){
       let x=document.getElementById("completed");
        x.classList.remove("d-none");
        x.addEventListener("click", ()=> {
            localStorage.clear();
            document.getElementById("task").innerHTML = "";
            taskNumber = 0;
            taskValid = 0;
            document.getElementById("topspan").textContent = taskValid + " / " + taskNumber;
            document.getElementById("prr").style.width = "0%";
            x.classList.add("d-none");
        });
    }else{ 
        document.getElementById("completed").setAttribute("class","border rounded-3 bg-white text-center d-none");
    }
}

function savetasks(){
    let tasks=[];
    let x=document.querySelectorAll("#task > div");
    x.forEach((i) => {
       let input= i.textContent.trim();
       let valid= i.querySelectorAll("button")[2].classList.contains("btn-success");
       tasks.push({input,valid});
    });
    localStorage.setItem("mytasks",JSON.stringify(tasks));
}

function loadtasks(){
    let tasks = JSON.parse(localStorage.getItem("mytasks"));
    if (!tasks || tasks.length==0) return;
    taskNumber=tasks.length;
    taskValid=tasks.filter((x)=> x.valid).length;
    tasks.forEach((x)=>{
        let z = document.getElementById("task");
        let s = document.createElement("div");
        s.setAttribute("class", " mt-4 d-flex flex-row p-2 diiv");
        let a = "<div contenteditable=\"false\" class=\"" + (x.valid ? "taskdiv" : "") + "\" onblur=\"blurdiv(this);\">" + x.input + "</div>";
        let c = "<button type=\"button\" class=\"btn \" onclick=\"Edit(this)\"><i class=\"bi bi-pencil\"></i></button>";
        let b = "<button type=\"button\" class=\"btn \" onclick=\"Delete(this)\"><i class=\"bi bi-trash\"></i></button>";
        let d = "<button type=\"button\" class=\"btn " + (x.valid ? "btn-success" : " ") + "\" onclick=\"validd(this)\" ><i class=\"bi bi-check-square\"></i> </button>";
        s.innerHTML = a + c + b + d;
        z.append(s); 
    }
    )
    document.getElementById("topspan").textContent=taskValid+" / "+taskNumber;
    prc();  
    completedtasks() 
}
document.addEventListener("DOMContentLoaded", () => loadtasks());