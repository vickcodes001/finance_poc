
import { useState } from "react";
import axios from "axios";
// import User from "./test/User";

// interface Step1Response {
//   data: {
//     mono_url: string;
//   }
// }

interface FinalData {
  balance: string;
  name: string;
  currency: string;
}


const App = () => {

  const [finalData, setFinalData] = useState<FinalData | null>(null);

  const handleStart = async () => {
    try {
      const accountGotten = await axios.get("http://localhost:5000/accounts")
      console.log("account:", accountGotten);
      setFinalData(accountGotten.data.data[0])
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <div>
      {/* <User /> */}
      <p>Welcome to FinPlan</p>
      <p>This is a P.O.C to check if we can get your bank details, lol...</p>
      <button onClick={handleStart}>connect wallet</button>
      <p>hello {finalData?.name}, <br /> your account balance is {finalData?.balance} {finalData?.currency}</p>
    </div>
  );
}

export default App