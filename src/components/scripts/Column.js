import React from 'react';
import Card from "./Card"

class Column extends React.Component {
    render() {
        return (
        <div className="column">
            <div className="header">{this.props.name}</div>
            <div className="cards">{
                this.props.tasks.map((task, id) => <Card key={task.id} data={task} 
                on_mouse_down={this.props.on_mouse_down} 
                />)
            }</div>
        </div>)
    }
}


export default Column;
