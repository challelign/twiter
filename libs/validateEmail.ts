/**
* @Username part:
Allows alphanumeric characters, special characters like ., ", ', and _
Allows quotes around the username part
Disallows spaces in the username part 
  * 
  * @Domain part:
Allows standard domain names with top-level domains (e.g., .com, .org, .edu)
Allows IP addresses in the domain part
  */
const validateEmail = (email: string): boolean => {
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return emailRegex.test(email);
};
export default validateEmail;
