import React from 'react';

class Card extends React.Component {
    render(){
        let title = this.props.data.title ? <div className="title">{this.props.data.title}</div> : null;
        let description = this.props.data.description ? <div className="description">{this.props.data.description}</div> : null;
        let card_class = this.props.data.modal ? "card modaled" : "card";
        return (
            <div ref={this.props.data.ref} className={card_class} 
            onMouseDown={()=>{this.props.on_mouse_down(this.props.data)}} 
            >
                {title}
                {description}
            </div>
        );
    }
}


export default Card;
