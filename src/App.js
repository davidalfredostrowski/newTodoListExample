
// problem 1: cannot initalize contract and correspondingly invoke methods
// immediately or it will not work
// problem 2: I cannot update in real-time without pushing 'up' 
// note: i cannot push up with 'props'


import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
//import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'
import TodoListAbi from './contractsData/TodoList.json'
import TodoListAddress from './contractsData/TodoList-address.json'
import TodoList from './TodoList'

class App extends Component {
        componentWillMount(){
                this.loadBlockchainData()
        }


        async loadBlockchainData(){

  let NewTodoListAbi = require('./contractsData/TodoList.json');
  console.log("TodoListAbi", TodoListAbi )

		const web3 = new Web3(new Web3.providers.HttpProvider("http://ec2-54-186-118-40.us-west-2.compute.amazonaws.com:8545"))
    var account;
   const accounts  = await web3.eth.getAccounts()


        console.log("account", accounts[0])
        this.setState({ account: accounts[0] })
        const todoList  = new web3.eth.Contract(NewTodoListAbi.abi);
        console.log("todoList", todoList)


	todoList.options.address = TodoListAddress.address;
        //todoList.methods.createTask("junk").send({ from: this.state.account })
  
        console.log("todoList.options.address", todoList.options.address)
        this.setState( { todoList } ) 
// gives as contract error since it needs more time to be registered.


		//     let val = await this.state.todoList.methods.createTask("junk").send({ from: this.state.account } )



//        todoList.methods.createTask("junk").send({ from: this.state.account } ).once('receipt', (receipt) => {
   //   this.setState({ loading: false })
  //  })




		this.setState({ todoList })

        const taskCount = await todoList.methods.taskCount().call()
        console.log("todoList", todoList)
        this.setState( {taskCount} )
        for (var i = 1;i <= taskCount; i++){
                const task = await todoList.methods.tasks(i).call()
               this.setState({
                        tasks: [...this.state.tasks,task]
                })
        }
       console.log("tasks", this.state.tasks)
        }
 



	constructor(props){
                super(props)
                this.state = {account: '',
                taskCount: 0,
                tasks: []
                }


    this.createTask = this.createTask.bind(this)
    this.toggleCompleted = this.toggleCompleted.bind(this)



  }

state = { visible: true
};


  createTask(content) {
    this.setState({ loading: true })
    this.state.todoList.methods.createTask(content).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
                
    console.log("content" , content)

	  this.setState({
                        tasks: [...this.state.tasks,content]
                })
          
// this does it one submit too late......
          console.log("this.state.tasks1", this.state.tasks )



	  this.setState({ tasks: [...this.state.tasks,"junk"] })




          console.log("this.state.tasksi2", this.state.tasks ) 

  }

  toggleCompleted(taskId) {
    this.setState({ loading: true })
    this.state.todoList.methods.toggleCompleted(taskId).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }





       render() {
                return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
        { this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <TodoList
                  tasks={this.state.tasks}
                  createTask={this.createTask}
                  toggleCompleted={this.toggleCompleted} />
              }
            </main>
          </div>
        </div>
      </div>
                );
        }
}

export default App;

