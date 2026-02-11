import React from "react";

function BookedLtCard(data) {
  // console.log(data)
  let {ltNumber,startDate,endDate,avSupport,endTime,reason,clubName,facultyStatus,systemAdministratorStatus,assistantRegistrarStatus,facultyMentorEmail}=data.data
  const startDat=new Date(startDate)
  const endDat=new Date(endDate)
  // console.log(startDate)

  return (
    <main>
      <div
        className="flex flex-col items-center max-w-xs p-3 lg:p-6   bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 m-2"
      >
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {`LT${ltNumber}`}
        </h5>
        <p className="font-normal items-center text-gray-700 flex flex-col dark:text-gray-400">
            <span>{`${clubName}`}</span>
            <span>{`${startDat.getHours()}:${startDat.getMinutes()}  - ${endDat.getHours()}:${endDat.getMinutes()}  `}</span>
            <span>{startDat.toDateString()===endDat.toDateString()? `${startDat.toDateString()}`:`${startDat.toDateString()} - ${endDat.toDateString()}`} </span>
            <span>AV Support : {avSupport}</span>
        </p>
      </div>
      
    </main>
  );
}

export default BookedLtCard;
