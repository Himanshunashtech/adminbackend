 class apiError extends Error{
  constructor(
    statusCode,
    message="Somthing went wrong",
    errors=[],
    
  ){
    super(message)
    this.statusCode= statusCode
    this.data=null
    this .message=message
    this .success= false;
    this.errors = errors
  }
 }
 export default {apiError}
