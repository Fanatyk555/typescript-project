import { Button, Checkbox, List, ListItem, ListItemText, TextField } from '@material-ui/core';
import React from 'react';
import axios from 'axios';
import './App.css';

interface AppProps {}
interface AppState {
  inputText: string;
  toDoList: Array<object>,
  between: object
}

class App extends React.Component<AppProps, AppState>{
  state={
    inputText: "",
    toDoList: [{id:"",value:"",active:true}],
    between: {min:0,max:20}
  }
  componentDidMount(){
    setInterval(() => {
      this.getList();
    }, 1000);
  }
  getList = () => {
    fetch("http://192.168.0.3:9000/getList")
      .then(res => res.json())
      .then(res => this.setState({ toDoList: res }));
  }
  handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: e.target.value})
  }
  handleClick = () => {
    const data = [this.state.inputText, true];
    axios
      .post('http://192.168.0.3:9000/addQuest', data)
      .catch(err => console.error(err));
    this.setState({ inputText: "" })
  }
  handleDeleteActive = (id: string) => {
    const data=[id];
    axios
      .post('http://192.168.0.3:9000/deleteQuest', data)
      .catch(err => console.error(err));
  }
  handleChangeState = (id:string, active:boolean) => {
    const data=[id, active];
    axios
      .post('http://192.168.0.3:9000/updateQuest', data)
      .catch(err => console.error(err));
  }
  handleRender3000 = () => {
    for(let i=1;i<=3000;i++){
      const data = [i, true];
      axios
        .post('http://192.168.0.3:9000/addQuest', data)
        .catch(err => console.error(err));
      }
  }
  handleMove = (where: any) => {
    if(where==="back") this.setState({between: {min: this.state.between.min-20, max: this.state.between.max-20}});
    else if(where==="next") this.setState({between: {min: this.state.between.min+20, max: this.state.between.max+20}});
    else return null;
  }
  render(){
    const {inputText, toDoList, between} = this.state
    const activeList = toDoList.map((item, index)=>(between.min<=index&&index<between.max)?
      <ListItem key={index} className="quest" selected={!item.active}>
        <ListItemText>{item.value}</ListItemText>
        <Checkbox className="test" checked={!item.active} color="primary" onChange={()=>this.handleChangeState(item.id, item.active)}/>
        <Button variant="contained" color="primary" size="small" onClick={()=>this.handleDeleteActive(item.id)}>Usuń</Button>
      </ListItem>:null)
    return(
      <>
        <TextField
          label="Dodaj zadanie"
          placeholder="Placeholder"
          multiline
          onChange={this.handleInput} 
          value={inputText}
          style={{ margin: 8 }}
        />
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          style={{ margin:8 }} 
          onClick={this.handleClick}>
            Dodaj
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          style={{ margin:8 }} 
          onClick={this.handleRender3000}>
            3000 zadań
        </Button>
        <List dense style={{ margin: 8 }}>
          {activeList}
        </List>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          style={{ margin:10 }} 
          onClick={()=>this.handleMove("back")}>
            Przewiń wstecz
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          style={{ margin:10 }} 
          onClick={()=>this.handleMove("next")}>
            Przewiń dalej
        </Button>
      </>
    )
  }
}

export default App;
