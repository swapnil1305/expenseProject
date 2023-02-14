async function addNewExpense(e){
    try{
        e.preventDefault();

        const expenseDetails = {
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        }
        console.log(expenseDetails);
        const response = await axios.post('http://localhost:4000/expense/addexpense', expenseDetails)
                addNewExpenseToUI(response.data.expenseDetails)
        }catch(err){
            console.log(err)
            document.body.innerHTML += `<div style="color:red;">${err}<div>`;
        }
    }
     window.addEventListener('DOMContentLoaded', () => {
        axios.get('http://localhost:4000/expense/getexpense').then(response => {
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
        await axios.delete(`http://localhost:4000/expense/deleteexpense/${expenseid}`)
    removeExpenseFromScreen(expenseid);
  }catch(err){console.log(err)}
    }

    function removeExpenseFromScreen(expenseid){
        const expenseElemId = `expense-${expenseid}`;
        document.getElementById(expenseElemId).remove();
    }
