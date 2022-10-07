import React from 'react';
import '../styles/CardModal.scss';

class CardModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            edit_title: false,
            edit_description: false,
            title_ref: React.createRef(),
            desc_ref: React.createRef(),
            desc_height: 100,
        }
    }

    handle_title_click(el){
        this.setState({edit_title: true}, ()=>{
            this.state.title_ref.current.firstChild.focus();
        });
    }

    handle_title_edited(){
        let new_text = this.state.title_ref.current.firstChild.value;
        this.props.updateTask(this.props.data.id, new_text, null, null, null);
        this.setState({edit_title: false});
    }

    handle_desc_click(el){
        this.setState({edit_description: true}, ()=>{
            this.state.desc_ref.current.firstChild.focus();
            this.update_desc_height();
        });
    }

    update_desc_height(){
        this.setState({desc_height: 0}, ()=>{
            this.setState({desc_height: this.state.desc_ref.current.firstChild.scrollHeight - 10})
        })
    }

    handle_desc_edited(){
        let new_text = this.state.desc_ref.current.firstChild.value;
        this.props.updateTask(this.props.data.id, null, new_text, null, null);
        this.setState({edit_description: false});
    }

    exit_modal(e){
        this.setState({edit_title: false, edit_description: false});
        this.props.onClick(e);
    }

	render() {
        let title = "";
        let description = "";
        let desc_style = {height: this.state.desc_height+"px"};
        
        if(this.props.data != null){
            if(this.state.edit_title){
                title = <input defaultValue={this.props.data.title} onBlur={this.handle_title_edited.bind(this)} />
            }
            else{
                title = this.props.data.title ? this.props.data.title : <span className="no_title">Add Title</span>;
            }
            
            if(this.state.edit_description){
                description = <textarea defaultValue={this.props.data.description} onBlur={this.handle_desc_edited.bind(this)} onInput={this.update_desc_height.bind(this)} style={desc_style}/>
            }
            else{
                description = this.props.data.description ? this.props.data.description : <span className="no_desc">Add Description</span>;
            }
        }

        return (
            <div className={"modal " + this.props.modal_class}>
                <div className="modal_background" onClick={this.exit_modal.bind(this)}></div>
                <div className="modal_card">
                    <div className="modal_delete"><i className="fa-solid fa-trash" onClick={()=>{this.props.deleteTask(this.props.data)}}></i></div>
                    <div className="title" ref={this.state.title_ref} onClick={this.handle_title_click.bind(this)}>{title}</div>
                    <div className="description" ref={this.state.desc_ref} onClick={this.handle_desc_click.bind(this)}>{description}</div>
                </div>
            </div>
        );
    }
}

export default CardModal;
