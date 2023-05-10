import {useState, Component, ReactNode} from 'react';
import './form.css'


import logo from '../logo.svg';
import '../App.css';
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
            <h5 className='postCallHeading'>Report Expense</h5>
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
            <h5 className='postCallHeading'>Report Income</h5>
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


            <div className="temp">
                <div className="expenseContainer">
                <h5 className='postCallHeading'>Api Calls</h5>
                    
                    <ExpenseForm></ExpenseForm>

                    <IncomeForm></IncomeForm>
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
                    <Tooltip/>
                    <Legend />
                    <Line type="monotone" dataKey="expense" stroke="white"  strokeWidth={3} dot={{ stroke: 'red'}} />
                   
                    </LineChart>
                </ResponsiveContainer>
                </div>


            </div>
        
        )
    }
    

    
}
