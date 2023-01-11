import React from 'react';

class Card extends React.Component {
    render(){
        let title = this.props.data.title ? this.props.data.title : 'Untitled';
        let shortened_desc = null;
        if(this.props.data.description != null){
            let max_length = 200;
            if(this.props.data.description.length > max_length){
                shortened_desc = this.props.data.description.substring(0, max_length) + " . . . ";
            }
            else{
                shortened_desc = this.props.data.description;
            }
        }

        let description = shortened_desc ? <div className="description">{shortened_desc}</div> : null;

        let card_class = "card";
        let ref = this.props.data.ref;

        if(this.props.args){
            let args = this.props.args;
            if(args.type === "ghost"){
                card_class += " ghost";
                ref = args.ref;
            }
        }

        return (
            <div ref={ref} className={card_class} 
            onMouseDown={()=>{this.props.on_mouse_down(this.props.data)}} 
            onMouseMove={this.props.on_mouse_move}
            onMouseUp={this.props.on_mouse_up}
            >
                <div className="title">{title}</div>
                {description}
            </div>
        );
    }
}


export default Card;
