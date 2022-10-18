import React from 'react';
// import ReactDOM from 'react-dom/client';
import '../styles/Board.scss';
import Column from "./Column";
import Card from "./Card";
import CardModal from './CardModal';
import Task from "../../classes/Task";
import Util from "../../classes/Util";
import Vector2 from "../../classes/Vector2";
import axios from "axios";

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
			col_refs: {
				"not_started": React.createRef(), 
				"in_progress": React.createRef(),
				"finished": React.createRef(),
			},
			task_key: 0,
			modal_class: "",
			last_modal_data: null,
			mouse_state: null,
			mouse_down_pos: {x: -1, y: -1},
			ghost_ref: React.createRef(),
			ghost_spot: {col: null, spot: null},
		};
	}

	async fetchData() {
		try {
			let result = "";
			if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
				result = await axios.get("./read_db.json");
			} else {
				result = await axios.get("./read_db.php");
			}

			let columns = Util.copy_obj(this.state.columns);
			for(let row in result.data) {
				columns = this.add_task(result.data[row].title, result.data[row].description, result.data[row].status, columns, result.data[row].id);
			}
			this.setState({columns: columns})
		} catch (error) {
		  	console.error(error);
			return;
		}
	}
	
	updateData(){
		//Read Current Columns and send it to the script
	}

	componentDidMount(){
		this.fetchData();
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
			return t;
		}
		else{
			return columns; // IMPORTANT NOW YOU HAVE TO KEEP TRACK OF TASK KEY YOURSELF!
		}
	} 
	
	handle_card_click(task){
		let columns = Util.copy_obj(this.state.columns);
		let save_task = this.state.last_modal_data;
		for(let col in columns){
			if(columns[col] == null){
				continue;
			}
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

		this.updateData();
		this.setState({columns: columns});
	}

	modal_exit(){
		let columns = Util.copy_obj(this.state.columns);
		for(let col in columns){
			if(columns[col] == null) continue;
			columns[col].modal_id(-1);
		}
		updateData();
		this.setState({columns: columns, modal_class: "modal_out"});
	}

	handle_mouse_down(task){
		let e = window.event;
		let mousePos = new Vector2(e.pageX, e.pageY);

		let rect = task.ref.current.getBoundingClientRect();
		let rel_positon = new Vector2(mousePos.x - rect.left, mousePos.y - rect.top);

		this.setState({mouse_state: {action: "down", data: task, mouse_down_pos: mousePos, current_mouse_pos: mousePos, rel_start_pos: rel_positon}});
		
	}

	handle_mouse_move(){
		if(this.state.mouse_state != null && (this.state.mouse_state.action === "down" || this.state.mouse_state.action === "move")){
			let new_state = {};
			let e = window.event;
			let mousePos = new Vector2(e.pageX, e.pageY);
			let mag = mousePos.magnitude(this.state.mouse_state.mouse_down_pos);
			
			if(mag < 20){
				return;
			}

			if(this.state.mouse_state.action === "down"){
				let new_mouse_state = Util.copy_obj(this.state.mouse_state);
				new_mouse_state.action = "move";

				new_state.mouse_state = new_mouse_state;
			}

			// Adjust ghost object
			let altPos = mousePos.substract(this.state.mouse_state.rel_start_pos);
			if(this.state.ghost_ref.current != null){
				let ghost_object = this.state.ghost_ref.current;
				ghost_object.style.top = altPos.y + 'px';
				ghost_object.style.left = altPos.x + 'px';
			}

			// Calculate possible drop position
			let columns = Util.copy_obj(this.state.columns);
			for(let n in columns) {
				let col_rect = this.state.col_refs[n].current.getBoundingClientRect();
				let is_in_col = mousePos.x - col_rect.left > 0 && mousePos.x - col_rect.right < 0;

				if(!is_in_col) {
					continue;
				}

				let task = columns[n];
				let valid_spot = -1;
				while(task){
					let rect = task.ref.current.getBoundingClientRect();
					let middle = rect.top + rect.height / 2;
					
					if(mousePos.y - middle < 0){
						break;
					}

					valid_spot = task.id;

					task = task.get_next_task();
				}
				
				new_state.ghost_spot = {col: n, spot: valid_spot};
			}
			this.setState(new_state);
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
			this.drop_card();
		}
	}

	drop_card(){
		let col = this.state.ghost_spot.col;
		let spot = this.state.ghost_spot.spot;
		let columns = Util.copy_obj(this.state.columns);
		let task = Util.copy_obj(this.state.mouse_state.data, new Task());

		if(spot === task.id){
			this.setState({mouse_state: null, ghost_spot: {col: null, spot: null}, columns: columns});
			return;
		}

		// Remove from old space
		for(let c in columns){
			if(columns[c] == null){
				continue;
			}
			columns[c] = columns[c].remove_id_task(task.id);
		}

		// Insert into new space
		if(columns[col] != null){
			if(spot === -1){
				task.next_task = columns[col];
				columns[col] = task;
			}
			else{
				columns[col].insert_task_after_id(task, spot);
			}
		}
		else{
			columns[col] = task;
			task.next_task = null;
		}

		this.updateData();
		this.setState({mouse_state: null, ghost_spot: {col: null, spot: null}, columns: columns});
	}

	handle_delete_task(task){ // TODO
		for(let col in this.state.columns){
			if(this.state.columns[col] != null){
				this.state.columns[col].remove_id_task(task.id);
			}
		}
		this.modal_exit();
	}

	handle_add_to_column(col){ // TODO
		let new_task = this.add_task("", "", col);
		this.handle_card_click(new_task);
	}

	render() {
		let task_by_status = {};
		let ColumnsDisplay = [];
		let GhostCard = null;
		let total_cards = 0;
		
		for(let col in this.state.columns){
			if(this.state.columns[col] != null){
				total_cards += this.state.columns[col].get_sorted_list().length;
			}
		}

		for(let col in this.state.columns){
			task_by_status[col] = [];

			if(this.state.columns[col] != null){
				task_by_status[col] = this.state.columns[col].get_sorted_list();
			}

			let ghost_spot = (this.state.ghost_spot.col === col) ? this.state.ghost_spot.spot : null;

			ColumnsDisplay.push(
				<Column 
					col_ref={this.state.col_refs[col]} 
					key={col} 
					name={this.state.statuses[col]} 
					colName ={col}
					tasks={task_by_status[col]} 
					on_mouse_down={this.handle_mouse_down.bind(this)} 
					ghost_spot={ghost_spot}
					addToColumn={this.handle_add_to_column.bind(this)}
					totalCards={total_cards}
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
				<CardModal 
					data={this.state.last_modal_data} 
					modal_class={this.state.modal_class} 
					onClick={this.modal_exit.bind(this)} 
					updateTask={this.update_task.bind(this)} 
					deleteTask={this.handle_delete_task.bind(this)}
				/>
				{GhostCard}
			</div>
		)
	}
}

export default Board;
