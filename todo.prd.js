((function () {
    const DB_STORENAME = "mytodos"
    function Todo(content) {
        return { content:content, id: Todos.getNewId(), isComplete: false}
    }
    class Todos {
        constructor(storeName) {
            this.storeName = storeName
            this.initStore()
        }
        initStore() {
            new db(this.storeName)
        }
        static getNewId() {
            let data = db.getAllFromStore(DB_STORENAME)
            data = data.length ? data : [{ id: 0 }]
            return Math.max(...data.map(i => i.id)) + 1
        }
        create(content, $component) {
            var data = db.getAllFromStore(this.storeName)
            data.push(Todo(content))
            db.saveToStore(this.storeName, data)
            $component.renderList(data)
        }
        remove(id, $component) {
            var data = db.getAllFromStore(this.storeName)
            data = data.filter(i => i.id != id)
            db.saveToStore(this.storeName, data)
            $component.renderList(data)
        }
        setIsComplete(id, state, $component) {
            var data = this.getAll()
            data = data.map(d => {
                if (d.id == id)
                    d.isComplete = state
                return d
            })
            db.saveToStore(DB_STORENAME, data)
            $component.renderList(data)
        }
        getAll() {
            return db.getAllFromStore(this.storeName)
        }
        getById(id) {
            return db.getAllFromStore(this.storeName).filter(i => i.id == id)[0]
        }
    }
    var getClass = classString => classString.indexOf(" ") != -1 ? classString.split(" ") : classString
    function todoItemTitle(title, _class) {        
        var span = document.createElement('span')
        span.innerText = title;
        span.classList.add(_class)
        return span
    }
    function todoListItem(_class, data_id, children) {
        var listItem = document.createElement('li')
        listItem.classList.add(_class)
        listItem.setAttribute('data-id', data_id)
        for (var child of children)
            listItem.appendChild(child)
        return listItem
    }
    function DivContainer(_class,buttonList) {
        var divContainer = document.createElement('div')
        typeof getClass(_class) == "string"? divContainer.classList.add(getClass(_class)): divContainer.classList.add(...getClass(_class))
        for (var btn of buttonList) {
            divContainer.appendChild(btn)
        }
        return divContainer
    }
    function buttonEl(_class, dataId, label, title) {
        var btn = document.createElement('button')
        btn.setAttribute('data-id', dataId)
        btn.innerText = label;
        btn.title = title
        typeof getClass(_class) == "string"? btn.classList.add(getClass(_class)): btn.classList.add(...getClass(_class))
        return btn
    }
    class TodosComponent {
        constructor(formId, listId, inputId) {
            this.todoForm = document.getElementById(formId)
            this.todoList = document.getElementById(listId)
            this.todoInput = document.getElementById(inputId)
            this.todoForm.onsubmit = this.onTodoFormSubmitHandler.bind(this)
            var todos = (new Todos(DB_STORENAME)).getAll()
            this.renderList(todos ? todos : [])
        }
        onTodoFormSubmitHandler(e) {
            e.preventDefault()
            this.NewTodoContent = this.todoInput.value
            this.todoInput.value = ""
            if (this.NewTodoContent.length > 0)
                (new Todos(DB_STORENAME)).create(this.NewTodoContent, this)
        }
        updateStats(data){
            var total = data.length
            var completed = data.filter(i=>i.isComplete == true).length
            completed = (completed * 100) / total
            document.querySelectorAll('.total-todos .value')[0].innerText = total
            document.querySelectorAll('.total-complete .value')[0].innerText = total == 0? "0%" : Math.round(completed) + '%'
        }
        renderList(data) {
            this.todoList.innerHTML = ""
            for (var d of data) {
                var title = todoItemTitle(d.content, `todo-item-title`)
                var controls = DivContainer(
                    "item-controls",
                    [
                        buttonEl(`todo-item-completed${d.isComplete ? " true" : ""}`, d.id, "≠", `mark ${d.isComplete?"not complete":"complete"}`), 
                        buttonEl("todo-item-remove", d.id, "X", "remove")
                    ]
                )
                var titleCon = DivContainer(`todo-title-con${d.isComplete ? " done" :""}`, [title])
                var item = todoListItem("todo-list-item", d.id, [ controls, titleCon ])
                this.todoList.appendChild(item)
            }
            this.updateStats(data)
            this.initEventHandlers()
        }
        initEventHandlers() {
            var $this = this
            var removeButtonList = document.getElementsByClassName("todo-item-remove")
            var completeButtonList = document.getElementsByClassName("todo-item-completed")
            for (let i = 0; i < removeButtonList.length; i++) {
                removeButtonList[i].addEventListener("click", function (e) {
                    (new Todos(DB_STORENAME)).remove(parseInt(removeButtonList[i].getAttribute("data-id")), $this)
                })
                completeButtonList[i].addEventListener("click", function (e) {
                    (new Todos(DB_STORENAME)).setIsComplete(parseInt(completeButtonList[i].getAttribute("data-id")), completeButtonList[i].classList.contains("true") ? false : true, $this)
                })
            }
        }
    }
    new TodosComponent("todo-input", "todo-list", "todo_text_input")
})())