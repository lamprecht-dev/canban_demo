import React from 'react';
// import ReactDOM from 'react-dom/client';
import '../styles/Board.scss';
import Column from "./Column";
import Card from "./Card";
import CardModal from './CardModal';
import Task from "../../classes/Task";
import Util from "../../classes/Util";
import Vector2 from "../../classes/Vector2";


class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			statuses: {"not_started": "not started", "in_progress": "in progress", "finished": "finished"},
			columns: {
				"not_started": null, 
				"in_progress": null,
				"finished": null,
			},
			task_key: 0,
			modal_class: "",
			last_modal_data: null,
			mouse_state: null,
			mouse_down_pos: {x: -1, y: -1},
			ghost_ref: React.createRef(),
		};
	}

	componentDidMount(){
		let columns = Util.copy_obj(this.state.columns);
		columns = this.add_task("I haven't started yet", "", "not_started", columns, 0);
		columns = this.add_task("Neither have I", null, "not_started", columns, 1);
		columns = this.add_task("I am in progress", "Being doing it for a while", "in_progress", columns, 2);
		columns = this.add_task("I am done", "Yay!", "finished", columns, 3);
		columns = this.add_task("Me too", "I actually have a lot of text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vulputate dui vel scelerisque tempus. Nunc euismod pretium nisl, ac hendrerit augue elementum vel. Proin tincidunt, elit ac blandit semper, lectus ante dignissim ligula, non faucibus erat ipsum quis dui. Aenean ante dolor, hendrerit eu sollicitudin in, volutpat ac nunc. Ut placerat lacinia rhoncus. Fusce sed sem accumsan, rutrum enim vitae, elementum arcu. Vivamus at mattis enim, nec viverra ante. Aliquam porta ullamcorper dolor pulvinar congue. ", "finished", columns, 4);
		this.setState({columns: columns, task_key: this.state.task_key + 5})
	}

	add_task(title, description, status, use_columns = null, use_task_key = null) {
		let columns;
		let key = this.state.task_key;
		if(use_columns == null){
			columns = Util.copy_obj(this.state.columns);
		}
		else{
			columns = use_columns;
		}
		if(use_task_key){
			key = use_task_key;
		}

		let t = new Task(key, title, description);
		if(columns[status] == null){
			columns[status] = t;
		}
		else{
			columns[status].append_task(t);
		}
		
		if(use_columns == null){
			this.setState({columns: columns, task_key: this.state.task_key + 1});
		}
		else{
			return columns; // IMPORTANT NOW YOU HAVE TO KEEP TRACK OF TASK KEY YOURSELF!
		}
	} 
	
	handle_card_click(task){
		let columns = Util.copy_obj(this.state.columns);
		let save_task = this.state.last_modal_data;
		for(let col in columns){
			let t = columns[col].modal_id(task.id);
			if(t != null){
				save_task = t;
			}
		}
		this.setState({columns: columns, modal_class: "modal_active", last_modal_data: save_task, mouse_state: null});
	}

	update_task_data(columns, id, title = null, description = null, status = null, modal = null){
		let task_in_col = null;
		let t = null;

		// Find in which column task is and update text on spot
		for(let col in columns){
			t = columns[col].find(id);
			if(t != null){
				this.task_in_col = col;
				t.update(title, description, modal);
				break;
			}
		}

		//If the column the task is at does not match the new status, remove from old and add to new
		if(status != null && task_in_col !== status){
			columns[task_in_col].remove_id_task(id);
			columns[status].append_task(t);
		}
		return columns;
	}

	update_task(id, title = null, description = null, status = null, modal = null){
		let columns = Util.copy_obj(this.state.columns);
		columns = this.update_task_data(columns, id, title, description, status, modal);
		this.setState({columns: columns});
	}

	modal_exit(){
		let columns = Util.copy_obj(this.state.columns);
		for(let col in columns){
			columns[col].modal_id(-1);
		}
		this.setState({columns: columns, modal_class: "modal_out"});
	}

	handle_mouse_down(task){
		let e = window.event;
		let mousePos = new Vector2(e.pageX, e.pageY);

		let rect = task.ref.current.getBoundingClientRect();
		let rel_positon = new Vector2(mousePos.x - rect.left, mousePos.y - rect.top);

		this.setState({mouse_state: {action: "down", data: task, mouse_down_pos: mousePos, current_mouse_pos: mousePos, rel_start_pos: rel_positon}});
		
	}

	handle_mouse_move(event){
		if(this.state.mouse_state != null && (this.state.mouse_state.action === "down" || this.state.mouse_state.action === "move")){
			if(this.state.mouse_state.action === "down"){
				let new_mouse_state = Util.copy_obj(this.state.mouse_state);
				new_mouse_state.action = "move";

				this.setState({mouse_state: new_mouse_state});
			}

			let mousePos = new Vector2(event.pageX, event.pageY);
			let altPos = mousePos.substract(this.state.mouse_state.rel_start_pos);
			if(this.state.ghost_ref.current != null){
				this.state.ghost_ref.current.style.top = altPos.y + 'px';
				this.state.ghost_ref.current.style.left = altPos.x + 'px';
			}

			//TODO: MOVE OBJECT

			// new_mouse_state.action = "move";
			// new_mouse_state.current_mouse_pos = mousePos;
		}
	}

	handle_mouse_up(){
		if(this.state.mouse_state == null){
			return;
		}
		let e = window.event;
		let mousePos = new Vector2(e.pageX, e.pageY);
		let mag = mousePos.magnitude(this.state.mouse_state.mouse_down_pos);

		if(this.state.mouse_state.action === "down" && mag < 20){
			this.handle_card_click(this.state.mouse_state.data);
		}
		else{
			this.setState({mouse_state: null});
		}
	}

	render() {
		let task_by_status = {};
		let modal_task = null;
		let ColumnsDisplay = [];
		let GhostCard = null;

		for(let col in this.state.columns){
			if(this.state.columns[col] == null){
				task_by_status[col] = [];
				continue;
			}

			task_by_status[col] = this.state.columns[col].get_sorted_list();
			for(let t in task_by_status[col]){
				if(t.modal){
					modal_task = t;
				}
			}

			ColumnsDisplay.push(<Column key={col} name={this.state.statuses[col]} tasks={task_by_status[col]} 
				on_mouse_down={this.handle_mouse_down.bind(this)} 
				/>);
		}

		if(this.state.mouse_state != null && this.state.mouse_state.action === "move"){
			let ghost_task = this.state.mouse_state.data;
			GhostCard = <Card key={ghost_task.id} data={ghost_task} on_mouse_down={()=>{}} 
			args={{
				type: "ghost", 
				pos: this.state.mouse_state.current_mouse_pos, 
				rel_pos: this.state.mouse_state.rel_start_pos,
				ref: this.state.ghost_ref
			}}
			on_mouse_move={this.handle_mouse_move.bind(this)}
			on_mouse_up={this.handle_mouse_up.bind(this)}
			/>
		}

		return (
			<div className="wrapper">
				<div className={"canban_board " + this.state.modal_class} 
				onMouseMove={this.handle_mouse_move.bind(this)} 
				onMouseUp={this.handle_mouse_up.bind(this)} 
				>
					{ColumnsDisplay}				
				</div>
				<CardModal data={modal_task} last_data={this.state.last_modal_data} modal_class={this.state.modal_class} onClick={this.modal_exit.bind(this)}/>
				{GhostCard}
			</div>
		)
	}
}

export default Board;
