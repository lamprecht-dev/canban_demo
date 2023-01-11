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
            title: null,
            description: null,
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
        this.setState({edit_title: false, title: new_text});
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
        this.setState({edit_description: false, description: new_text});
    }

    exit_modal(){
        this.setState({edit_title: false, edit_description: false, title: null, description: null});
        this.props.onClick();
    }

	render() {
        let title = "";
        let description = "";
        let desc_style = {height: this.state.desc_height+"px"};
        let title_data = this.state.title ?? (this.props.data ? this.props.data.title : null);
        let description_data = this.state.description ?? (this.props.data ? this.props.data.description: null);
        
        if(this.props.data != null){
            if(this.state.edit_title){
                title = <input defaultValue={title_data} onBlur={this.handle_title_edited.bind(this)} />
            }
            else{
                title = title_data ?? <span className="no_title">Add Title</span>;
            }
            
            if(this.state.edit_description){
                description = <textarea defaultValue={description_data} onBlur={this.handle_desc_edited.bind(this)} onInput={this.update_desc_height.bind(this)} style={desc_style}/>
            }
            else{
                description = description_data ?? <span className="no_desc">Add Description</span>;
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
