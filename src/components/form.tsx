import {useState, Component, ReactNode} from 'react';
import './form.css'


import logo from '../logo.svg';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
  } from "recharts";
import { Interface } from 'readline';




const domain = 'https://budgetreportapi.herokuapp.com'


type expenseProp = {

}

type expenseState = {
    expense : string
    transactionDescription : string
}


type incomeState = {
    income: string
}

type incomeProp = {
    
}

interface transactionData {
    data: Array<any>
    budgetReport : Array<any>
    currentBalence : number
    isReportGen : Boolean
}






class ExpenseFormTemp extends Component<expenseProp,expenseState>{

        constructor(props : any) {
            super(props);
            this.state = {expense: '',transactionDescription:''};

            this.handleExpenseChange = this.handleExpenseChange.bind(this);
            this.handleDescChange = this.handleDescChange.bind(this);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleExpenseChange(event : any) {
            this.setState({expense: event.target.value});
        }

        handleDescChange(event : any) {
            this.setState({transactionDescription: event.target.value});
        }


        handleSubmit(event : any) {
            var body = this.state
            console.log(body)
            fetch(domain + '/createTransaction', {

                method: 'POST', 
                headers:{
                    'content-type':'application/json'
                },
                body: JSON.stringify(body)

            }).then(()=>{
                window.location.reload();
            })
        
        }


    render(): ReactNode {
        return(
            <form onSubmit={(event) => event.preventDefault()} className='form'>
                <h5 className='postCallHeading'>Report Expense</h5>
                <input type="text" className="basic-input" value = {this.state.expense} pattern="[0-9]*\.[0-9]{2}" placeholder='Expense' onChange={this.handleExpenseChange}/>
                <input type="text" className="basic-input" maxLength={50} value = {this.state.transactionDescription} placeholder='Desc.' onChange={this.handleDescChange}/>
                <button type='submit' className="submit" onClick={this.handleSubmit}>Submit</button>
            </form>
        )
    }
}




class IncomeFormTemp extends Component<incomeProp,incomeState>{
    constructor(props: any){
        super(props)

        this.state = {income:''};

        this.handleIncomeChange = this.handleIncomeChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    handleIncomeChange(event : any){
        this.setState({income: event.target.value})
    }


    handleSubmit(event : any){
        var body = this.state
        fetch(domain + '/createReport', {

            method: 'POST', 
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(body)

        })
    }

    render(): ReactNode {

        return(
            <form onSubmit={(event) => event.preventDefault()} className='form'>
                <h5 className='postCallHeading'>Report Income</h5>
                <input type="text" className="basic-input" value = {this.state.income} pattern="[0-9]*\.[0-9]{2}" placeholder='income' onChange={this.handleIncomeChange}/>
                <button type='submit' className="submit" onClick={this.handleSubmit}>Submit</button>
            </form>
        )


    }
}












export default class ReportingTool extends Component<{},transactionData>{

    constructor(props:any) {
        super(props);
    
        this.state = {data:[],budgetReport:[],currentBalence:0,isReportGen:false};

    }

    async getMonthlyTransactions(){
        var response = await fetch(domain + '/monthlyexpenses');
        var res = await response.json();
        this.setState({data: res})
    }

    calcCurrentBalence(){

        var balance = this.state.budgetReport[0].income
        for(var i = 0; i< this.state.data.length; i++){
            balance -= this.state.data[i].expense
        }
        
        this.setState({currentBalence:balance})
        this.setState({isReportGen:true})
    }

    async getBudgetReport(){
        var response = await fetch(domain + '/budgetReport');
        var res = await response.json().then((res)=>{
            this.setState({budgetReport: res})
        }).then(()=>{
            this.getMonthlyTransactions().then(()=>{
                
                this.calcCurrentBalence()
                this.render()
            })
        })
        
        
    }

    async componentDidMount() {
        await this.getBudgetReport()
    }

    render(): ReactNode {
        if(this.state.isReportGen == false)
            return null;

        var transactions = this.state
        return(


            <div className="temp">
                <div className="expenseContainer">
                <h5 className='postCallHeading'>Api Calls</h5>
                    
                    <ExpenseFormTemp></ExpenseFormTemp>

                    <IncomeFormTemp></IncomeFormTemp>
                </div>

            

                <div className='reportingTool'>
                    <div className="heading"><h2>Monthly Expense Report</h2><img src={logo} className="App-logo" alt="logo" /></div>

                    
                    

                    <div className="budgetReportContainer">
                    <h3>Budget Report</h3>
                        <table >
                            <tbody>
                            <tr>
                                <td >Budget Date</td>
                                <td >Budget</td>
                                <td >Current Balence</td>
                            </tr>

                            {transactions.budgetReport.map(data => 
                            <tr key={data.id} className='reportRow'>
                                <td className='reportField'>{data.reportDate.split('T')[0].split('-')[1]+'/'+data.reportDate.split('T')[0].split('-')[2]}</td>
                                <td className='reportField'>{data.income}</td>
                                <td className='reportField'>{this.state.currentBalence.toFixed(2)}</td>
                            </tr>)}
                            </tbody>
                        </table>
                    </div>
                    
                    <div className="expenseReportContainer">
                        <h3>Expenses</h3>
                        <table >
                            <tbody>
                            <tr>
                                <td >Transaction Date</td>
                                <td >Expense</td>
                                <td >Details</td>
                            </tr>
                            {transactions.data.map(data => 
                            <tr key={data.id} className='expenseRow'>
                                <td className='expenseField'>{data.transactionDate.split('T')[0].split('-')[1]+'/'+data.transactionDate.split('T')[0].split('-')[2]}</td>
                                <td className='expenseField'>{data.expense}</td>
                                <td className='expenseField'>{data.transactionDescription}</td>
                            </tr>)}
                            
                            </tbody>
                        </table>
            
                    </div>
                    <footer className='footer'><br /><br /></footer>
                                
                </div>

                <div style={{ width: "30vw", 
                  height: "30vh",
                  backgroundColor: "#005F6B" ,borderRadius:"10px",margin:"10vh 10vh auto"}}>

                <ResponsiveContainer width="100%" 
                                    height="100%">
                    <LineChart
                    width={500}
                    height={300}
                    
                    data={transactions.data}
                    margin={{
                        top: 40,
                        right: 40,
                        left: 40,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid />
                    <YAxis tick={{ fill: 'white' }}/>
                    <Line type="monotone" dataKey="expense" stroke="white"  strokeWidth={3} dot={{ stroke: 'red'}} />
                   
                    </LineChart>
                </ResponsiveContainer>
                </div>


            </div>
        
        )
    }
    

    
}
