async function signup(e) {
    try{
        e.preventDefault();

        const signUpDetails = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        //console.log(signUpDetails);
        const response = await axios.post('http://54.250.135.169:4000/user/signup', signUpDetails)
        if(response.status === 201){
            alert(response.data.message)
            window.location.href = "./login.html"
        } else {
            throw new Error('Failed to login')
        }
    }catch(err){
        document.body.innerHTML += `<div style="color:red;">${err}<div>`;
    }
}