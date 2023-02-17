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

document.getElementById("rzp-button1").onclick = async function(e){
    const token = localStorage.getItem('token')
    const response = await axios.get('http://localhost:4000/purchase/premiummembership',{ headers: {"Authorization" : token}})
    console.log(response);
    var options = 
    {
        "key_id": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('http://localhost:4000/purchase/updatetransactionstatus',{
               order_id: options.order_id,
               payment_id: response.razorpay_payment_id,
            },{headers: {"Authorization": token }})

            alert('You are a Premium User Now')
        },
    };

const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed', function (response){
    console.log(response);
    alert('Something went wrong')
})
}

