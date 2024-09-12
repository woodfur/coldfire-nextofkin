import Image from "next/image";
import { Product } from "@/components/types/product";
import { Chat } from "@/components/types/chat";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { BaseWalletMultiButton } from "@solana/wallet-adapter-react-ui";

const chatData: Chat[] = [
  {
    active: true,
    avatar: "/images/user/user-01.png",
    name: "Devid Heilo",
    text: "Hello, how are you?",
    time: "12 min",
    textCount: 3,
    dot: 3,
  },
  {
    active: true,
    avatar: "/images/user/user-02.png",
    name: "Henry Fisher",
    text: "I am waiting for you",
    time: "5:54 PM",
    textCount: 0,
    dot: 1,
  },
  {
    active: null,
    avatar: "/images/user/user-04.png",
    name: "Wilium Smith",
    text: "Where are you now?",
    time: "10:12 PM",
    textCount: 0,
    dot: 3,
  },
  {
    active: true,
    seen: true,
    avatar: "/images/user/user-05.png",
    name: "Henry Deco",
    text: "Thank you so much!",
    time: "Sun",
    textCount: 2,
    dot: 6,
  },
  {
    active: false,
    avatar: "/images/user/user-06.png",
    name: "Jubin Jack",
    text: "Hello, how are you?",
    time: "Oct 23",
    textCount: 0,
    dot: 3,
  },
];

const TableTwo = () => {
  return (

    <div>
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      

      <div className="rounded-[10px] grid grid-cols-6 border-t px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Name</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Email</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Wallet Address</p>
        </div>
       
       
      </div>

      {chatData.map((Chat, key) => (
        <div
          className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-.5"
          key={key}
        >
          <div className="col-span-3 flex items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-12.5 w-15 rounded-md mt-2 mb-2">
                <Image
                  src={Chat.avatar}
                  width={60}
                  height={50}
                  alt="Product"
                />
              </div>
              <p className="text-body-sm font-medium text-dark dark:text-dark-6">
                {Chat.name}
              </p>
            </div>
          </div>

          {/* <div className="col-span-2 hidden items-center sm:flex">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              {Chat.}
            </p>
          </div>
          <div className="col-span-1 flex items-center">
            <p className="text-body-sm font-medium text-dark dark:text-dark-6">
              ${product.price}
            </p>
          </div> */}
          
         
        </div>
      ))}

            
    
    </div>

    <div className="flex justify-center mt-6">
      <button className="rounded-[5px] px-10 py-3.5 bg-dark text-white font-medium rounded-full hover:bg-blue-600 transition-colors duration-300 ">
        Add Beneficiary
      </button>
    </div>
    </div>

  );

  
};

export default TableTwo;
