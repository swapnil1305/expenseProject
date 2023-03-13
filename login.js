async function login(e){
    try{
    e.preventDefault();

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(loginDetails);
    const response = await axios.post('http://43.207.56.110:4000/user/login', loginDetails)
            alert(response.data.message)
            console.log(response.data)
            localStorage.setItem('token', response.data.token)
            window.location.href = "./expense.html"
}catch(err){
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}<div>` ;
    }
}

function forgotpassword() {
    window.location.href = "./forgotPass.html"
}
