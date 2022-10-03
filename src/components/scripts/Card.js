import React from 'react';

class Card extends React.Component {
    render(){
        let title = this.props.data.title ? <div className="title">{this.props.data.title}</div> : null;
        let description = this.props.data.description ? <div className="description">{this.props.data.description}</div> : null;
        let card_class = "card";
        let ref = this.props.data.ref;

        let alt_pos = {x: 0, y: 0};
        if(this.props.args){
            let args = this.props.args;
            if(args.type === "ghost"){
                card_class += " ghost";
                alt_pos = args.pos.substract(args.rel_pos);
                ref = args.ref;
            }
        }

        return (
            <div ref={ref} className={card_class} 
            onMouseDown={()=>{this.props.on_mouse_down(this.props.data)}} 
            onMouseMove={this.props.on_mouse_move}
            onMouseUp={this.props.on_mouse_up}
            style={{top: alt_pos.y+'px', left: alt_pos.x+'px'}}
            >
                {title}
                {description}
            </div>
        );
    }
}


export default Card;
