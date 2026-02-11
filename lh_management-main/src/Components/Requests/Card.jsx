import React, { useState } from "react";

function Card(props) {
  const data=props.data
  let approveOrReject= props.approveOrReject
  const startDat=new Date(data.startDate)
  const endDat=new Date(data.endDate)
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <div className="w-full px-6 mt-1 ">
        <h2
          className={` w-full transition-all duration-300 ${open && ""}`}
          onClick={() => setOpen(!open)}
        >
          <button
            type="button"
            className={`flex items-center justify-between w-full p-5 font-medium text-left text-gray-500 border  border-gray-200 rounded-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 ${
              open && "rounded-b-none"
            } gap-2`}
            // onClick={() => setOpen(!open)}
          >
            {props.use==='gsec'?
            <span className="flex items-center">
             LT{data.ltNumber} for {data.clubName}
            </span>
            :
            <span className="flex items-center">
              {data.bookedBy} requests LT{data.ltNumber} for {data.clubName}
            </span>
            }
            <svg
              className="w-3 h-3 rotate-180 shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5 5 1 1 5"
              />
            </svg>
          </button>
        </h2>
        {open && (
          <div className="w-full" aria-labelledby="accordion-open-heading-1">
            <div className="p-5 border border-t-0 rounded-xl rounded-t-none  border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full">
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Lecture Hall :<span> LT{data.ltNumber}</span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Dates :<span> {startDat.toDateString()===endDat.toDateString()? `${startDat.toDateString()}`:`${startDat.toDateString()} - ${endDat.toDateString()}`}</span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Time :<span> {`${startDat.getHours()}:${startDat.getMinutes()}  - ${endDat.getHours()}:${endDat.getMinutes()}`} </span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                For :<span> {data.clubName}</span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Reason :<span> {data.reason}</span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Av Support Required :<span>{data.avSupport}</span>
              </p>
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Faculty mentor approval :<span> {data.facultyStatus}</span>
              </p>
              {data.avSupport==='yes'?
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                System Administrator  approval :<span> {data.systemAdministratorStatus}</span>
              </p>:
              null
              }
              <p className="mb-2 text-gray-500 dark:text-gray-400">
                Assistant Registrar approval :<span> {data.assistantRegistrarStatus}</span>
              </p>
              {
                data.pdf &&
              <a className="mb-2 text-gray-500 dark:text-gray-400" target="_blank" href={data?.pdf}>
                Night Extension pdf :<span className="text-blue-500"> {data?.pdf}</span>
              </a>
              }
              {(props.view==='pending' && props.use==='notgsec') && 
             
              <section className=" flex justify-end p-2 pb-0">
                <button
                  type="button"
                  onClick={()=>approveOrReject('approve',data._id)}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                >
                  Accept
                </button>

                <button
                  type="button"
                  onClick={()=>approveOrReject('reject',data._id)}
                  className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                >
                  Reject
                </button>
              </section>
}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Card;
