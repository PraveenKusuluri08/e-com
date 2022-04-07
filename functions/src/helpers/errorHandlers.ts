class ErrorHandlers {
  static generateAuthCreateUserError(err:{code:string}):unknown {
    console.log("err😆",err);
    if (err.code==="auth/email-already-exists") {
      return "Email alredy exists please try to do login"
    }
    return err
  }
}

export default ErrorHandlers;
