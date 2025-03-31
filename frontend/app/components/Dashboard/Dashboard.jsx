import Analytics from "./Analytics/Analytics";
import Map from "./Map/Map";
import MenuBar from "./MenuBar/MenuBar";

const Dashboard=()=>{
    
    return(
        <div className="w-full overflow-hidden pt-5 bg-black pr-5 my-0.5 justify-start gap-5 flex h-[calc(100vh-78px)]">
            <MenuBar/>
            <Map/>
            <Analytics/>
        </div>
    );

}

export default Dashboard;