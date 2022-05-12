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
    })

    await resp.json().then((resp) => {
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
    .sort((a,b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1: 0)
    .map((el) => {
      const {text: textElement, isCheck: completed, _id: id} = el;

      const block = document.createElement("div");
      const text = document.createElement("div");
      const buttons = document.createElement("div");
      const check = document.createElement("input");
      const del = document.createElement("button");
      const edit = document.createElement("button");
      block.id = `block-${id}`;
      buttons.id = `buttons-${id}`;

      buttons.classList.add("todo__buttons");

      check.type = "checkbox";
      check.checked = completed;
      check.classList.add("todo__complete");

      edit.classList.add("todo__changed");
      edit.innerText = "Редактировать";

      del.classList.add("todo__delete");
      del.innerText = "Удалить";

      text.classList.add("todo__text");
      text.innerText = textElement;

      list.appendChild(block);
      block.appendChild(text);
      block.appendChild(buttons);
      buttons.appendChild(check);
      buttons.appendChild(edit);
      buttons.appendChild(del);

      block.className = completed ? "todo__item checked" : "todo__item";

      if (completed) {
        buttons.removeChild(edit);
      } else {
        buttons.appendChild(check);
        buttons.appendChild(edit);
        buttons.appendChild(del);
      }

      edit.onclick = () => {
        onChangeValue(id, textElement);
        buttons.removeChild(edit);
      };

      check.onclick = () => {
        onChangeCheckbox(id, completed);
      };

      del.onclick = () => {
        onDeleteTask(id);
      };
    });
};

const onChangeValue = (index, textElement) => {
  const inputTask = document.createElement("input");
  const doneButton = document.createElement("button");
  const block = document.getElementById(`block-${index}`);
  const buttons = document.getElementById(`buttons-${index}`);

  inputTask.type = "text";
  inputTask.value = textElement;
  doneButton.innerText = "Ок";
  doneButton.classList.add("todo__buttons");

  block.appendChild(inputTask);
  buttons.appendChild(doneButton);

  onchange(inputTask, index);

};

const onchange = (inputTask, index) => {
  inputTask.onchange = async(event) => {
    const resp = await fetch(`${url}/updateTask`, {
      method: 'PATCH',
      headers: headersOption,
      body: JSON.stringify({
        text: inputTask.value,
        _id: index
      })
    });

    if(resp) {
      allTasks = allTasks.map(item => {
        const newTask = {...item};
        if(item._id === index) {
          newTask.text = event.target.value;
        }
        return newTask; 
      });
      render();
    }
  };
}

const onChangeCheckbox = async (idItem, isChecked) => {
  const resp = await fetch(`${url}/UpdateTask`, {
    method: 'PATCH',
    headers: headersOption,
    body: JSON.stringify({
    _id: idItem,
    isCheck: !isChecked
    })
  });

  if(resp) {
    allTasks = allTasks.map(item => {
      const newTask = {...item}
      if(item._id === idItem) {
        newTask.isCheck = !isChecked;
      }
      return newTask;
    });
    render();
  };
};

const onDeleteTask = async (id) => {
  const resp = await fetch(`${url}/deleteTask?id=${id}`, {
    method: 'DELETE',
    headers: headersOption
  })

  if(resp){
    allTasks.forEach((item) => {
      if(item._id === id){
        allTasks.splice(id, 1);
      }
      return allTasks;
    })
  render();
  }
};

const deleteAllTasks = async () => {
  const resp = await fetch(`${url}/deleteAllTask`, {
    method: 'DELETE',
    headers: headersOption
  })
  
  if(resp){
    allTasks.forEach(item => {
      allTasks.splice(0, allTasks.length);
      return allTasks;
    })
  render();
  }
};