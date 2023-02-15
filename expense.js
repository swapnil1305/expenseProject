async function addNewExpense(e){
    try{
        e.preventDefault();

        const expenseDetails = {
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value,
        }
        console.log(expenseDetails);
        const token = localStorage.getItem('token')
        const response = await axios.post('http://localhost:4000/expense/addexpense', expenseDetails, { headers: {'Authorization': token} })
                addNewExpenseToUI(response.data.expenseDetails)
        }catch(err){
            console.log(err)
            document.body.innerHTML += `<div style="color:red;">${err}<div>`;
        }
    }

     window.addEventListener('DOMContentLoaded', () => {
        const token = localStorage.getItem('token')
        axios.get('http://localhost:4000/expense/getexpense', { headers: {'Authorization': token} }).then(response => {
            response.data.expenses.forEach(expense => {
                addNewExpenseToUI(expense);
            })
        }).catch(err => console.log(err))
     });


function addNewExpenseToUI(expense){
    const parentElement = document.getElementById('listOfExpenses');
    const expenseElemId = `expense-${expense.id}`;
    parentElement.innerHTML += `<li id=${expenseElemId}>${expense.amount}-${expense.description}-${expense.category}
    <button onclick='deleteExpense(event, ${expense.id})'>Delete Expense</button>
    </li>`
}
async function deleteExpense(e, expenseid) {
    try{
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`,{ headers: {'Authorization': token} })
    removeExpenseFromScreen(expenseid);
  }catch(err){console.log(err)}
    }

    function removeExpenseFromScreen(expenseid){
        const expenseElemId = `expense-${expenseid}`;
        document.getElementById(expenseElemId).remove();
    }