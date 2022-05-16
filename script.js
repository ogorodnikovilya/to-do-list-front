let allTasks = [];
let inputEnterTask = null;
let textTask = "";
const url = 'http://localhost:8080';
const headersOption = {
  'Content-type':'application/json;charset=utf-8',
  'Access-Control-Allow-Origin': '*'
};

window.onload = async() => {
  const resp = await fetch(`${url}/allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks = result.data;
  render();
};

const addTask = async () => {
  inputEnterTask = document.querySelector(".todo-list__input-value");
  textTask = inputEnterTask.value;

  if (textTask.length > 0) {
    const resp = await fetch(`${url}/createTask`, {
      method: 'POST',
      headers: headersOption,
      body: JSON.stringify({
        text: textTask,
        isCheck: false
      })
    });

    await resp.json().then(resp => {
      allTasks.push(resp);
      render();

      textTask = "";
      inputEnterTask.value = "";
    })
  } else {
    alert("Вы ввели пустую задачу");
  };
};

const render = () => {
  const list = document.querySelector(".todo__items");

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  };

  allTasks
    .sort((a, b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0)
    .forEach(el => {
      const {text, isCheck, _id} = el;

      const block = document.createElement("div");
      const textInTask = document.createElement("div");
      const buttons = document.createElement("div");
      const check = document.createElement("input");
      const deleteBtn = document.createElement("button");
      const edit = document.createElement("button");
      block.id = `block-${_id}`;
      buttons.id = `buttons-${_id}`;

      buttons.classList.add("todo__buttons");

      check.type = "checkbox";
      check.checked = isCheck;
      check.classList.add("todo__complete");

      edit.classList.add("todo__changed");
      edit.innerText = "Редактировать";

      deleteBtn.classList.add("todo__delete");
      deleteBtn.innerText = "Удалить";

      textInTask.classList.add("todo__text");
      textInTask.innerText = text;

      list.appendChild(block);
      block.appendChild(textInTask);
      block.appendChild(buttons);
      buttons.appendChild(check);
      buttons.appendChild(edit);
      buttons.appendChild(deleteBtn);

      block.className = isCheck ? "todo__item checked" : "todo__item";

      if (isCheck) {
        buttons.removeChild(edit);
      } else {
        buttons.appendChild(check);
        buttons.appendChild(edit);
        buttons.appendChild(deleteBtn);
      }

      edit.onclick = () => {
        onChangeValue(_id, text);
        buttons.removeChild(edit);
      };

      check.onclick = () => {
        onChangeCheckbox(_id, isCheck);
      };

      deleteBtn.onclick = () => {
        onDeleteTask(_id);
      };
    });
};

const onChangeValue = (id, text) => {
  const inputTask = document.createElement("input");
  const doneButton = document.createElement("button");
  const block = document.getElementById(`block-${id}`);
  const buttons = document.getElementById(`buttons-${id}`);

  inputTask.type = "text";
  inputTask.value = text;
  doneButton.innerText = "Ок";
  doneButton.classList.add("todo__buttons");

  block.appendChild(inputTask);
  buttons.appendChild(doneButton);

  doneButton.onclick = () => {
    saveChange(inputTask, id)
  };

};

// Используются PATCH-запросы потому, что PATCH-запросы позволяют изменять отдельные поля в объекте, не меняя те поля, которые мы не передаем, в случае же
// PUT-запроса, если мы не передаем какое-то из полей в очередном запросе, то это поле будет удалено из БД

const saveChange = async(inputTask, id) => {
  const resp = await fetch(`${url}/updateTask`, {
    method: 'PATCH',
    headers: headersOption,
    body: JSON.stringify({
      text: inputTask.value,
      _id: id
    })
  });

  if(resp) {
    allTasks = allTasks.map(item => {
      const newTask = {...item};
      if(item._id === id) {
        newTask.text = inputTask.value;
      }
      return newTask; 
    });
  }
  render();
}

const onChangeCheckbox = async (idItem, isChecked) => {
  const resp = await fetch(`${url}/updateTask`, {
    method: 'PATCH',
    headers: headersOption,
    body: JSON.stringify({
      _id: idItem,
      isCheck: !isChecked
    })
  });

  if(resp) {
    allTasks = allTasks.map(item => {
      const newTask = {...item};
      if(item._id === idItem) {
        newTask.isCheck = !isChecked;
      }
      return newTask;
    });
  };
  render();
};

const onDeleteTask = async (id) => { 
  const resp = await fetch(`${url}/deleteTask/?id=${id}`, {
    method: 'DELETE', 
  });   
  const response = await resp.json();
  allTasks = response;
  render();
};

const deleteAllTasks = async () => {
  const resp = await fetch(`${url}/deleteAllTask`, {
    method: 'DELETE',
    headers: headersOption
  });
  
  if(resp){
    allTasks = [];
  };
  render();
};