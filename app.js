class Task {
    constructor(title) {
        this.title = title;
    }

    addElement(title) {
        if (title.length === 0) {
            alert("Podaj nowe zadanie");
        } else {
            fetch('https://projekt1-11e1d.firebaseio.com/todo.json', {
                method: "POST",
                body: JSON.stringify({value: title})
            }).then(function (response) {
                if (response.ok) {
                    todoStore.loadList();
                }
            });
        }
    }
}

function Store() {

    this.loadList = loadList;
    this.listener = listener;
    this.removeElement = removeElement;

    window.onload = loadList;

    function isEmptyList(listFromFireBase) {
        return Object.keys(listFromFireBase).length === 0;
    }

    function _fillList(content) {
        let lista = document.getElementById('elements');
        lista.innerText = '';

        for (let taskid in content) {
            let taskElement = document.createElement('button');
            taskElement.classList.add('btn');
            taskElement.classList.add('btn-outline-info');
            taskElement.innerText = content[taskid].value + "";
            let taskRemoveButton = document.createElement('button');
            taskRemoveButton.id = (taskid);
            taskRemoveButton.classList.add('close');
            taskRemoveButton.innerHTML = "<span aria-hidden=\"true\">&times;</span>";
            taskElement.appendChild(taskRemoveButton);
            taskRemoveButton.style.display = 'none';
            lista.appendChild(taskElement);
            document.getElementById(taskid).addEventListener('click', function () {
                removeElement(taskid);
            });
        }
        let getBTN = document.getElementsByClassName('btn-outline-info');
        for (let i = 0; i < getBTN.length; i++) {
            getBTN[i].addEventListener('mouseover', function () {
                getBTN[i].children[0].style.display = "inline-block"
            });
            getBTN[i].addEventListener('mouseout', function () {
                getBTN[i].children[0].style.display = "none"
            })
        }
    }

    function loadList() {
        fetch('https://projekt1-11e1d.firebaseio.com/todo.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (json) {
                if (isEmptyList(json)) {
                    json = {0: {value: "Nothing TODO"}}
                }
                _fillList(json);
            });
    }

    function listener() {
        document.querySelector("#todoForm").addEventListener("submit", function (event) {
            event.preventDefault();
            let name = document.querySelector("#add-new-element").value;
            window[name] = new Task(document.querySelector("#add-new-element").value);
            window[name].addElement(name);
            document.querySelector("#add-new-element").value = '';
        })
    }

    function removeElement(idOfElement) {
        fetch(`https://projekt1-11e1d.firebaseio.com/todo/${idOfElement}.json`, {
            method: "DELETE",
        }).then(function () {
            loadList();
        });
    }

    listener()
}

let todoStore = new Store();


