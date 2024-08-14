import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";

export default function CreditCard () {
    // onChange => form => console.log(form);
    const onChange = (form) =>{
        console.log(form);
    }
    return (
        <CreditCardInput onChange={onChange} />
    )
}