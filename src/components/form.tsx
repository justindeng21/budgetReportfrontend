import {useState, Component, ReactNode} from 'react';
import './form.css'


import logo from '../logo.svg';
import '../App.css';

var domain = 'https://budgetreportapi.herokuapp.com'

const ExpenseForm = ()=>{
    var [expense, setExpense ] = useState("")
    var [transactionDescription, setDesc] = useState("")


    function handleSubmit(){
        
        var body = {expense,transactionDescription}
        console.log(body)
        fetch(domain + '/createTransaction', {

            method: 'POST', 
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(body)

        })
    }

    return(
        <form onSubmit={(event) => event.preventDefault()} className='form'>
            <input type="text" className="basic-input" value = {expense} pattern="[0-9]*\.[0-9]{2}" placeholder='Expense' onChange={(e) => setExpense(e.target.value)}/>
            <input type="text" className="basic-input" maxLength={50} value = {transactionDescription} placeholder='Desc.' onChange={(e) => setDesc(e.target.value)}/>
            <button type='submit' className="submit" onClick={handleSubmit}>Submit</button>
        </form>
    )
}



const IncomeForm = ()=>{
    var [income, setIncome ] = useState("")


    function handleSubmit(){
        
        var body = {income}
        console.log(body)
        fetch(domain + '/createReport', {

            method: 'POST', 
            headers:{
                'content-type':'application/json'
            },
            body: JSON.stringify(body)

        })
    }

    return(
        <form onSubmit={(event) => event.preventDefault()} className='form'>
            <input type="text" className="basic-input" value = {income} pattern="[0-9]*\.[0-9]{2}" placeholder='income' onChange={(e) => setIncome(e.target.value)}/>
            <button type='submit' className="submit" onClick={handleSubmit}>Submit</button>
        </form>
    )
}







interface transactionData {
    data: Array<any>
}



export default class ReportingTool extends Component<{},transactionData>{

    constructor(props:any) {
        super(props);
    
        this.state = {data:[]};

    }

    async getMonthlyTransactions(){
        var response = await fetch(domain + '/monthlyexpenses');
        var res = await response.json();
        this.setState({data: res})
    }

    componentDidMount() {
        this.getMonthlyTransactions();
    }

    render(): ReactNode {
        var transactions = this.state
        return(

            <div className='reportingTool'>
                <div className="heading"><h2>Monthly Expense Report<img src={logo} className="App-logo" alt="logo" /></h2></div>

                
                <div className="expenseContainer">
                <h3 >Api Calls</h3>
                    <h5>Report Expense</h5>
                    <ExpenseForm></ExpenseForm>
                    <h5>Report Income</h5>
                    <IncomeForm></IncomeForm>
                </div>

                <div className="budgetReportContainer">
                <h3>Budget Report</h3>
                    <table >
                        <tbody>
                        <tr>
                            <td >Transaction Date</td>
                            <td >Expense</td>
                            <td >Details</td>
                        </tr>

                        <tr>
                            <td >12</td>
                            <td >213</td>
                            <td >Ds</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
    
                <div className="reportContainer">
                    <h3>Expenses</h3>
                    <table >
                        <tbody>
                        <tr>
                            <td >Transaction Date</td>
                            <td >Expense</td>
                            <td >Details</td>
                        </tr>
                        {transactions.data.map(data => 
                        <tr key={data.id}>
                            <td >{data.transactionDate.split('T')[0].split('-')[1]+'/'+data.transactionDate.split('T')[0].split('-')[2]}</td>
                            <td >{data.expense}</td>
                            <td >{data.transactionDescription}</td>
                        </tr>)}
                        
                        </tbody>
                    </table>
        
                </div>
                <footer>hi</footer>
        
            </div>
        
        )
    }
    

    
}
