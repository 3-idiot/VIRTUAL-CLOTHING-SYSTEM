import React, { Component } from 'react';

//My Components
import { getFromStorage , setInStorage } from '../utile/storage';

class signUp extends Component {
  constructor(props){
    super(props);
    this.state={
      isLoading:true,
      token:'',
      signInError:'',
      signUpError:'',
      signInEmail:'',
      signInPassword:'',
      signUpName:'',
      signUpEmail:'',
      signUpPassword:'',
    };

    this.onChangeSignInEmail =this.onChangeSignInEmail.bind(this);
    this.onChangeSignInPassword =this.onChangeSignInPassword.bind(this);
    this.onChangeSignUpName =this.onChangeSignUpName.bind(this);
    this.onChangeSignUpEmail =this.onChangeSignUpEmail.bind(this);
    this.onChangeSignUpPassword =this.onChangeSignUpPassword.bind(this);

    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogOut = this.onLogOut.bind(this);
  }

  componentDidMount(){
    const token = getFromStorage('Log');
    if(token){
         fetch('http://localhost:619/user/verify?token='+ token.token)
                .then(res =>res.json())
                .then(json => {
                  if(json.success){
                    this.setState({
                      token,
                      isLoading : false,
                    })
                  }else{
                      this.setState({isLoading:false});
                    }
                });
      }else{
        this.setState({isLoading:false});
      }
  }

  onChangeSignInEmail(event){

    // this.setState( this.state.signInEmail.length <= 2  ? {signInError:"Name should not lesser than 3"}   :  null );
    // this.setState( this.state.signInEmail.length >= 14 ? {signInError:"Name should not greater than 15"} :  null  );
    // this.setState( this.state.signInEmail.length <= 14 && this.state.signInEmail.length >= 2  ? {signInError:""} :  null  );

    this.setState({signInEmail : event.target.value})
  };

  onChangeSignInPassword(event){

    // this.setState( this.state.signInPassword.length <= 2  ? {signInError:"Name should not lesser than 3"}   :  null );
    // this.setState( this.state.signInPassword.length >= 14 ? {signInError:"Name should not greater than 15"} :  null  );
    // this.setState( this.state.signInPassword.length <= 14 && this.state.signUpName.length >= 2  ? {signInError:""} :  null  );
    

    this.setState({signInPassword : event.target.value})
  };

  onChangeSignUpName(event){

    // this.state.signUpName.length <= 2   ? this.setState( {signUpError:"Name should not lesser than 3"})   : this.setState( {signUpError:""}  );
    // this.state.signUpName.length >= 14  ? this.setState( {signUpError:"Name should not greater than 15"}) : this.setState( {signUpError:""}  );

    // this.setState( this.state.signUpName.length <= 2  ? {signUpError:"Name should not lesser than 3"}   :  null );
    // this.setState( this.state.signUpName.length >= 14 ? {signUpError:"Name should not greater than 15"} :  null  );
    // this.setState( this.state.signUpName.length <= 14 && this.state.signUpName.length >= 2  ? {signUpError:""} :  null  );
    
    this.setState({signUpName : event.target.value})
  };

  onChangeSignUpEmail(event){
    // const regExp=/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/
    // this.state.signUpEmail.length <= 2   ? this.setState({signUpError:"Email should not lesser than 3"})   : this.setState( {signUpError:""}  );
    // regExp.test(this.state.signUpEmail) ?this.setState({signUpError:"Invalid formate of Email "})   : this.setState( {signUpError:""}  );
    // this.state.signUpEmail.length >= 14  ? this.setState({signUpError:"Email should not greater than 15"})   : this.setState( {signUpError:""}  );
   
    this.setState({signUpEmail : event.target.value})
  };

  onChangeSignUpPassword(event){

    // this.state.signUpPassword.length <= 2   ? this.setState( {signUpError:"Password should not lesser than 3"})   : this.setState( {signUpError:""}  );
    // this.state.signUpPassword.length >= 14  ? this.setState( {signUpError:"Password should not greater than 15"}) : this.setState( {signUpError:""}  );
   
    this.setState({signUpPassword : event.target.value})
  };
  
  onSignIn(){
    //set data value 
    const {
      signInEmail,
      signInPassword
    }= this.state;
    
    //Checking weather email,password are not empty
    if(signInEmail === '' || signInEmail === undefined ){
        this.setState({signInError : "Please Enter the your E-mail."}) ;
      }else if(signInPassword === '' || signInPassword === undefined ){
        this.setState({signInError : "Please Enter the your password."}) ;
      }else{

      this.setState({isLoading:true});
      // post request to backend 
      fetch('http://localhost:619/user/signIn',{
            method:'POST',
            headers:{
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              email:signInEmail,
              password : signInPassword
            }),
          })
            .then(res => res.json())
            .then( json =>{
              if(json.success){
                setInStorage('Log', { token: json.token })
                this.setState({
                  signInError:json.message,
                  isLoading:false ,
                  signInEmail:'',
                  signInPassword:'',
                  token:json.token,
                });
                
              } else {
              
                  this.setState({
                    signInError:json.message,
                    isLoading:false ,
                    
                  });
              }

            } )
    }

  };

  onSignUp(){
     //set data value 
     const {
      signUpName,
      signUpEmail,
      signUpPassword
    }= this.state;

    //Checking weather name ,email,password are not empty
    if (signUpName === '' ||signUpName === undefined ){
     this.setState({signUpError : "Please Enter the your good name."}) ;
     }else if(signUpEmail === '' ||signUpEmail === undefined ){
      this.setState({signUpError : "Please Enter the your E-mail."}) ;
     }else if(signUpPassword === '' ||signUpPassword === undefined ){
      this.setState({signUpError : "Please Enter the your password."}) ;
     }else{

      this.setState({isLoading:true});
      // post request to backend 
      fetch('http://localhost:619/user/signUp',{
            method:'POST',
            headers:{
              'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
              name:signUpName,
              email:signUpEmail,
              password : signUpPassword
            }),
          })
            .then(res => res.json())
            .then( json =>{
              if(json.success){
                setInStorage('Log', { token: json.token })
                this.setState({
                  signUpError:json.message,
                  isLoading:false ,
                  signUpName:'',
                  signUpEmail:'',
                  signUpPassword:'',
                  token:json.token,
                });
                
              } else {
                  this.setState({
                    signUpError:json.message,
                    isLoading:false ,
                  });
              }
            } )

    }
  };

  onLogOut(){
    // this.setState({isLoading : true}); **
    const token = getFromStorage("Log");
    if(token){
      fetch('http://localhost:619/user/logout?token='+ token.token)
            .then(res => res.json())
            .then(json =>{
              if(json.success){
                localStorage.removeItem("Log");
                this.setState({token:''});
              }
            })       
      }
     

  };

  render() {
    const {
      token,
      isLoading,
      signInError,
      signInEmail,
      signInPassword,
      signUpError,
      signUpName,
      signUpEmail,
      signUpPassword
    }=this.state;

    if(isLoading){
      return (<h1> Loading ...</h1>);
    }

    if(!token){
      return(
        <>
          {signInError}
          <h1>SignIn<br/></h1>
            <input value = { signInEmail } onChange={ this.onChangeSignInEmail  }  type='email' placeholder='Email' required/><br/>
            <input value = { signInPassword }  onChange={ this.onChangeSignInPassword} type='password' placeholder ='Password' required/><br/><br/>
            <button onClick = { this.onSignIn} >Sing In</button><br/>
          
          {signUpError} 
          <h1><br/>SignUp</h1>
            <input value = { signUpName }  onChange={ this.onChangeSignUpName } type ='text' placeholder='User Name' required/><br/>
            <input value = { signUpEmail}  onChange={ this.onChangeSignUpEmail } type='email' placeholder='Email' required/><br/>
            <input value = { signUpPassword}  onChange={ this.onChangeSignUpPassword } type='password' placeholder ='Password' required/><br/><br/>
            <button onClick = { this.onSignUp}>Sing Up</button><br/>
        </>
        )
    }
    
    return (
      <>
        <h1>Account</h1>
        <button onClick={this.onLogOut }> Logout </button>
      </>
    );
  }
}

export default signUp;