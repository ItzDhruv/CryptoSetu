import Image from "next/image";
import Dashboard from "./dashboard/dashboard";
import PrivyProvider from "./auth/PrivyProvider";
export default function Home() {
  return (
  
<PrivyProvider>
                  <div>
                <Dashboard/>
                  </div>
</PrivyProvider>

   
  );
}
