async function login(e){
    try{
    e.preventDefault();
    console.log(e.target.name.value);

    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    console.log(loginDetails);
    const response = await axios.post('http://localhost:4000/user/login', loginDetails)
            alert(response.data.message)
}catch(err){
        //console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}<div>` ;
    }
}
