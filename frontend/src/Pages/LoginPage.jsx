
import {React,useState} from "react"
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const DOMAIN = import.meta.env.VITE_DOMAIN;

const Data = [
    {
        id:"1",
        role:"User"
    },
    {
        id:"2",
        role:"Admin"
    },
    {
        id:"3",
        role:"Bidder"
    }
]
const LoginPage = () => {
    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role,setRole] = useState("User"); 
    const [adminKey,setAdminKey] = useState(""); 
    const [team,setTeam] = useState("");
    const [bidderID,setBidderID] = useState("");
    const navigate = useNavigate()

    const onSubmit = async() => {
        if (role === "User"){
            if (role !== "" && email !== "" && password !== "") {
                const body = {
                    role: role,
                    email: email,
                    password: password
                }
                try {
                    const response = await axios.post(DOMAIN + "/auth/login", body);
                    console.log(response.data);
                    toast.success("User logged in successfully");
                }
                catch (err) {
                    console.log(err);
                    toast.error("Invalid Email or Password");
                }
            }
        }
        else if (role === "Admin"){
            if (adminKey !== ""){
                try{
                    const response = await axios.post(DOMAIN + "/admin/login",{adminKey:adminKey});
                    toast.success("Admin logged in successfully");
                    console.log(response.data);
                }catch(err){
                    console.log(err);
                    toast.error("Invalid Admin Key");
                }
            }
        }
        else if (role === "Bidder"){
            if (team !== "" && bidderID !== ""){
                try{
                    const response = await axios.post(DOMAIN + "/bidder/login",{team:team,bidderID:bidderID});
                    console.log(response.data);
                    toast.success("Bidder Logged Successfully ")
                }
                catch(err){
                    console.log(err);
                    toast.error("Invalid Bidder Value")
                }
            }
        }

    
        }

    const onCreateAccount = (role,name,email,password) => {
        if (role !== "" && email !== "" && password !=="" ){
            try{
                const reponse = axios.post(DOMAIN + "/auth/register",{
                    role: role,
                    name: name,
                    email: email,
                    password: password
                })
                console.log(reponse.data);
                toast.success("User Registered Successfully")
                navigate("/")
            }
            catch(err){
                console.log(err);
                toast.error("Invalid Values")
            }

        }
    }

    
    

    return (
        <div className="min-w-screen">
            <form className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
            <p className="text-lg m-auto">
                <ul className="flex gap-10">
                    {
                        Data.map((item)=>(
                            <li key={item.id} className ={`list-none cursor-pointer ${role == item.role ? "text-blue-700 font-medium" : "text-gray-400 text-md"}`} onClick={()=>setRole(item.role)}>{item.role}</li>
                        ))

                    }
                </ul>
            </p>
            {(state === "register" && role == "User") && (
                <div className="w-full">
                    <p>Name</p>
                    <input  onChange={(e) => setName(e.target.value)} value={name} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                </div>
            )}
            {
                role === "User" && 
                <>
                    <div className="w-full ">
                        <p>Email</p>
                        <input required onChange={(e) => setEmail(e.target.value)} value={email} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="email"  />
                    </div>
                    <div className="w-full ">
                        <p>Password</p>
                        <input required onChange={(e) => setPassword(e.target.value)} value={password} placeholder="type here" className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password"  />
                    </div>
                </>
            }
            {
                role === "Admin" &&
                <>
                    <div className="w-full ">
                        <p>Admin Key</p>
                        <input placeholder="type here" onChange={(e)=>setAdminKey(e.target.value)}className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="password" required />
                    </div>
                </>

            }
            {
                role === "Bidder" &&
                <>

                    <div className="w-full ">
                        <p>IPL Team</p>
                        <input placeholder="type here" onChange={(e)=>setTeam(e.target.value)} className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                    </div>
                    <div className="w-full ">
                        <p>Bidder ID</p>
                        <input placeholder="type here" onChange={(e)=>setBidderID(e.target.value)} className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500" type="text" required />
                    </div>
                </>
                
            }
            {

                (state === "register")? (
                <p>
                    Already have account? <span onClick={() => setState("login")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            ) : (
                <p>
                    Create an account? <span onClick={() => setState("register")} className="text-indigo-500 cursor-pointer">click here</span>
                </p>
            )
            }
            
            {
                (state === "register") ? (
                    <button className="bg-gray-400  hover:bg-gray-900 transition-all text-gray-600  w-full py-2 rounded-md cursor-pointer" onClick={()=>{onCreateAccount(role,name,email,password)}}>
                        Create Account
                    </button>
            )
            :
            (
                    <button className="bg-gray-400  hover:bg-gray-900 transition-all text-gray-600  w-full py-2 rounded-md cursor-pointer" onClick={()=>{onSubmit()}}>
                        Login
                    </button>
            )
            }

        </form>
        </div>
    );
};

export default LoginPage;