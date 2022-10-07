import React from 'react';
import Card from "./Card"

function Divider(props){
    return (
        <div className={"card_divider" + (props.is_first ? " first" : "") + (props.is_active ? " active" : "")}></div>
    );
}

class Column extends React.Component {
    render() {
        let ghost_spot = this.props.ghost_spot;
        let column_list = [<Divider key={"d-1"} is_first={true} is_active={ghost_spot === -1} />];
        let tasks = this.props.tasks;
        let task_ratio = Math.round(tasks.length * 10000 / this.props.totalCards) / 100;
        let counter_text = tasks.length + " Cards | " + task_ratio + "%";
        
        for(let t in this.props.tasks){
            let task = tasks[t];
            column_list.push(
            <Card key={task.id} data={task} 
                on_mouse_down={this.props.on_mouse_down} 
                on_mouse_move={()=>{}}
                on_mouse_up={()=>{}}
            />);
            column_list.push(<Divider key={"d" + task.id} is_first={false} is_active={ghost_spot === task.id}/>)
        }


        return (
        <div className="column" ref={this.props.col_ref}>
            <div className="header">{this.props.name}</div>
            <div className="counter">{counter_text}</div>
            <div className="cards">{column_list}</div>
            <button className="add_to_column"  onClick={() => {this.props.addToColumn(this.props.colName)}} ><i className="fa-solid fa-plus"></i></button>
        </div>)
    }
}


export default Column;
