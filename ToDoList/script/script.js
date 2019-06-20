//global variable
// max length of task text
let maxLength = 250;
// last sort method
let sortedBy;
// indicator and variable for current object for deletion func
let indicator, objForDel;

// date option for small screen
let dateOptions;
if (window.innerWidth < 480){
    dateOptions = {
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
} else {
    dateOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
}



document.addEventListener("DOMContentLoaded", function () {
    // start display existed tasks
    // import taskList from local storage
    let taskList = JSON.parse(localStorage.getItem("taskList"));
    let listLength;
    let currentId; // variable for current id

    // if there is no taskList in local storage
    if (!taskList || taskList.length === 0) {
        // create empty list
        taskList = [];
        // and add it to local storage
        localStorage.setItem("taskList", JSON.stringify(taskList));
        // set value length of list and current id to zero
        listLength = 0;
        currentId = 0;
    } else {
        // saving values of element number and id of the last element
        listLength = taskList.length;
        currentId = taskList[ listLength - 1].id + 1;
    }

    // take each object of the list and display it
    for (let i =0; i <= listLength; i++) {
        let currentTask = taskList[i];
        if (currentTask) {
            displayListItem(currentTask)
        }
    }

    // add new task handler
    let addButton = document.getElementById("newTask"),
        inputField = document.querySelector(".inputBlock__text");

    // focus on input field
    inputField.focus();

    inputField.addEventListener("keypress", function () {
        if (event.which === 13) {
            addButton.click();
        }
    });
    addButton.addEventListener("click", function () {
        let text = inputField.value;
        // check the input and if all right create new task
        validate(text, currentId);
        // clear input field
        inputField.value = "";
        // return focus on input field
        inputField.focus();
        // sequence number for the next line
        currentId++;
    });

    // bind event handler to other buttons
    // bind handler to buttons on confirmation window
    // "NO"
    document.querySelector(".confirm__button_no").addEventListener("click", function () {
        document.querySelector(".cover").style.display = "none";
        document.querySelector(".confirm").style.display = "none";
        indicator = false;
    });
    // "YES"
    document.querySelector(".confirm__button_yes").addEventListener("click", function () {
        document.querySelector(".cover").style.display = "none";
        document.querySelector(".confirm").style.display = "none";
        indicator = true;
    });

    // bind event handler on sort buttons
    let dateSortButton = document.querySelector(".dateSort"),
        prioritySortButton = document.querySelector(".prioritySort"),
        textSortButton = document.querySelector(".textSort"),
        statusSortButton = document.querySelector(".statusSort");

    dateSortButton.addEventListener("click", function () {
        sortList(1);
    });
    prioritySortButton.addEventListener("click", function () {
        sortList(2);
    });
    textSortButton.addEventListener("click", function () {
        sortList(3);
    });
    statusSortButton.addEventListener("click", function () {
        sortList(4);
    });

    // bind event handler on search buttons
    let searchField = document.querySelector(".searchBlock__text");

    searchField.addEventListener("input", function () {
        search(this.value);
    });

});



function validate(formValue, currentId) {
    // check for existence
    if (!formValue) {
        alert(`type something`)
    }
    //type check
    else if (typeof(formValue) != "string") {
        alert(`it is not s string`);
    }
    // length check
    else if (formValue.length < 0 && formValue.length > 250) {
        alert("type form 1 to 250 characters")
    }
    // create a new task
    else {
        addTask(formValue, currentId);
    }
}

function addTask(taskText, currentId) {
    // current state of task list
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // current date
    let currentDate = new Date();

    //priority
    let priority = 1;

    //status
    let status = 0;

    // prepare data
    let newTask = {
        "id": currentId,
        "curDate": currentDate,
        "priority": priority,
        "task": taskText,
        "status": status
    };

    displayListItem(newTask);

    taskList.push(newTask);
    // add created object to local storage
    localStorage.setItem("taskList", JSON.stringify(taskList));

}

function dateNormalizer(dateString) {
    let currentDate = new Date(dateString);

    // date and time display options
    // let options = {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric',
    //     hour: 'numeric',
    //     minute: 'numeric',
    //     second: 'numeric',
    // };
    return currentDate.toLocaleString("ru", dateOptions);

}

function displayListItem(currentObject) {

    let currentDate = dateNormalizer(currentObject.curDate);
    if (currentObject) {
        //create new list item of four columns
        let li = document.createElement("li");
        li.className = "listBody__row";
        li.id = currentObject.id;

        // first column
        let colDate = document.createElement("div"),
            time = document.createElement("time");
        colDate.className = "listBody__colDate";

        ////attach date in tag time
        time.innerText = currentDate;

        //// attach tag <time> in the first column
        colDate.appendChild(time);

        //second column
        let colPriority = document.createElement("div"),
            priorityValue = document.createElement("div"),
            priorityControl = document.createElement("div"),
            arrowUpImg = document.createElement("img"),
            arrowDownImg = document.createElement("img"),
            arrowUpButton = document.createElement("button"),
            arrowDownButton = document.createElement("button");

        //// arrow Up tag formation
        arrowUpImg.src = "svg/up-arrow.svg";
        arrowUpImg.alt = "up";
        arrowUpImg.classList.add("listBody__colPriorityArrow");
        arrowUpButton.classList.add("listBody__colPriorityArrow_up");
        arrowUpButton.appendChild(arrowUpImg);

        //// arrow Down tag formation
        arrowDownImg.src = "svg/down-arrow.svg";
        arrowDownImg.alt = "down";
        arrowDownImg.classList.add("listBody__colPriorityArrow");
        arrowDownButton.classList.add("listBody__colPriorityArrow_down");
        arrowDownButton.appendChild(arrowDownImg);

        //// priority value tag formation
        priorityValue.className = "listBody__colPriorityValue";
        priorityValue.innerText = currentObject.priority;

        //// priority control tag formation
        priorityControl.className = "listBody__colPriorityControl";
        priorityControl.appendChild(arrowUpButton);
        priorityControl.appendChild(arrowDownButton);

        //// col priority tag formation
        colPriority.className = "listBody__colPriority";
        colPriority.appendChild(priorityValue);
        colPriority.appendChild(priorityControl);

        // third column
        let colTask = document.createElement("div"),
            editButton = document.createElement("button"),
            editButtonImg = document.createElement("img"),
            colText = document.createElement("p");

        //// text tag formation
        colText.className = "listBody__colTask_text";
        colText.contentEditable = "true";
        colText.innerText = currentObject.task;

        //// button tag formation
        editButtonImg.src = "svg/edit.svg";
        editButtonImg.alt = "edit";
        editButtonImg.className = "listBody__colTask_editButtonImg";
        editButton.className = "listBody__colTask_editButton";
        editButton.appendChild(editButtonImg);

        //// task tag formation
        colTask.className = "listBody__colTask";
        colTask.appendChild(colText);
        colTask.appendChild(editButton);

        // fourth column
        let colStatus = document.createElement("div"),
            doneButton = document.createElement("button"),
            doneImg = document.createElement("img"),
            delButton = document.createElement("button"),
            delImg = document.createElement("img");

        //// delete button pict tag formation
        delImg.src = "svg/del.svg";
        delImg.alt = "delete";

        //// delete button tag formation
        delButton.className = "delButton";
        delButton.appendChild(delImg);

        //// done button pict tag formation
        doneImg.src = "svg/done.svg";
        doneImg.alt = "done";

        //// dene button tag formation
        doneButton.className = "doneButton";
        doneButton.appendChild(doneImg);

        //// fourth column tag formation
        colStatus.className = "listBody__colStatus";
        colStatus.appendChild(doneButton);
        colStatus.appendChild(delButton);

        // glue the whole list item
        li.appendChild(colDate);
        li.appendChild(colPriority);
        li.appendChild(colTask);
        li.appendChild(colStatus);

        // find out the status of the line
        if (currentObject.status === 1){
            li.classList.add("done")
        }

        // bind event handler to buttons
        bindButtonEvent(li);

        // display the finished line
        document.getElementById("listBody").prepend(li);
    }
}

function editItem() {
    let currentId = this.closest("li").id;

    // set the caret position
    let range = document.createRange(),
        selection = window.getSelection(),
        currentElement = this;

    range.setStart(currentElement, 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    // currentElement.focus();

    // scroll to the caret position
    this.scrollTop = this.scrollHeight - this.clientHeight;


    this.addEventListener("keypress", function () {
        if (event.which === 13) {
            this.blur();
        }
        else if (this.innerText.length >= maxLength) {
            event.preventDefault();
        }
    });

    this.addEventListener("blur", function () {
        let newTask = this.innerText;

        if (newTask.length > maxLength){
            newTask = newTask.substring(0, maxLength);
        }
        // import object from localStorage
        let taskList = JSON.parse(localStorage.getItem("taskList"));

        // find current item in local storage
        for (let i=0; i < taskList.length; i++) {
            if (taskList[i].id === +currentId){
                taskList[i].task = newTask;
            }
        }
        // add updated object to local storage
        localStorage.setItem("taskList", JSON.stringify(taskList));

        // return scroll to top
        this.scrollTop = 0;
    });


}


function deleteItem(obj) {
    if (indicator){
        // current line
        let currentItem = obj.closest("li");
        let currentId = currentItem.id;

        // delete current list item
        ////fade out animation
        currentItem.style.opacity = "0";
        ////smooth rise animation
        setTimeout(function () {
            currentItem.style.height = "0";
        }, 100);
        //// delete item after animation
        setTimeout(function () {
            currentItem.parentNode.removeChild(currentItem)
        }, 200);

        //delete current task in localStorage
        //// import object's list from localStorage
        let taskList = JSON.parse(localStorage.getItem("taskList"));

        //// find current item in object's list
        for (let i = 0; i < taskList.length; i++) {

            if (taskList[i].id === +currentId) {
                taskList.splice(i, 1);
            }
        }
        //// add updated object to local storage
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }

}

function waitForConfirm() {

    if (indicator === undefined) {
        setTimeout(waitForConfirm, 500);
        console.log("wait");
    } else {
        deleteItem(objForDel);
        objForDel = undefined;
    }
}

function changeStatus (){
    // current line
    let currentItem = this.closest("li");
    let currentId = currentItem.id;

    // change status on page
    if (currentItem.classList.contains("done")) {
        currentItem.classList.remove("done");
    } else {
        currentItem.classList.add("done")
    }

    // change status on local storage
    // import object from localStorage
    let taskList = JSON.parse(localStorage.getItem("taskList"));

    // find current item in local storage
    for (let i=0; i < taskList.length; i++) {

        if (taskList[i].id === +currentId && taskList[i].status === 0){
            taskList[i].status = 1;
        } else if (taskList[i].id === +currentId && taskList[i].status === 1){
            taskList[i].status = 0;
        }
    }

    // add updated object to local storage
    localStorage.setItem("taskList", JSON.stringify(taskList));

}

function changePriority(obj, difference) {

    let currentItem = obj.closest("li"),
        itemId = +currentItem.id,
        priorityField = currentItem.getElementsByClassName("listBody__colPriorityValue")[0],
        priorityValue = priorityField.innerText,
        newPriority = +priorityValue + difference;

    // validate new priority value
    if (newPriority > 0 && newPriority < 100) {
        priorityField.innerText = newPriority;

        // import object from localStorage
        let taskList = JSON.parse(localStorage.getItem("taskList"));

        // find current item in local storage
        for (let i=0; i < taskList.length; i++) {
            if (taskList[i].id === itemId){
                //save changes
                taskList[i].priority = newPriority;
            }
        }
        // add updated object to local storage
        localStorage.setItem("taskList", JSON.stringify(taskList));
    }
}

function bindButtonEvent(currentLine) {
    //buttons variable
    let delButton = currentLine.querySelector(".delButton"),
        doneButton = currentLine.querySelector(".doneButton"),
        edit = currentLine.querySelector(".listBody__colTask_text"),
        editButton = currentLine.querySelector(".listBody__colTask_editButton"),
        upButton = currentLine.querySelector(".listBody__colPriorityArrow_up"),
        downButton = currentLine.querySelector(".listBody__colPriorityArrow_down");


    //buttons event
    //// deletion
    delButton.addEventListener("click", function (){
        // reset the indicator
        indicator = undefined;
        // save current object
        objForDel = this;

        // display confirmation window
        document.querySelector(".cover").style.display = "block";
        document.querySelector(".confirm").style.display = "flex";
        document.querySelector(".confirm__button_yes").focus();
        waitForConfirm();
    });

    //// done/not done task
    doneButton.addEventListener("click", changeStatus);

    ////edit task
    edit.addEventListener("focus", editItem);

    editButton.addEventListener("click", function () {
       this.previousSibling.focus();
    });


    //// rise priority
    upButton.addEventListener("click", function () {
        changePriority(this, 1);
    });

    ////lower priority
    downButton.addEventListener("click", function () {
        changePriority(this, -1);
    });
}


function sortList (sortingMethod) {
    // import object from localStorage
    let taskList = JSON.parse(localStorage.getItem("taskList")),
        listLength = taskList.length;

    // first method is sort by date
    if (sortingMethod === 1) {
        if (sortingMethod !== sortedBy) {
            taskList.sort(function (a, b) {
                let dateA = new Date(a.curDate), dateB = new Date(b.curDate);
                return dateA - dateB;
            });
        sortedBy = sortingMethod;

        } else {
            taskList.sort(function (a, b) {
                let dateA = new Date(a.curDate), dateB = new Date(b.curDate);
                return dateB - dateA;
            });
        sortedBy = undefined;
        }
    }
    // second method - sort by priority
    else if (sortingMethod === 2) {
        if (sortingMethod !== sortedBy) {
            taskList.sort(function (a, b) {
                return a.priority - b.priority;
            });
        sortedBy = sortingMethod;

        } else {
            taskList.sort(function (a, b) {
                return b.priority - a.priority;
            });
        sortedBy = undefined;

        }
    }
    // third method - sort by task text
    else if (sortingMethod === 3) {
        if (sortingMethod !== sortedBy) {
            taskList.sort(function (a, b) {
                let textA = a.task.toLowerCase(), textB = b.task.toLowerCase();
                return textA.localeCompare(textB);
            });
        sortedBy = sortingMethod;

        } else {
            taskList.sort(function (a, b) {
                let textA = a.task.toLowerCase(), textB = b.task.toLowerCase();
                return textB.localeCompare(textA);
            });
        sortedBy = undefined;

        }
    }
    // fourth method - sort by task text
    else if (sortingMethod === 4) {
        if (sortingMethod !== sortedBy) {
            taskList.sort(function (a, b) {
                return a.status - b.status;
            });
        sortedBy = sortingMethod;
        } else {
            taskList.sort(function (a, b) {
                return b.status - a.status;
            });
        sortedBy = undefined;
        }
    }
    localStorage.setItem("taskList", JSON.stringify(taskList));

    document.querySelector(".listBody").innerHTML = "";

    for (let i =0; i <= listLength; i++) {
        let currentTask = taskList[i];
        if (currentTask) {
            displayListItem(currentTask)
        }
    }
}

function search(str) {
    // import object from localStorage
    let taskList = JSON.parse(localStorage.getItem("taskList")),
        listLength = taskList.length;

    // if search line is not empty
    if (str !== ""){
        // cleaning the space for output
        document.querySelector(".listBody").innerHTML = "";
        // display search result
        for (let i =0; i < listLength; i++) {

            let currentTask = taskList[i].task.toLowerCase(),
                searchStr = str.toLowerCase();

            if (currentTask.indexOf(searchStr, 0) !== -1) {
                displayListItem(taskList[i])
            }
        }

    } else {
        document.querySelector(".listBody").innerHTML = "";
        for (let i =0; i < listLength; i++) {
            displayListItem(taskList[i])
        }
    }

}