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

        }).then(()=>{
            setExpense('')
            setDesc('')
            window.location.reload();
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
    budgetReport : Array<any>
    currentBalence : number
    isReportGen : Boolean
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
                            <td >Income</td>
                            <td >Current Balence</td>
                        </tr>

                        {transactions.budgetReport.map(data => 
                        <tr key={data.id}>
                            <td >{data.reportDate.split('T')[0].split('-')[1]+'/'+data.reportDate.split('T')[0].split('-')[2]}</td>
                            <td >{data.income}</td>
                            <td >{this.state.currentBalence.toFixed(2)}</td>
                        </tr>)}
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
                <footer className='footer'></footer>
                            
            </div>
        
        )
    }
    

    
}
