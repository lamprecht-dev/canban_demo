import React from 'react';
import '../styles/CardModal.scss';

class CardModal extends React.Component {
	render() {
        let title = "";
        let description = "";
        if(this.props.data != null){
            title = this.props.data.title ? this.props.data.title : <span className="no_title">Add Title</span>;
            description = this.props.data.description ? this.props.data.description : <span className="no_desc">Add Description</span>;
        }
        else if(this.props.last_data != null){
                title = this.props.last_data.title ? this.props.last_data.title : <span className="no_title">Add Title</span>;
                description = this.props.last_data.description ? this.props.last_data.description : <span className="no_desc">Add Description</span>;
        }
        return (
            <div className={"modal " + this.props.modal_class}>
                <div className="modal_background" onClick={this.props.onClick}></div>
                <div className="modal_card">
                    <div className="title">{title}</div>
                    <div className="description">{description}</div>
                </div>
            </div>
        );
    }
}

export default CardModal;
