import '../components/form.css'
import ReportingTool  from '../components/form';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component, ReactNode } from 'react';

type loginState = {
    username: string
    password: string
}

type loginProp = {

}

class LoginForm extends Component<loginProp,loginState>{

    constructor(props : any) {
        super(props);
        this.state = {username: '',password:''};

        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleUserNameChange(event : any) {
        this.setState({username: event.target.value});
    }

    handlePasswordChange(event : any) {
        this.setState({password: event.target.value});
    }


    handleSubmit(event : any) {
        var body = this.state
        fetch('https://budgetreportapi.herokuapp.com' + '/auth', {

            method: 'POST', 
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(body)

        }).then((res)=>{
            if(res['status'] == 204){
                window.location.href  = 'https://budgetreportfrontend.herokuapp.com/reportingtool'
            }
        })
    }


    render(): ReactNode {
        return(
            <form onSubmit={(event) => event.preventDefault()} className='form'>
                <h5 className='postCallHeading'>Login</h5>
                <input type="text" className="basic-input" value = {this.state.username} placeholder='Username' onChange={this.handleUserNameChange}/>
                <input type="password" className="basic-input" maxLength={50} value = {this.state.password} placeholder='Password' onChange={this.handlePasswordChange}/>
                <button type='submit' className="submit" onClick={this.handleSubmit}>Submit</button>
            </form>
        )
    }
}



class ReportingToolPage extends Component{
    render(): ReactNode {
        return (
        
            <div className="App">
            <header className="App-header">
                
                <ReportingTool></ReportingTool>
            </header>
    
           
            </div>
        );
    }
}


class LoginPage extends Component{
    render(): ReactNode {
        return(
            <div className="App">
            <header className="App-header">
                
                <LoginForm></LoginForm>
            </header>
    
           
            </div>
        )
    }
}



function App() {



    return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>}>
            <Route path='/ReportingTool' element={<ReportingToolPage/>}></Route>
            
          </Route>
        </Routes>
    </BrowserRouter>
    )



}





export default App;
