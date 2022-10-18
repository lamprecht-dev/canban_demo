import React from 'react';

class Task{
    constructor(id = null, title = null, description = null, next_task = null){
        this.id = id;
        this.title = title ? title : null;
        this.description = description ? description : null;
        this.modal = false;
        this.next_task = next_task;
        this.ref = React.createRef();
    }   

    set_next_task(next_task){
        this.next_task = next_task;
    }

    get_next_task(){
        return this.next_task
    }

    get_task(n){
        if(n === 0){
            return this;
        }
        if (this.next_task == null){
            return null;
        }
        return this.next_task.get_task(n - 1);
    }

    // Similar to set_next_task, but here we add this one and push all the others behind it
    insert_next_task(task){
        task.next_task = this.next_task;
        this.next_task = task;
    }

    insert_n_task(task, n){
        if(n === 0){
            this.insert_next_task(task);
            return true;
        }
        if(this.next_task == null){
            return false;
        }
        return this.next_task.insert_n_task(task, n - 1);
    }

    insert_task_after_id(task, id){
        if(this.id === id){
            task.next_task = this.next_task;
            this.next_task = task;
            return true;
        }
        if(this.next_task == null){
            return false;
        }
        return this.next_task.insert_task_after_id(task, id);
    }

    append_task(task){
        if(this.next_task == null){
            this.next_task = task;
            return true;
        }
        return this.next_task.append_task(task);
    }

    update(title = null, description = null, modal = null){
		this.title = title != null ? title : this.title;
		this.description = description != null ? description : this.description;
		this.modal = modal != null ? modal : this.modal;
    }

    find(id){
        if(this.id === id){
            return this;
        }
        if(this.next_task == null){
            return null;
        }
        return this.next_task.find(id);
    }

    remove_n_task(n){
        if(n === 0){
            return this.next_task;
        }
        if(this.next_task != null){
            this.next_task = this.next_task.remove_n_task(n - 1);
        }
        
        return this;
    }

    remove_id_task(id){
        if(this.id === id){
            return this.next_task;
        }
        if(this.next_task != null){
            this.next_task = this.next_task.remove_id_task(id);
        }
        
        return this;
    }

    // Turns modal of id on, all others off
    modal_id(id){
        let return_task = null;
        if(this.next_task != null){
            return_task = this.next_task.modal_id(id);
        }

        if(this.id === id){
            this.modal = true;
            return this;
        }

        this.modal = false;   
        return return_task;
    }

    get_sorted_list(){
        let next_items = [];

        if(this.next_task != null){
            next_items = this.next_task.get_sorted_list();
        }

        return [this, ...next_items];
    }
}

export default Task;