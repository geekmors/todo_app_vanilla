let data = {
    setStore:function(store){
        console.log('data.setstore invoked')
        window.localStorage.setItem(store.name,JSON.stringify(store.data))
        return this
    },
    getDataStore:function(storeName){
        if(window.localStorage.getItem(storeName)==null)
            return null
        else
            return window.localStorage.getItem(storeName)
    }
}

let todos = {
    
    getAll:()=>{
        console.log('todos.getAll invoked')
        if(data.getDataStore('mytodos')==null)
            return null
        else return JSON.parse(data.getDataStore('mytodos'))
    },
    add:(todo)=>{
        console.log('todos.add invoked')
        let _ = todos.getAll()
        if(_==null){
            todos.save([todo])
        }
        else
            todos.save([..._,todo])
        return this
    },
    getNewId:()=>{
        console.log('todos.getNewId invoked')
        let _ =  todos.getAll()
        _ = _?_:[]
        let id = 0
        for(let i = 0;i<_.length;i++){
            id = id>_[i].id?id:_[i].id
        }
        return ++id
    },
    remove:(id)=>{
        let _ = todos.getAll()
        if(_==null){
            return
        }
        else{
            
            todos.save(_.filter(_todo=>_todo.id!=id))
        }
    },
    save:(_data)=>{
        console.log('todos.save invoked')
        data.setStore({name:'mytodos',data:_data})
    },
    markTodoComplete:(id)=>{
        let _ = todos.getAll()
        if(_){
            _.map(_todo=>{
                if(_todo.id==id)
                    _todo.completed = !_todo.completed
                return _todo
            })
            todos.save(_)
        }
    }
}

let $todo_list = {
    re_render:()=>{
        $todo_list.render()
    },
    render:()=>{
        let todo_list = document.getElementById('todo-list')

        todo_list.innerHTML = ''

        let _ = todos.getAll()
        if(_){
            
            
            for(let i = 0; i<_.length;i++){
                let todoItem = $todo_list.createTodoItemNode(_[i])
                todo_list.appendChild(todoItem)
            }
        }
        let addTodo = document.getElementsByClassName('todo-form')[0]
        addTodo.addEventListener('submit',e=>{
            e.preventDefault()
            let _title = document.getElementsByClassName('todo-text-input')[0]
            if(_title.value.length!==0){

                todos.add({id:todos.getNewId(),title:_title.value,completed:false})
                $todo_list.re_render()
                _title.value = ''
            }
        })

        let removeTodoButton = document.querySelectorAll('.todo-item-remove')
        removeTodoButton.forEach(button => {
            button.addEventListener('click',function(e){
                let id = this.getAttribute('data-id')
                todos.remove(id)
                $todo_list.re_render()
            })

        });
        let completedTodoButton = document.querySelectorAll('.todo-item-completed')
        completedTodoButton.forEach(button=>{
            button.addEventListener('click',function(e){
                let id = this.getAttribute('data-id')
                console.log(id)
                todos.markTodoComplete(id)
                $todo_list.re_render()
            })

        })

    },
    createTodoItemNode:(todo)=>{
        console.log(todo)
        let todo_li = document.createElement('li')
        todo_li.classList.add('todo-list-item')
        let todo_span = document.createElement('span')
        todo_span.classList.add('todo-item-title')
        let todo_span_text = document.createTextNode(todo.title)
        todo_span.appendChild(todo_span_text)
        let todo_div = document.createElement('div')
        todo_div.classList.add('item-controls')
        let todo_button_remove = document.createElement('button')
        todo_button_remove.classList.add('todo-item-remove')
        let todo_button_remove_text = document.createTextNode('remove')
        todo_button_remove.appendChild(todo_button_remove_text)
        todo_button_remove.setAttribute('data-id',todo.id)
        let todo_button_complete = document.createElement('button')
        todo_button_complete.classList.add('todo-item-completed')
        todo_button_complete.setAttribute('data-id',todo.id)
        let todo_button_complete_text = document.createTextNode(todo.completed?'completed':'complete')
        todo_button_complete.appendChild(todo_button_complete_text)

        if(todo.completed){
            todo_span.classList.add('done')
            todo_button_complete.classList.add('true')
            todo_li.classList.add('completed')
        }

        todo_li.appendChild(todo_span)
        
        todo_div.appendChild(todo_button_remove)
        todo_div.appendChild(todo_button_complete)


        todo_li.appendChild(todo_div)
        todo_li.setAttribute('data-id',todo.id)

        return todo_li

    }
}

$todo_list.render()

document.getElementsByTagName('body')[0].style.backgroundImage='url(https://picsum.photos/'+window.innerWidth+'/'+window.outerHeight+')'
