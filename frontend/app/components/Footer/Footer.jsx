import Image from "next/image";
import playstore from "../../assets/images/app-store-and-google-play 1.png";
import appstore from "../../assets/images/app-store-and-google-play 2.png";

const Footer=()=>{

    return(
        <div className="bg-[#00264C] relative w-full px-20 pt-14">
            <div className="text-white flex justify-between ">
                <ul className="flex flex-col font-medium gap-0.5 ">
                    <li className="text-lg">Contact Us :</li>
                    <li>KK Wagh college of Engineering</li>
                    <li>Nashik, Maharshatra</li>
                    <li>Phone Number: +91 58 125 XXXX</li>
                    <li>WhatsApp: +91 58 125 XXXX</li>
                </ul>
                <ul className="flex flex-col gap-2 font-semibold">
                    <li>Privacy Policy</li>
                    <li>Payment Policy</li>
                    <li>Terms of use</li>
                </ul>
                </div>
                <div className="mt-14 pb-10 gap-2 flex flex-col ">
                <h1 className="text-white">Available Soon</h1>
                <div className="flex gap-3">
                    <Image className="w-28 h-10" src={appstore} alt="appstore"></Image>
                    <Image className="w-28 h-10" src={playstore} alt="playstore"></Image>
                </div>
            </div>
        </div>    
    );
}

export default Footer;