var inputText = document.getElementById('inputText')
var todoListWrapper = document.getElementById('todolist-wrapper')
var inputValue
var todoList = []

function updateTodoList() {
  todoListWrapper.innerHTML = ''
  for (var i = 0; i < todoList.length; i++) {
    var li = document.createElement('li')
    var todoText = document.createElement('input')
    var btnWrap = document.createElement('div')
    var btnEdit = document.createElement('button')
    var btnDel = document.createElement('button')
    btnWrap.className = 'todo-item-buttons'
    btnEdit.innerText = 'EDIT'
    btnEdit.className = 'edit-btn'
    btnEdit.id = 'edit-' + i
    btnDel.innerText = 'DEL'
    btnDel.id = i
    btnDel.className = 'del-btn'
    btnWrap.appendChild(btnDel)
    btnWrap.appendChild(btnEdit)
    todoText.className = 'todo-text'
    todoText.type = 'button'
    todoText.value = todoList[i]
    todoText.id = 'todo-' + i
    li.className = 'todo-item-wrap'
    li.id = i
    li.appendChild(todoText)
    li.appendChild(btnWrap)
    todoListWrapper.appendChild(li)
    btnDel.onclick = function (e) {
      todoList.splice(parseInt(e.target.id), 1)
      updateTodoList()
    }
    btnEdit.onclick = function (e) {
      var getEditText = document.getElementById('todo-' + getNumber(e.target.id))
      getEditText.type = 'text'
      getEditText.classList.add('edit')
      getEditText.onkeypress = function (e) {
        if (e.keyCode === 13) {
          todoList.splice(getNumber(e.target.id), 1, getEditText.value)
          getEditText.classList.remove('edit')
          updateTodoList()
        }
      }
      var thisBtn = e.currentTarget
      var parentEditBtn = thisBtn.parentNode
      var doneBtn = document.createElement('button')
      doneBtn.classList.add('done-btn')
      doneBtn.innerText = 'DONE'
      doneBtn.style.width = '25%'
      parentEditBtn.appendChild(doneBtn)
      thisBtn.innerText = 'SAVE'
      thisBtn.style.width = '25%'
      doneBtn.onclick = function () {
        getEditText.classList.toggle('done')
      }
      thisBtn.onclick = function () {
        thisBtn.innerText = 'EDIT'
        todoList.splice(getNumber(e.target.id), 1, getEditText.value)
        getEditText.classList.remove('edit')
        updateTodoList()
      }
    }
    li.onmousedown = function handleMouseDown(e) {
      var dragElem = e.currentTarget
      var prevElement = null
      var nextElement = null
      var dragContainer = dragElem.parentElement
      var coords = dragElem.getBoundingClientRect()
      console.log(coords)
      console.log(e.pageX)
      console.log(e.pageY)
      var shiftX = e.pageX - coords.left
      var shiftY = e.pageY - coords.top

      dragElem.style.zIndex = 2000
      dragElem.style.position = 'fixed'
      dragElem.classList.add('dragging')
      var getWidthForDragElement = getComputedStyle(todoListWrapper).width
      dragElem.style.width = getWidthForDragElement
      moveAt(e)

      function moveAt(e) {
        dragElem.style.left = e.pageX - shiftX + 'px'
        dragElem.style.top = e.pageY - shiftY + 'px'
      }

      document.onmousemove = function (e) {
        moveAt(e)
        checkInnerElements()
      }

      function checkInnerElements() {
        var elemArray = Array.from(dragContainer.children)
        var dragElemIndex = elemArray.indexOf(dragElem)
        var coords = dragElem.getBoundingClientRect()
        var prev = elemArray[dragElemIndex - 1]
        var next = elemArray[dragElemIndex + 1]
        if (next) {
          if (next.getBoundingClientRect().top < coords.top) {
            dragContainer.insertBefore(next, dragElem)
            return
          }
        }
        if (prev) {
          if (prev.getBoundingClientRect().top > coords.top) {
            dragContainer.insertBefore(dragElem, prev)
            return
          }
        }
        var allElement = document.getElementsByClassName('todo-item-wrap')
        for (var j = 0; j < allElement.length; j++) {
          allElement[j].style.marginTop = '15px'
          allElement[j].style.marginBottom = '0'
        }
        if (next !== undefined) {
          next.style.marginTop = '50px'
        } else if (prev !== undefined) {
          prev.style.marginBottom = '50px'
        }
        if (next && next != null) {
          nextElement = next
        } else if (prev && prev != null) {
          prevElement = prev
        }
      }

      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
        var allElement = dragContainer.children
        for (var f = 0; f < allElement.length; f++) {
          allElement[f].style.marginTop = '0'
          allElement[f].style.marginBottom = '0'
        }
        dragElem.style = ''
        dragElem.classList.remove('dragging')
        dragElem.style.width = ''
        updateAfterDragNDrop(dragElem.id, nextElement.id, prevElement.id)
      }
    }
  }
}


updateTodoList()

inputText.onchange = function () {
  inputValue = inputText.value
}

function addTodo(e) {
  if (inputValue === '') {
    return
  }
  e.preventDefault()
  todoList.push(inputValue)
  inputText.value = ''
  inputValue = ''
  updateTodoList()
}

function updateAfterDragNDrop(currentDragElement, next, prev) {
  var dragElement = todoList.splice(currentDragElement, 1)
  var checkIndex = next !== null
    ? next : prev
  var newTodoList = todoList.splice(0, checkIndex)
  console.log('newTodoList after checking ', newTodoList)
  newTodoList.push(dragElement[0])
  console.log('newTodoList after psuh dragElement ', newTodoList)
  for (var i = 0; i < todoList.length; i++) {
    newTodoList.push(todoList[i])
  }
  todoList = newTodoList
  console.log(todoList)
  updateTodoList()
}

function getNumber (val) {
  var result = val.split('').map(function (item) {
    if (!isNaN(parseInt(item))) {
      return item
    } else {
      return null
    }
  }).join('')
  return result
}



